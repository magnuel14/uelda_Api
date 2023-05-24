'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');

const cedulaValidator = require('../../helpers/cedulaHelper');

const Persona = models.persona;
const Representante = models.representante;
const Cuenta = models.cuenta;
const InfoMedica = models.infoMedica;
const Rol = models.rol;



let controller = {
    /** Implementado try cath*/
    /**getEstudiantes: Funcion get para obtener la lista de usuarios con rol estudiante
     * @param {*} req 
     * @param {*} res 
     * @returns Una lista en formato json de los estuidantes registrados
     */
    getEstudiantes: async (req, res) => {
        const estudiantes = await Persona.findAll({ where: { id_rol: 6 } });
        res.json(estudiantes);
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
        //Preguntar que datos se debe validar
        //Correropersonal para crear cuenta.
        const {
            nombre, apellido, tipoDocId, numeroId,
            correoPersonal
        } = req.body
        const searchPersona = await Persona.findOne({ where: { numeroId: numeroId } });
        if (!searchPersona) {
            if (tipoDocId == 'pasaporte') {
                const personaData = {
                    nombre: nombre, apellido: apellido,
                    tipoDocId: tipoDocId, numeroId: numeroId,
                    correoPersonal: correoPersonal,
                    id_rol: "6"
                }
                const persona = await Persona.create(personaData);
                const newPersona = await Persona.findOne({ where: { numeroId: numeroId } });
                var salt = bcrypt.genSaltSync(10);
                let password = bcrypt.hashSync(numeroId, salt);
                const dataCuenta = {
                    correo: correoPersonal,
                    clave: password,
                    estado: 0,
                    id_persona: newPersona.id,
                };
                const newPersonaCuenta = await Cuenta.create(dataCuenta);
                //if (newuserCuenta) return res.status(200).json({ message: 'Ha generado un nuevo usuario' })
                if (!newPersonaCuenta) return res.json({ message: 'La cuenta no se puedo crear, revise bien su información.' })
                //const token = jwt.sign({ id: newPersona.id }, process.env.Secret_key);
                const dataRol = await Rol.findOne({ where: { id: newPersona.id_rol } });
                const dataInfoMed = {
                    id_persona: newPersona.id,
                    discapacidad: "1",
                    tipoDiscapacidad: "N/A",
                    porcentajeDiscapacidad: "N/A",
                    nCarnetDiscapacidad: "N/A",
                    enfermedadCatastrofica: "1",
                    tipoEnfermedadCatastrofica: "N/A"
                };
                const newInfoMedica = await InfoMedica.create(dataInfoMed);
                if (dataRol == 'Estudiante') {
                    return res.json({ message: 'Ha generado un nuevo usuario', persona, newPersonaCuenta, newInfoMedica });
                } else {
                    const dataPerfilProfe = {
                        id_persona: newPersona.id,
                        fechaInMag: 'dia/mes/año',
                        tiempoMagisterio: 'N/A',
                        fechaInULEDA: 'dia/mes/año',
                        tiempoUelda: 'N/A',
                        categoria: 'N/A',
                        aniosCategoria: 'N/A',
                    }
                    const newperfilProfesional = await PerfilProfesional.create(dataPerfilProfe);
                    const infoPerfilPro = await PerfilProfesional.findOne({ where: { id_persona: newPersona.id } });
                    const datatituloPro = {
                        id_perfilProfesional: infoPerfilPro.id,
                        nivelEducacion: 'N/A',
                        tercerNivel: 'N/A',
                        tercerEspecialidad: 'N/A',
                        cuartoNivel: 'N/A',
                        cuartoEspecialidad: 'N/A'
                    }
                    const newtituloProfesional = await TituloProfesional.create(datatituloPro);
                    return res.json({ message: 'Ha generado un nuevo usuario', persona, newPersonaCuenta, newInfoMedica, newperfilProfesional, newtituloProfesional });
                }
            } else {
                const cedulaValida = cedulaValidator.validator(numeroId);
                if (cedulaValida.flag == 3) {
                    const estudianteData = {
                        nombre: nombre, apellido: apellido,
                        tipoDocId: tipoDocId, numeroId: numeroId,
                        id_rol: "6",
                        correoPersonal: correoPersonal,
                    }
                    const estudiante = await Persona.create(estudianteData);
                    const newEstudiante = await Persona.findOne({ where: { numeroId: numeroId } });
                    var salt = bcrypt.genSaltSync(10);
                    let password = bcrypt.hashSync(numeroId, salt);
                    const dataCuenta = {
                        correo: correoPersonal,
                        clave: password,
                        estado: 0,
                        id_persona: newEstudiante.id,
                    };
                    const newEstudianteCuenta = await Cuenta.create(dataCuenta);
                    if (!newEstudianteCuenta) return res.json({ message: 'La cuenta no se puedo crear, revise bien su informacion.' })
                    const dataRol = await Rol.findOne({ where: { id: newEstudiante.id_rol } });
                    const dataInfoMed = {
                        id_persona: newEstudiante.id,
                        discapacidad: "1",
                        tipoDiscapacidad: "N/A",
                        porcentajeDiscapacidad: "N/A",
                        nCarnetDiscapacidad: "N/A",
                        enfermedadCatastrofica: "1",
                        tipoEnfermedadCatastrofica: "N/A"
                    };
                    const newInfoMedica = await InfoMedica.create(dataInfoMed);
                    return res.json({ message: 'Ha generado un nuevo usuario', estudiante, newEstudianteCuenta, newInfoMedica });
                } else {
                    return res.json({ message: cedulaValida.message });
                }
            }
        } else {
            return res.json({ message: 'Ya existe un estudiante con esta información' });
        }
    },
    /**
     * getEstudianteByEx: Función gte para recuperar un estudiante segun su external
     * @param {*} req externalId
     * @param {*} res 
     * @returns Una lista en formato json de la información del estudiante en caso que exista
     */
    getEstudianteByEx: async (req, res) => {
        const { externalId } = req.params;
        const infoEstudiante = await Persona.findOne({ where: { external_id: externalId } });
        return res.json({ infoEstudiante });
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
            nombre, apellido, nacionalidad, cuidadNaci, provincia, fechaNaci,
            edad, correoPersonal, celular, telefono,
            etnia, tipoGenero,
            parroquia, barrio, refeCasa, idenCasa, callePrin, calleSecond, codigoUnicLuz,
            estadoPadres, listaHogar,
            estadoAc
        } = req.body;
        const upateEstudianteData = {
            nombre: nombre, apellido: apellido, nacionalidad: nacionalidad, cuidadNaci: cuidadNaci,
            provincia: provincia, fechaNaci: fechaNaci, edad: edad, correoPersonal: correoPersonal,
            celular: celular, telefono: telefono,
            etnia: etnia, tipoGenero: tipoGenero,
            parroquia: parroquia, barrio: barrio, refeCasa: refeCasa, idenCasa: idenCasa, callePrin: callePrin,
            calleSecond: calleSecond,
            codigoUnicLuz: codigoUnicLuz, estadoPadres: estadoPadres, listaHogar: listaHogar,
            estadoAc: estadoAc
        };
        //console.log('datos: ', upateEstudianteData)
        await Persona.update(upateEstudianteData, { where: { external_id: externalId } });
        return res.json({ message: 'Se ha actualizado la información del estudiante' });
    },
    /**
     * getRepresentanteByEx: Función para obtener el o los representantes registrados del estudiante según su 
     * externalId
     * Se hace una busqueda del estudiante, el externalId se lo emplea en la condicion "where" (sql)
     * @param {*} req externalId
     * @param {*} res 
     * @returns Una lista en formato json del o los representantes registrados
     */
    getRepresentanteByEx: async (req, res) => {
        const { externalId } = req.params;
        const infoEstudiante = await Persona.findOne({ where: { external_id: externalId } });
        const infoRepresentante = await Representante.findAll({ where: { id_persona: infoEstudiante.id } });
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
            nombre, apellido, nacionalidad, tipoDocId, numeroId,
            correoPersonal, celular, nivelEdu, ocuLab, direcTrabajo,
            teleTrabajo, relacionFamiliar, contactoEmer,
            autorizacionRetirarDoc
        } = req.body;
        const searchRepresentante = await Representante.findOne({ where: { numeroId: numeroId } })
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } })
        const infoRepresentantes = await Representante.findAll({ where: { id_persona: infoPersona.id } });
        let contadorCero = 0;
        //console.log(infoRepresentantes)
        for (let i = 0; i < infoRepresentantes.length; i++) {
            if (infoRepresentantes[i].autorizacionRetirarDoc === 0) {
                contadorCero++;
            }
        }
        if (!searchRepresentante) {
            if (contadorCero === 1) {
                if (autorizacionRetirarDoc == 0) {
                    return res.json({ message: 'Ya existe un representante con autorizacion de retirar la carpeta del estudiante' });
                } else {
                    if (tipoDocId == 'pasaporte') {
                        const representnateData = {
                            nombre: nombre, apellido: apellido, nacionalidad: nacionalidad,
                            correoPersonal: correoPersonal,
                            celular: celular, tipoDocId: tipoDocId, numeroId: numeroId,
                            nivelEdu: nivelEdu, ocuLab: ocuLab, direcTrabajo: direcTrabajo,
                            teleTrabajo: teleTrabajo, relacionFamiliar: relacionFamiliar, contactoEmer: contactoEmer,
                            autorizacionRetirarDoc: autorizacionRetirarDoc,
                            id_persona: infoPersona.id,
                        };
                        //console.log('datos: ', representnateData)
                        const newRepresentante = await Representante.create(representnateData);
                        return res.json({ message: 'Se ha ingresado la información de su representante', newRepresentante });
                    } else {
                        const cedulaValida = cedulaValidator.validator(numeroId);
                        if (cedulaValida.flag == 3) {
                            const representnateData = {
                                nombre: nombre, apellido: apellido, nacionalidad: nacionalidad,
                                correoPersonal: correoPersonal,
                                celular: celular, tipoDocId: tipoDocId, numeroId: numeroId,
                                nivelEdu: nivelEdu, ocuLab: ocuLab, direcTrabajo: direcTrabajo,
                                teleTrabajo: teleTrabajo, relacionFamiliar: relacionFamiliar, contactoEmer: contactoEmer,
                                autorizacionRetirarDoc: autorizacionRetirarDoc,
                                id_persona: infoPersona.id,
                            };
                            //console.log('datos: ', representnateData)
                            const newRepresentante = await Representante.create(representnateData);
                            return res.json({ message: 'Se ha ingresado la información de su representante', newRepresentante });
                        } else {
                            return res.json({ message: cedulaValida.message });
                        }
                    }
                }
            } else {
                if (tipoDocId == 'pasaporte') {
                    const representnateData = {
                        nombre: nombre, apellido: apellido, nacionalidad: nacionalidad,
                        correoPersonal: correoPersonal,
                        celular: celular, tipoDocId: tipoDocId, numeroId: numeroId,
                        nivelEdu: nivelEdu, ocuLab: ocuLab, direcTrabajo: direcTrabajo,
                        teleTrabajo: teleTrabajo, relacionFamiliar: relacionFamiliar, contactoEmer: contactoEmer,
                        autorizacionRetirarDoc: autorizacionRetirarDoc,
                        id_persona: infoPersona.id,
                    };
                    //console.log('datos: ', representnateData)
                    const newRepresentante = await Representante.create(representnateData);
                    return res.json({ message: 'Se ha ingresado la información de su representante', newRepresentante });
                } else {
                    const cedulaValida = cedulaValidator.validator(numeroId);
                    if (cedulaValida.flag == 3) {
                        const representnateData = {
                            nombre: nombre, apellido: apellido, nacionalidad: nacionalidad,
                            correoPersonal: correoPersonal,
                            celular: celular, tipoDocId: tipoDocId, numeroId: numeroId,
                            nivelEdu: nivelEdu, ocuLab: ocuLab, direcTrabajo: direcTrabajo,
                            teleTrabajo: teleTrabajo, relacionFamiliar: relacionFamiliar, contactoEmer: contactoEmer,
                            autorizacionRetirarDoc: autorizacionRetirarDoc,
                            id_persona: infoPersona.id,
                        };
                        //console.log('datos: ', representnateData)
                        const newRepresentante = await Representante.create(representnateData);
                        return res.json({ message: 'Se ha ingresado la información de su representante', newRepresentante });
                    } else {
                        return res.json({ message: cedulaValida.message });
                    }
                }
            }
        } else {
            return res.json({ message: 'Ya existe un representante con información' });
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
            nombre, apellido, nacionalidad,
            correoPersonal, celular, nivelEdu, ocuLab, direcTrabajo,
            teleTrabajo, relacionFamiliar, contactoEmer, numeroId,
            autorizacionRetirarDoc
        } = req.body;
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } })
        const infoRepresentantes = await Representante.findAll({ where: { id_persona: infoPersona.id } });
        let contadorCero = 0;
        //console.log(infoRepresentantes)
        for (let i = 0; i < infoRepresentantes.length; i++) {
            if (infoRepresentantes[i].autorizacionRetirarDoc === 0) {
                contadorCero++;
            }
        }
        const searchRepresentante = await Representante.findOne({ where: { numeroId: numeroId } })
        if (searchRepresentante) {
            if (contadorCero === 1) {
                if (autorizacionRetirarDoc == 0) {
                    return res.json({ message: 'Ya existe un representante con autorizacion de retirar la carpeta del estudiante' });
                } else {
                    const updateRepresentanteData = {
                        nombre: nombre, apellido: apellido, nacionalidad: nacionalidad,
                        correoPersonal: correoPersonal,
                        celular: celular,
                        nivelEdu: nivelEdu, ocuLab: ocuLab, direcTrabajo: direcTrabajo,
                        teleTrabajo: teleTrabajo, relacionFamiliar: relacionFamiliar, contactoEmer: contactoEmer,
                        autorizacionRetirarDoc: autorizacionRetirarDoc,
                    };
                    //console.log('datos: ', updateRepresentanteData)
                    const updateRepresentante = await Representante.update(updateRepresentanteData, { where: { numeroId: numeroId } });
                    return res.json({ message: 'Se ha ingresado la información de su representante', updateRepresentante });
                }
            }
        } else {
            return res.json({ message: 'No existe un respresentante con esa información' });
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
        const {
            externalId,
            numeroId
        } = req.body;
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } })
        const infoRepresentantes = await Representante.findAll({ where: { id_persona: infoPersona.id } });
        const searchRepresentante = await Representante.findOne({ where: { numeroId: numeroId } });
        if (searchRepresentante) {
            //console.log(infoRepresentantes)
            if (infoRepresentantes.length == 1) {
                return res.json({ message: 'No se puede eliminar, el estudiante debe tener almenos 1 representante registrado.' });
            } else {
                const deleteRepresentante = await Representante.destroy({ where: { numeroId: numeroId } });
                return res.json({ message: 'Se ha eliminado a su representante', deleteRepresentante });
            }
        } else {
            return res.json({ message: 'No existe un representante con esa infórmación' });
        }

    }
    /**Fin funciones validadas */
}

module.exports = controller;
