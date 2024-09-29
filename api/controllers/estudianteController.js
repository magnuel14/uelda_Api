"use strict";
const jwt = require("jsonwebtoken");
const models = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const cedulaValidator = require("../../helpers/cedulaHelper");
const dotenv = require("dotenv");
dotenv.config();
const mailing = require("../../helpers/emailTemplates");

const Persona = models.persona;
const Representante = models.representante;
const Hermano = models.hermano;
const Cuenta = models.cuenta;
const InfoMedica = models.infoMedica;
const AnioLectivo = models.anioLectivo;
const Matricula = models.matricula;
const Materia = models.materia;
const AsistenciaXDia = models.asistenciaXDia;
const AsistenciaXMate = models.asistenciaXMate;
const CalificacionQ = models.calificacionQ;
const CalificacionT = models.calificacionT;
const Paralelo = models.paralelo;
const Curso = models.curso;

let controller = {
  /** Implementado try cath*/
  /**getEstudiantes: Funcion get para obtener la lista de usuarios con rol estudiante
   * @param {*} req
   * @param {*} res
   * @returns Una lista en formato json de los estuidantes registrados
   */
  getEstudiantes: async (req, res) => {
    const estudiantes = await Persona.findAll({
      include: [Cuenta],
      where: { id_rol: 6 },
    });
    res.json(estudiantes);
  },
  /**getEstudiantes: Funcion get para obtener la lista de usuarios con rol estudiante
   * @param {*} req
   * @param {*} res
   * @returns Una lista en formato json de los estuidantes registrados
   */
  getEstudiantesExternal: async (req, res) => {
    const estudiantes = await Persona.findAll({
      attributes: ["external_id"],
      where: { id_rol: 6, estadoAc: null },
    });
    res.json(estudiantes);
  },
  /**
   * getEstudianteByEx: Función gte para recuperar un estudiante segun su external
   * @param {*} req externalId
   * @param {*} res
   * @returns Una lista en formato json de la información del estudiante en caso que exista
   */
  getEstudianteByEx: async (req, res) => {
    const { externalId } = req.params;
    const infoEstudiante = await Persona.findOne({
      where: { external_id: externalId },
    });
    return res.json({ infoEstudiante });
  },
  /**
   * createPerson: Funcion para crear un nuevo usuario con rol estudiante.
   * @param {*} req
   * @param {*} res
   * Recibe una lista de información personal, de indole familiar y dirección de su domicilio
   * Se genera las credenciales para la tabla cuenta, con el correro personal y numero de identificación, al ser esta
   * la clave, será encriptada.
   * Ademas generá informacion por defecto para la tabla infoMedica y perfilProfesional
   * Antes de registrar esta información, se comprueba si la cedula es ecuatoriana y si ya existe una persona con ese numero
   * de identificación
   * @returns La información de la persona y su cuenta.
   */
  createEstudiante: async (req, res) => {
    const { externalId, nombre, apellido, tipoDocId, numeroId, correoPersonal} = req.body;
    const numeroIdString = String(numeroId);
    // Verificar permisos
    const infoPersonal = await controller.verificarPermisos(externalId);
    if (!infoPersonal) { return res.json({ message: "No tiene los permisos para crear un usuario nuevo.", flag: 1 });}
    // Verificar si el estudiante ya existe
    const exists = await controller.verificarExistenciaEstudiante(numeroIdString, correoPersonal);
    if (exists) { return res.json({ message: "Ya existe un estudiante con esta información", flag: 1}); }

    // Validar correo
    const infoEstudianteCuenta = await Persona.findOne({ where: { correoPersonal } });
    if (infoEstudianteCuenta) { return res.json({message: "Ya existe un estudiante con ese correo", flag: 1}); }
    // Preparar datos del estudiante
    const estudianteData = { nombre, apellido, tipoDocId, numeroId: numeroIdString, correoPersonal, id_rol: "6" };
    // Crear estudiante dependiendo del tipo de documento
    if (tipoDocId === "pasaporte") {
      return await controller.crearEstudiante(estudianteData, numeroIdString, res);
    }
    const cedulaValida = cedulaValidator.validator(numeroIdString);
    if (cedulaValida.flag !== 3) {
      return res.json({ message: cedulaValida.message, flag: 1 });
    }
    // Crear estudiante con cédula
    return await controller.crearEstudiante(estudianteData, numeroIdString, res);
  },

  verificarPermisos: async (externalId) => {
    const infoPersonal = await Persona.findOne({ where: { external_id: externalId } });
    return infoPersonal && (infoPersonal.id_rol === 2 || infoPersonal.id_rol === 4);
  },

  verificarExistenciaEstudiante: async (numeroIdString, correoPersonal) => {
    const searchPersona = await Persona.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { numeroId: numeroIdString },
              { correoPersonal: correoPersonal },
            ],
          },
          { id_rol: 6 },
        ],
      },
    });
    return !!searchPersona;
  },

  crearEstudiante: async (estudianteData, numeroIdString, res) => {
    const estudiante = await Persona.create(estudianteData);
    const password = await controller.generarContraseña(numeroIdString);

    const dataCuenta = {
      correo: estudianteData.correoPersonal,
      clave: password,
      estado: 0,
      id_persona: estudiante.id,
    };

    const newEstudianteCuenta = await Cuenta.create(dataCuenta);
    if (!newEstudianteCuenta) {
      return res.json({
        message: "La cuenta no se pudo crear, revise bien su información.",
        flag: 1,
      });
    }

    await controller.crearInfoMedica(estudiante.id);
    await mailing.sendNewUserEmail(estudianteData);

    return res.json({
      message: "Ha generado un nuevo usuario",
      estudiante,
      flag: 0,
    });
  },

  generarContraseña: async (numeroIdString) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(numeroIdString, salt);
  },

  crearInfoMedica: async (id_persona) => {
    const dataInfoMed = {
      id_persona,
      discapacidad: "1",
      tipoDiscapacidad: "N/A",
      porcentajeDiscapacidad: "N/A",
      nCarnetDiscapacidad: "N/A",
      enfermedadCatastrofica: "1",
      tipoEnfermedadCatastrofica: "N/A",
    };

    await InfoMedica.create(dataInfoMed);
  },
  /**
   * getEstudianteByEx: Función gte para recuperar un estudiante segun su external
   * @param {*} req externalId
   * @param {*} res
   * @returns Una lista en formato json de la información del estudiante en caso que exista
   */
  getEstudianteByEx: async (req, res) => {
    try {
      const { externalId } = req.params;

      // Buscar el estudiante por externalId
      const estudiante = await Persona.findOne({
        where: { external_id: externalId },
      });

      const response = {
        infoEstudiante: estudiante,
      };

      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  /**
   * Obtener calificaciones por estudiante external ID
   * @param {*} req
   * @param {*} res
   * @returns
   */
  getCalificacionesEstudianteByExternalId: async (req, res) => {
    try {
      const { externalId } = req.params;

      // Buscar el estudiante por externalId
      const estudiante = await Persona.findOne({
        where: { external_id: externalId },
        attributes: ["id", "nombre", "apellido", "numeroId", "correoPersonal"],
      });

      if (!estudiante) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }

      const anioLectivoActual = await AnioLectivo.findOne({
        where: { estadoAniolectivo: 0 },
        attributes: ["id"],
      });

      if (!anioLectivoActual) {
        return res
          .status(404)
          .json({ error: "No existe un año lectivo activo" });
      }

      // Buscar la matrícula del estudiante
      const matricula = await Matricula.findOne({
        where: {
          id_persona: estudiante.id,
          id_anioLectivo_actual: anioLectivoActual.id,
        },
      });

      if (!matricula) {
        return res
          .status(404)
          .json({ error: "Matrícula no encontrada para este estudiante" });
      }

      //buscar paralelo del estudiante
      const paralelo = await Paralelo.findOne({
        where: { id: matricula.id_paralelo },
        include: [Curso],
      });

      // Buscar las calificaciones por trimestre o quimestre de la matrícula
      let calificaciones = [];
      let tipoCalificacion = "";

      if (anioLectivoActual.tipoCalificacion == 0) {
        calificaciones = await CalificacionQ.findAll({
          where: { id_matricula: matricula.id },
          include: [
            {
              model: Materia,
              attributes: ["nombre", "area"],
            },
          ],
        });
        tipoCalificacion = "quimestre";
      } else {
        calificaciones = await CalificacionT.findAll({
          where: { id_matricula: matricula.id },
          include: [
            {
              model: Materia,
              attributes: ["nombre", "area"],
            },
          ],
        });
        tipoCalificacion = "trimestre";
      }

      const response = {
        infoEstudiante: estudiante,
        calificaciones: calificaciones,
        tipoCalificacion: tipoCalificacion,
        paralelo: paralelo,
      };

      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  /**
   * updateEstudiante: Esta función sirve para editar la información del estudiante
   * @param {*} req
   * @param {*} res
   * Recibe la lista de atributos segun su modelo descritos en Persona, pero con la restricción
   * de que hay que diferenciar campos para el personal y para el estudiante como:
   *  estadoPadres, listaHogar, estadoAc.
   * Se carga el externalId del Estudiante el cual se usa en la condicion "where" (sql)
   * Y la upateEstudianteData que es la informacin nueva para el Estudiante
   * @returns Un mensaje de comprobación del estado de la tarea
   */
  updateEstudiante: async (req, res) => {
    const {
      externalId,
      nombre,
      apellido,
      nacionalidad,
      cuidadNaci,
      provincia,
      fechaNaci,
      edad,
      correoPersonal,
      celular,
      telefono,
      etnia,
      tipoGenero,
      parroquia,
      barrio,
      refeCasa,
      idenCasa,
      callePrin,
      calleSecond,
      codigoUnicLuz,
      estadoPadres,
      listaHogar,
      estadoAc,
    } = req.body;
    const upateEstudianteData = {
      nombre: nombre,
      apellido: apellido,
      nacionalidad: nacionalidad,
      cuidadNaci: cuidadNaci,
      provincia: provincia,
      fechaNaci: fechaNaci,
      edad: edad,
      correoPersonal: correoPersonal,
      celular: celular,
      telefono: telefono,
      etnia: etnia,
      tipoGenero: tipoGenero,
      parroquia: parroquia,
      barrio: barrio,
      refeCasa: refeCasa,
      idenCasa: idenCasa,
      callePrin: callePrin,
      calleSecond: calleSecond,
      codigoUnicLuz: codigoUnicLuz,
      estadoPadres: estadoPadres,
      listaHogar: listaHogar,
      estadoAc: estadoAc,
    };
    const dataCuenta = {
      correo: correoPersonal,
    };
    const infoPersona = await Persona.findOne({
      where: { external_id: externalId },
    });
    const infoEstudianteCuenta = await Persona.findOne({
      where: { correoPersonal: correoPersonal },
    });
    if (infoPersona) {
      if (infoEstudianteCuenta) {
        if (infoPersona.id == infoEstudianteCuenta.id) {
          const updateDataCuenta = await Cuenta.findOne({
            where: { id_persona: infoPersona.id },
          });
          await Cuenta.update(dataCuenta, {
            where: { id: updateDataCuenta.id },
          });
          await Persona.update(upateEstudianteData, {
            where: { external_id: externalId },
          });
          return res.json({
            message: "Se ha actualizado la información del estudiante",
          });
        } else {
          return res.json({ message: "Este correo esta ligado a otra cuenta" });
        }
      } else {
        const updateDataCuenta = await Cuenta.findOne({
          where: { id_persona: infoPersona.id },
        });
        await Cuenta.update(dataCuenta, { where: { id: updateDataCuenta.id } });
        await Persona.update(upateEstudianteData, {
          where: { external_id: externalId },
        });
        return res.json({
          message: "Se ha actualizado la información del estudiante",
        });
      }
    } else {
      return res.json({
        message: "No existe un estudiante con esta información",
      });
    }
  },
  /**
   * getRepresentanteByEx: Función para obtener el o los representantes registrados del estudiante según su
   * externalId
   * Se hace una busqueda del estudiante, el externalId se lo emplea en la condicion "where" (sql)
   * @param {*} req externalId
   * @param {*} res
   * @returns Una lista en formato json del o los representantes registrados
   */
  getRepresentantesByEx: async (req, res) => {
    const { externalId } = req.params;
    const infoEstudiante = await Persona.findOne({
      where: { external_id: externalId },
    });
    const infoRepresentante = await Representante.findAll({
      where: { id_persona: infoEstudiante.id },
    });
    return res.json({ infoRepresentante });
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  getRepresentanteByDNI: async (req, res) => {
    const { numeroId } = req.params;
    //const infoEstudiante = await Persona.findOne({ where: { external_id: externalId } });
    const infoRepresentante = await Representante.findOne({
      where: { numeroId: numeroId },
    });
    return res.json({ infoRepresentante });
  },
  /**
   *createRepresentante: Función para crear un representante
   *Se recibe una lista de atributos especificados en el modelo de representante
   *Se comprueba si ya existe un representante segun su numero de DNI
   *Se comprueba si ya existe un representante con autorizacionRetirarDoc = 0,
   *Esto debido a que solo un representante debe tener esta autorización
   *Se coprueba si el docuemnto DNI es pasaporte o cedula
   *En caso de ser cedula e la valida
   * @param {*} req
   * @param {*} res
   * @returns Un mensaje del estado de la tarea
   */
  createRepresentante: async (req, res) => {
    const {
      externalId,
      nombre,
      apellido,
      nacionalidad,
      tipoDocId,
      numeroId,
      correoPersonal,
      celular,
      nivelEdu,
      ocuLab,
      direcTrabajo,
      teleTrabajo,
      relacionFamiliar,
      contactoEmer,
      autorizacionRetirarDoc,
    } = req.body;
    const searchRepresentante = await Representante.findOne({
      where: {
        [Op.or]: [{ numeroId: numeroId }, { correoPersonal: correoPersonal }],
      },
    });
    const infoPersona = await Persona.findOne({
      where: { external_id: externalId },
    });
    const infoRepresentantes = await Representante.findAll({
      where: { id_persona: infoPersona.id },
    });
    if (infoRepresentantes.length <= 2) {
      if (!searchRepresentante) {
        if (tipoDocId == "pasaporte") {
          const representnateData = {
            nombre: nombre,
            apellido: apellido,
            nacionalidad: nacionalidad,
            correoPersonal: correoPersonal,
            celular: celular,
            tipoDocId: tipoDocId,
            numeroId: numeroId,
            nivelEdu: nivelEdu,
            ocuLab: ocuLab,
            direcTrabajo: direcTrabajo,
            teleTrabajo: teleTrabajo,
            relacionFamiliar: relacionFamiliar,
            contactoEmer: contactoEmer,
            autorizacionRetirarDoc: autorizacionRetirarDoc,
            id_persona: infoPersona.id,
          };
          const newRepresentante = await Representante.create(
            representnateData
          );
          return res.json({
            message: "Se ha ingresado la información de su representante",
            newRepresentante,
          });
        } else {
          const cedulaValida = cedulaValidator.validator(numeroId);
          if (cedulaValida.flag == 3) {
            const representnateData = {
              nombre: nombre,
              apellido: apellido,
              nacionalidad: nacionalidad,
              correoPersonal: correoPersonal,
              celular: celular,
              tipoDocId: tipoDocId,
              numeroId: numeroId,
              nivelEdu: nivelEdu,
              ocuLab: ocuLab,
              direcTrabajo: direcTrabajo,
              teleTrabajo: teleTrabajo,
              relacionFamiliar: relacionFamiliar,
              contactoEmer: contactoEmer,
              autorizacionRetirarDoc: autorizacionRetirarDoc,
              id_persona: infoPersona.id,
            };
            const newRepresentante = await Representante.create(
              representnateData
            );
            return res.json({
              message: "Se ha ingresado la información de su representante",
              newRepresentante,
            });
          } else {
            return res.json({ message: cedulaValida.message });
          }
        }
      } else {
        return res.json({
          message:
            "Ya existe un representante con ese numero de DNI o Correo Personal",
        });
      }
    } else {
      return res.json({
        message: "El estudiante solo puede tener como maximo 3 representantes",
      });
    }
  },

  /**
   *updateRepresentante: Función para actulizar datos de un representante
   *Se recibe una lista de atributos especificados en el modelo de representante
   *a excepción de tipo tipoDocId, numeroId.
   *Se comprueba si ya existe un representante segun su numero de DNI
   *Se comprueba si ya existe un representante con autorizacionRetirarDoc = 0,
   *Esto debido a que solo un representante debe tener esta autorización
   * @param {*} req
   * @param {*} res
   * @returns Un mensaje del estado de la tarea
   */
  updateRepresentante: async (req, res) => {
    const {
      externalId,
      nombre,
      apellido,
      nacionalidad,
      correoPersonal,
      celular,
      nivelEdu,
      ocuLab,
      direcTrabajo,
      teleTrabajo,
      relacionFamiliar,
      contactoEmer,
      numeroId,
      autorizacionRetirarDoc,
    } = req.body;
    const updateRepresentanteData = {
      nombre: nombre,
      apellido: apellido,
      nacionalidad: nacionalidad,
      correoPersonal: correoPersonal,
      celular: celular,
      nivelEdu: nivelEdu,
      ocuLab: ocuLab,
      direcTrabajo: direcTrabajo,
      teleTrabajo: teleTrabajo,
      relacionFamiliar: relacionFamiliar,
      contactoEmer: contactoEmer,
      autorizacionRetirarDoc: autorizacionRetirarDoc,
    };
    const infoPersona = await Persona.findOne({
      where: { external_id: externalId },
    });
    const searchRepresentante = await Representante.findOne({
      where: {
        [Op.and]: [{ numeroId: numeroId }, { id_persona: infoPersona.id }],
      },
    });

    if (searchRepresentante) {
      const searchRepresentanteByemail = await Representante.findOne({
        where: { correoPersonal: correoPersonal },
      });
      if (searchRepresentanteByemail) {
        if (searchRepresentante.id == searchRepresentanteByemail.id) {
          const updateRepresentante = await Representante.update(
            updateRepresentanteData,
            { where: { numeroId: numeroId } }
          );
          return res.json({
            message: "Se ha actualizado la información de su representante",
            updateRepresentante,
          });
        } else {
          return res.json({
            message: "Este correo esta ligado a otro representante 1",
          });
        }
      } else if (!searchRepresentanteByemail) {
        const updateRepresentante = await Representante.update(
          updateRepresentanteData,
          { where: { numeroId: numeroId } }
        );
        return res.json({
          message: "Se ha actualizado la información de su representante",
          updateRepresentante,
        });
      }
    } else {
      return res.json({ message: "El representante no existe" });
    }
  },

  /**
   *deleteRepresentante: Función para eliminar al representante
   *Se recibe el externalId del estudiante y el numeroId del representante
   *Se comprueba si existe un representante segun su numero de DNI
   *Se comprueba si almenos hay un representante registrado
   *En caso de que solo exista un representante registrado no se puede elimnar a dicho representante
   * @param {*} req
   * @param {*} res
   * @returns Un mensaje del estado de la tarea
   */
  deleteRepresentante: async (req, res) => {
    const { externalId, numeroId } = req.body;
    const infoPersona = await Persona.findOne({
      where: { external_id: externalId },
    });
    const infoRepresentantes = await Representante.findAll({
      where: { id_persona: infoPersona.id },
    });
    const searchRepresentante = await Representante.findOne({
      where: { numeroId: numeroId },
    });
    if (searchRepresentante) {
      if (infoRepresentantes.length == 1) {
        return res.json({
          message:
            "No se puede eliminar, el estudiante debe tener almenos 1 representante registrado.",
        });
      } else {
        const deleteRepresentante = await Representante.destroy({
          where: { numeroId: numeroId },
        });
        return res.json({
          message: "Se ha eliminado a su representante",
          deleteRepresentante,
        });
      }
    } else {
      return res.json({
        message: "No existe un representante con esa infórmación",
      });
    }
  },

  /**
   * getAllhermanos: Función para recuperar todos los hermanos del estudiante segun
   * el externalId del estudiante
   * @param {*} req
   * @param {*} res
   * @returns Una lista de hermanos en formato json
   */
  getAllhermanos: async (req, res) => {
    const { externalId } = req.params;
    const infopersona = await Persona.findOne({
      where: { external_id: externalId },
    });
    const infoHermanos = await Hermano.findAll({
      where: { id_persona: infopersona.id },
    });
    let containerHermanos = [];
    for (let i = 0; i < infoHermanos.length; i++) {
      const element = infoHermanos[i].id_hermano;
      const infoHermano = await Persona.findOne({ where: { id: element } });
      const nombre = infoHermano.nombre;
      const apellido = infoHermano.apellido;
      const numeroId = infoHermano.numeroId;
      containerHermanos.push({
        nombre: nombre,
        apellido: apellido,
        numeroId: numeroId,
        id: element,
      });
    }
    return res.json({ containerHermanos });
  },

  /**
   * addHermano: Funciónpra agregar un hermano que este registrado en el sistema
   * se hace la busqueda de un estudiante segun su numero de DNI
   * En caso de exista una persoana que cumpla con esta condición
   * Se agrega un hermano al estudiante
   * En esta tabalsolo se guarda el id del estudiante
   * debido a que el resto de la informacion
   * @param {*} req
   * @param {*} res
   * @returns
   */
  addHermano: async (req, res) => {
    const { externalId, numeroId } = req.body;
    const infoEstudiante = await Persona.findOne({
      where: { external_id: externalId },
    });
    const infoHermano = await Persona.findOne({
      where: { numeroId: numeroId },
    });
    if (infoHermano) {
      if (infoEstudiante.numeroId == infoHermano.numeroId) {
        return res.json({
          message: "No se puede agregarse a usted mismo como hermano",
        });
      } else {
        const hermanoData = {
          id_hermano: infoHermano.id,
          id_persona: infoEstudiante.id,
        };
        const newHermano = await Hermano.create(hermanoData);
        return res.json({ message: "Se ha guardado  su hermano", newHermano });
      }
    } else {
      return res.json({
        message: "No existe un estudiante con este numero de DNI",
      });
    }
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  deleteHermano: async (req, res) => {
    const { numeroId } = req.body;
    const searchHermano = await Persona.findOne({
      where: { numeroId: numeroId },
    });
    if (searchHermano) {
      await Hermano.destroy({ where: { id_hermano: searchHermano.id } });
      return res.json({ message: "Se ha eliminado su hermano" });
    } else {
      return res.json({ message: "Error al Eliminar" });
    }
  },

  /**
   * registroEstudiantes: Funcion para crear una lista de nuevos usuarios con el  rol de estudiante.
   * @param {*} req
   * @param {*} res
   * Recibe una lista de información personal, de indole familiar y dirección de su domicilio
   * Se genera las credenciales para la tabla cuenta, con el correro personal y numero de identificación, al ser esta
   * la clave, será encriptada.
   * Ademas generá informacion por defecto para la tabla infoMedica y perfilProfesional
   * Antes de registrar esta información, se comprueba si la cedula es ecuatoriana y si ya existe una persona con ese numero
   * de identificación
   * @returns La información de la persona y su cuenta.
   */
  registroEstudiantes: async (req, res) => {
    const { lista_Estudiantes } = req.body;
    for (let i = 0; i < lista_Estudiantes.length; i++) {
      const { apellido_nombre, tipoDocId, numeroId, correoPersonal } =
        lista_Estudiantes[i];
      // Separar la cadena en palabras individuales
      let palabras = apellido_nombre.split(' ');

      // Los dos primeros elementos son los apellidos
      let apellidos = palabras.slice(0, 2).join(' ');

      // Los demás elementos son los nombres
      let nombres = palabras.slice(2).join(' ');
      let numeroIdFormat = numeroId.toString();

      const estudianteData = {
        nombre: nombres,
        apellido: apellidos,
        tipoDocId: tipoDocId,
        numeroId: numeroIdFormat,
        id_rol: "6",
        correoPersonal: correoPersonal,
      };
      const searchPersona = await Persona.findOne({
        where: {
          [Op.or]: [{ numeroId: numeroIdFormat }, { correoPersonal: correoPersonal }],
        },
      });
      if (!searchPersona) {
        if (tipoDocId == "pasaporte") {
          const infoEstudianteCuenta = await Persona.findOne({
            where: { correoPersonal: correoPersonal },
          });
          if (!infoEstudianteCuenta) {
            const estudiante = await Persona.create(estudianteData);
            const newEstudiante = await Persona.findOne({
              where: { numeroId: numeroIdFormat },
            });
            var salt = bcrypt.genSaltSync(10);
            let password = bcrypt.hashSync(numeroIdFormat, salt);
            const dataCuenta = {
              correo: correoPersonal,
              clave: password,
              estado: 0,
              id_persona: newEstudiante.id,
            };
            const newEstudianteCuenta = await Cuenta.create(dataCuenta);
            if (!newEstudianteCuenta) console.log({
              message:
                "La cuenta no se puedo crear, revise bien su informacion.",
            });

            const dataInfoMed = {
              id_persona: newEstudiante.id,
              discapacidad: "1",
              tipoDiscapacidad: "N/A",
              porcentajeDiscapacidad: "N/A",
              nCarnetDiscapacidad: "N/A",
              enfermedadCatastrofica: "1",
              tipoEnfermedadCatastrofica: "N/A",
            };
            const newInfoMedica = await InfoMedica.create(dataInfoMed);
            console.log({
              message: "Ha generado un nuevo usuario",
              estudiante,
              newEstudianteCuenta,
              newInfoMedica,
            });
          } else {
            console.log({ message: "Ya existe un estudiante con ese correo" });
          }
        } else {
          const cedulaValida = cedulaValidator.validator(numeroIdFormat);
          if (cedulaValida.flag == 3) {
            //const infoEstudianteCuenta = await Persona.findOne({ where: { correoPersonal: correoPersonal } });
            const estudiante = await Persona.create(estudianteData);
            const newEstudiante = await Persona.findOne({
              where: { numeroId: numeroIdFormat },
            });
            var salt = bcrypt.genSaltSync(10);
            let password = bcrypt.hashSync(numeroIdFormat, salt);
            const dataCuenta = {
              correo: correoPersonal,
              clave: password,
              estado: 0,
              id_persona: newEstudiante.id,
            };
            const newEstudianteCuenta = await Cuenta.create(dataCuenta);
            if (!newEstudianteCuenta) console.log({
              message:
                "La cuenta no se puedo crear, revise bien su informacion.",
            });
            const dataInfoMed = {
              id_persona: newEstudiante.id,
              discapacidad: "1",
              tipoDiscapacidad: "N/A",
              porcentajeDiscapacidad: "N/A",
              nCarnetDiscapacidad: "N/A",
              enfermedadCatastrofica: "1",
              tipoEnfermedadCatastrofica: "N/A",
            };
            const newInfoMedica = await InfoMedica.create(dataInfoMed);
            console.log({
              message: "Ha generado un nuevo usuario",
              estudiante,
              newEstudianteCuenta,
              newInfoMedica,
            });
          } else {
            console.log({ message: cedulaValida.message });
          }
        }
      } else {
        console.log({
          message: "Ya existe un estudiante con esta información",
        });
      }
    }
    return res.json({ message: "Se han registrado los estudiantes" });
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  getAsistenciasEstudiante: async (req, res) => {
    const { externalId } = req.params;

    let lista_asistenciasXmateria = [];

    const info_anioLectivo = await AnioLectivo.findOne({
      where: { estadoAniolectivo: "0" },
    });
    const info_estudiante = await Persona.findOne({
      where: { external_id: externalId },
    });

    const info_matricula_actual = await Matricula.findOne({
      where: {
        id_persona: info_estudiante.id,
        id_anioLectivo_actual: info_anioLectivo.id,
      },
    });
    const info_paralelo = await Paralelo.findOne({
      attributes: ["id", "titulo", "id_curso"],
      where: { id: info_matricula_actual.id_paralelo },
    });

    const info_curso = await Curso.findOne({
      attributes: ["id", "nivelAcademico", "gradoAcademico"],
      where: { id: info_paralelo.id_curso },
    });

    const infoMatricula = {
      ...info_matricula_actual.dataValues,
      titulo_paralelo: info_paralelo.titulo,
      id_curso: info_curso.id,
      nivelAcademico: info_curso.nivelAcademico,
      gradoAcademico: info_curso.gradoAcademico,
    };

    const asistenciaPorDia = await AsistenciaXDia.findOne({
      where: { id_matricula: info_matricula_actual.id },
    });

    const asistenciaPorMateria = await AsistenciaXMate.findAll({
      where: { id_matricula: info_matricula_actual.id },
      include: [
        {
          model: Materia,
          attributes: ["nombre", "area"],
        },
      ],
    });

    return res.json({
      infoMatricula,
      asistenciaPorMateria,
      asistenciaPorDia,
    });
  },

  /**Fin funciones validadas */
  verifyToken: async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).send("Unauhtorized Request");
      }
      let token = req.headers.authorization.split(" ")[1];
      if (token === "null") {
        return res.status(401).send("Unauhtorized Request");
      }

      const payload = await jwt.verify(token, process.env.Secret_key);
      if (!payload) {
        return res.status(401).send("Unauhtorized Request");
      }
      req.userId = payload._id;
      next();
    } catch (e) {
      return res.status(401).send("Unauhtorized Request");
    }
  },
};

module.exports = controller;
