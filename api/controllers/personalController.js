'use strict';
const cloudinaryC = require('../../cloudinary');
const models = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const fs = require('fs-extra');

const cedulaValidator = require('../../helpers/cedulaHelper');

const Persona = models.persona;
const Cuenta = models.cuenta;
const InfoMedica = models.infoMedica;
const PerfilProfesional = models.perfilProfesional;
const TituloProfesional = models.tituloProfesional;


let controller = {
    /** Implementado try cath*/
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    getPersonal: async (req, res) => {
        const personal = await Persona.findAll(
            {
                include: [Cuenta],
                where: {
                    [Op.or]: [
                        { id_rol: 1 },
                        { id_rol: 2 },
                        { id_rol: 3 },
                        { id_rol: 4 },
                        { id_rol: 5 }
                    ]
                }
            });
        res.json(personal);
    },
    /**
     * createPerson: Funcion para crear un nuevo usuario.
     * @param {*} req 
     * @param {*} res 
     * Recibe una lista de información personal, de indole familiar y dirección de su domicilio
     * Se genera las credenciales para la tabla cuenta, con el correro personal y numero de identificación, al ser esta
     * la clave, será encriptada.
     * Ademas generá informacion por defecto para la tabla infoMedica y perfilProfesional
     * Antes de registrar esta información, se comprueba si la cedula es ecuatoriana y si ya existe una persona con ese numero 
     * de identificación
     * En la tabla perfilProfesional, solo se registrará la informacion cuando el usuario no tenga 
     * el rol estudiante
     * @returns La información de la persona y su cuenta.
     */
    createPerson: async (req, res) => {
        //Preguntar que datos se debe validar
        //Correropersonal para crear cuenta.
        const {
            nombre, apellido, tipoDocId, numeroId,
            correoPersonal, id_rol
        } = req.body
        const searchPersona = await Persona.findOne({
            where: {
                [Op.or]: [{ numeroId: numeroId }, { correoPersonal: correoPersonal }]
            }
        });
        const cedulaValida = cedulaValidator.validator(numeroId);
        //return res.json({ message: cedulaValida.flag });
        if (cedulaValida.flag == 3) {
            if (!searchPersona) {
                const personaData = {
                    nombre: nombre, apellido: apellido,
                    tipoDocId: tipoDocId, numeroId: numeroId,
                    id_rol: id_rol,
                    correoPersonal: correoPersonal,
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
                if (!newPersonaCuenta) return res.json({ message: 'Su cuenta no se puedo crear, revise bien si informacion.' })
                //const token = jwt.sign({ id: newPersona.id }, process.env.Secret_key);
                const dataInfoMed = {
                    id_persona: newPersona.id,
                    discapacidad: "1",
                    tipoDiscapacidad: "N/A",
                    porcentajeDiscapacidad: "N/A",
                    nCarnetDiscapacidad: "N/A",
                    enfermedadCatastrofica: "1",
                    tipoEnfermedadCatastrofica: "N/A"
                };
                //const persona = await Persona.findOne({ where: { id: idP } });
                //return res.json({persona });
                const newInfoMedica = await InfoMedica.create(dataInfoMed);
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

            } else {
                return res.json({ message: 'Ya existe un usuario con ese numero de DNI o correo personal' });
            }
        } else {
            return res.json({ message: cedulaValida.message });
        }
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    getPersonByEx: async (req, res) => {
        const { externalId } = req.params;
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        return res.json({ infoPersona });
    },
    /**
     * updatePersona: Esta función sirve para editar la información de la persona 
     * @param {*} req 
     * @param {*} res 
     * Recibe la lista de atributos de su modelo descritos en Persona.
     * Se carga el id de Perosna el cual se usa en la condicion "where" (sql)
     * Y la udatepersonaData que es la informacin nueva para la Persona
     * @returns Un mensaje de comprobación de estado de la tarea
     */
    updatePersona: async (req, res) => {
        const {
            externalId,
            nombre, apellido, nacionalidad, cuidadNaci, provincia,
            fechaNaci, edad, correoPersonal, correroInstitucional, celular, telefono,
            estadoCivil, etnia, tipoGenero, nCarFamilia, nCarEdu, parroquia, barrio, refeCasa,
            idenCasa, callePrin, calleSecond
        } = req.body;

        const dataCuenta = {
            correo: correoPersonal,
        };
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        if (infoPersona) {

            const infoCuenta = await Cuenta.findOne({ where: { id_persona: infoPersona.id } });

            if (!req.files) {

                if (infoCuenta) {
                    const udatepersonaData = {
                        nombre: nombre, apellido: apellido, nacionalidad: nacionalidad, cuidadNaci: cuidadNaci,
                        provincia: provincia, fechaNaci: fechaNaci,
                        edad: edad, correoPersonal: correoPersonal, correroInstitucional: correroInstitucional,
                        celular: celular, telefono: telefono, estadoCivil: estadoCivil, etnia: etnia,
                        tipoGenero: tipoGenero, nCarFamilia: nCarFamilia, nCarEdu: nCarEdu, parroquia: parroquia,
                        barrio: barrio, refeCasa: refeCasa, idenCasa: idenCasa, callePrin: callePrin,
                        calleSecond: calleSecond
                    };

                    const searchCuentaByEmail = await Cuenta.findOne({ where: { correo: correoPersonal } })

                    if (searchCuentaByEmail) {

                        if (infoCuenta.id == searchCuentaByEmail.id) {
                            await Cuenta.update(dataCuenta, { where: { id: infoCuenta.id } });
                            //console.log('datos: ', udatepersonaData)
                            await Persona.update(udatepersonaData, { where: { external_id: externalId } });
                            return res.json({ message: 'Se ha actualizado la información de usuario' });
                        } else {
                            return res.json({ message: 'Este correo esta ligado a otro usuario' });
                        }
                    } else if (!searchCuentaByEmail) {
                        await Cuenta.update(dataCuenta, { where: { id: infoCuenta.id } });
                        //console.log('datos: ', udatepersonaData)
                        await Persona.update(udatepersonaData, { where: { external_id: externalId } });
                        return res.json({ message: 'Se ha actualizado la información de usuario' });
                    }
                } else {
                    return res.json({ message: 'No existe un usuario con esa información' });
                }
            } else {
                if (infoCuenta) {
                    if (infoPersona.public_id_documentos != null) {
                        await cloudinaryC.deleteFile(infoPersona.public_id_documentos);
                        if (req.files?.url_documentos_identificacion) {
                            const result = await cloudinaryC.uploadFile(
                                req.files.url_documentos_identificacion.tempFilePath,
                                { resource_type: 'raw' });
                            const udatepersonaData = {
                                nombre: nombre, apellido: apellido, nacionalidad: nacionalidad, cuidadNaci: cuidadNaci,
                                provincia: provincia, fechaNaci: fechaNaci,
                                edad: edad, correoPersonal: correoPersonal, correroInstitucional: correroInstitucional,
                                celular: celular, telefono: telefono, estadoCivil: estadoCivil, etnia: etnia,
                                tipoGenero: tipoGenero, nCarFamilia: nCarFamilia, nCarEdu: nCarEdu, parroquia: parroquia,
                                barrio: barrio, refeCasa: refeCasa, idenCasa: idenCasa, callePrin: callePrin,
                                calleSecond: calleSecond,
                                url_documentos_identificacion: result.secure_url,
                                public_id_documentos: result.public_id
                            };
                            const searchCuentaByEmail = await Cuenta.findOne({ where: { correo: correoPersonal } })
                            if (searchCuentaByEmail) {
                                if (infoCuenta.id == searchCuentaByEmail.id) {

                                    await fs.unlink(req.files.url_documentos_identificacion.tempFilePath);

                                    await Cuenta.update(dataCuenta, { where: { id: infoCuenta.id } });
                                    await Persona.update(udatepersonaData, { where: { external_id: externalId } });
                                    return res.json({ message: 'Se ha actualizado la información de usuario' });
                                } else {
                                    return res.json({ message: 'Este correo esta ligado a otro usuario' });
                                }
                            } else if (!searchCuentaByEmail) {
                                await Cuenta.update(dataCuenta, { where: { id: infoCuenta.id } });
                                await Persona.update(udatepersonaData, { where: { external_id: externalId } });
                                return res.json({ message: 'Se ha actualizado la información de usuario' });
                            }
                        }
                    } else {
                        if (req.files?.url_documentos_identificacion) {
                            const result = await cloudinaryC.uploadFile(
                                req.files.url_documentos_identificacion.tempFilePath,
                                { resource_type: 'raw' });
                            const udatepersonaData = {
                                nombre: nombre, apellido: apellido, nacionalidad: nacionalidad, cuidadNaci: cuidadNaci,
                                provincia: provincia, fechaNaci: fechaNaci,
                                edad: edad, correoPersonal: correoPersonal, correroInstitucional: correroInstitucional,
                                celular: celular, telefono: telefono, estadoCivil: estadoCivil, etnia: etnia,
                                tipoGenero: tipoGenero, nCarFamilia: nCarFamilia, nCarEdu: nCarEdu, parroquia: parroquia,
                                barrio: barrio, refeCasa: refeCasa, idenCasa: idenCasa, callePrin: callePrin,
                                calleSecond: calleSecond,
                                url_documentos_identificacion: result.secure_url,
                                public_id_documentos: result.public_id
                            };
                            const searchCuentaByEmail = await Cuenta.findOne({ where: { correo: correoPersonal } })
                            if (searchCuentaByEmail) {
                                if (infoCuenta.id == searchCuentaByEmail.id) {
                                    await fs.unlink(req.files.url_documentos_identificacion.tempFilePath);
                                    await Cuenta.update(dataCuenta, { where: { id: infoCuenta.id } });
                                    await Persona.update(udatepersonaData, { where: { external_id: externalId } });
                                    return res.json({ message: 'Se ha actualizado la información de usuario' });
                                } else {
                                    return res.json({ message: 'Este correo esta ligado a otro usuario' });
                                }
                            } else if (!searchCuentaByEmail) {
                                await Cuenta.update(dataCuenta, { where: { id: infoCuenta.id } });
                                await Persona.update(udatepersonaData, { where: { external_id: externalId } });
                                return res.json({ message: 'Se ha actualizado la información de usuario' });
                            }
                        }
                    }
                } else {
                    return res.json({ message: 'No existe un usuario con esa información' });
                }

            }
        } else {
            return res.json({ message: 'No existe un usuario con esa información' });
        }
    },
    /**
    * 
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    getInfoMedicByEx: async (req, res) => {
        const { externalId } = req.params;
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const infoMedic = await InfoMedica.findOne({ where: { id_persona: infoPersona.id } });
        return res.json({ infoMedic });
    },
    /**
   * updateinfoMedica: Función para actualizar datos de la información medica de la personas de UELDA
   * @param {*} req 
   * @param {*} res 
   * Recibe una lista ligada al modelo infoMedica
   * Recibe el id de la persona
   * Se hace una busqueda en infoMedica por id
   * Se carga el id de infoMedica el cual se usa en la condicion "where" (sql)
   * Y la dataInfoMed que es la información nueva de infoMedica
   * @returns Un mensaje de comprobación de estado de la tarea
   */
    updateinfoMedica: async (req, res) => {
        const {
            externalId,
            discapacidad,
            enfermedadCatastrofica,
            tipoDiscapacidad,
            porcentajeDiscapacidad,
            nCarnetDiscapacidad,
            tipoEnfermedadCatastrofica
        } = req.body
        const dataInfoMed = {
            discapacidad: discapacidad,
            enfermedadCatastrofica: enfermedadCatastrofica,
            tipoDiscapacidad: tipoDiscapacidad,
            porcentajeDiscapacidad: porcentajeDiscapacidad,
            nCarnetDiscapacidad: nCarnetDiscapacidad,
            tipoEnfermedadCatastrofica: tipoEnfermedadCatastrofica
        };
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const updateinfoMedica = await InfoMedica.findOne({ where: { id_persona: infoPersona.id } });
        if (!updateinfoMedica) return res.json({ message: 'Ocurrio un error' })
        await InfoMedica.update(dataInfoMed, { where: { id: updateinfoMedica.id } });
        return res.json({ message: 'Se ha actualizado la información' });
    },
    /**
  * 
  * @param {*} req 
  * @param {*} res 
  * @returns 
  */
    getInfoProByEx: async (req, res) => {
        const { externalId } = req.params;
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const infoPro = await PerfilProfesional.findOne({ where: { id_persona: infoPersona.id } });
        return res.json({ infoPro });
    },
    /**
     * updatePerfilProfe: Función para actualizar datos del ´Perfil Profesional del personal de UELDA
     * @param {*} req 
     * @param {*} res 
     * Recibe una lista ligada al modelo perfilProfesional
     * Recibe el id de la persona
     * Se hace una busqueda en PerfilProfesional por id_persona
     * Se carga el id de PerfilProfesional el cual se usa en la condicion "where" (sql)
     * Y la dataPerfilProfe que es la información nueva de PerfilProfesional
     * @returns Un mensaje de comprobación de estado de la tarea
     */
    updatePerfilProfe: async (req, res) => {
        const {
            externalId,
            razonUELDA,
            fechaInMag,
            tiempoMagisterio,
            fechaInULEDA,
            tiempoUelda,
            categoria,
            aniosCategoria,
            relacionLaboral,
        } = req.body
        const dataPerfilProfe = {
            razonUELDA: razonUELDA,
            fechaInMag: fechaInMag,
            tiempoMagisterio: tiempoMagisterio,
            fechaInULEDA: fechaInULEDA,
            tiempoUelda: tiempoUelda,
            categoria: categoria,
            aniosCategoria: aniosCategoria,
            relacionLaboral: relacionLaboral
        }
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const infoperfilProfesional = await PerfilProfesional.findOne({ where: { id_persona: infoPersona.id } });
        if (!infoperfilProfesional) return res.json({ message: 'Ocurrio un error' })
        await PerfilProfesional.update(dataPerfilProfe, { where: { id: infoperfilProfesional.id } });
        return res.json({ message: 'Se ha actualizado la información de su perfil profesional' });
    },
    /**
    * 
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    getTituloProByEx: async (req, res) => {
        const { externalId } = req.params;
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const infoPerfilPro = await PerfilProfesional.findOne({ where: { id_persona: infoPersona.id } });
        const infoTPro = await TituloProfesional.findOne({ where: { id_perfilProfesional: infoPerfilPro.id } });
        return res.json({ infoTPro });
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    updateTitutuloPro: async (req, res) => {
        const {
            externalId,
            nivelEducacion,
            tercerNivel,
            tercerEspecialidad,
            cuartoNivel,
            cuartoEspecialidad
        } = req.body
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const infoperfilProfesional = await PerfilProfesional.findOne({ where: { id_persona: infoPersona.id } });
        const datatituloPro = {
            nivelEducacion: nivelEducacion,
            tercerNivel: tercerNivel,
            tercerEspecialidad: tercerEspecialidad,
            cuartoNivel: cuartoNivel,
            cuartoEspecialidad: cuartoEspecialidad
        }
        const infoTituloPro = await TituloProfesional.findOne({ where: { id_perfilProfesional: infoperfilProfesional.id } });
        if (!infoTituloPro) return res.json({ message: 'Ocurrio un error' })
        await TituloProfesional.update(datatituloPro, { where: { id: infoTituloPro.id } });
        return res.json({ message: 'Se ha actualizado la información de su titulo profesional' });
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    updatePersonalRol: async (req, res) => {
        const { externalId } = req.body
        const { id_rol } = req.body
        const dataNewRol = {
            id_rol: id_rol
        }
        const infoPersona = await Persona.findOne({ include: [Cuenta], where: { external_id: externalId } });
        let estadoCuenta = infoPersona.cuentum.estado;
        if (estadoCuenta == 0) {
            const personUpdate = await Persona.update(dataNewRol, { where: { external_id: externalId } });
            return res.json({ message: 'Se ha actualizado la información de su titulo profesional', personUpdate });
        } else {
            return res.json({ message: 'La cuenta de este usuario esta inactiva' });
        }
    },
    /**
     * registrarPersonal: Funcion para resgistrar una lista de nuevos usuarios.
     * @param {*} req 
     * @param {*} res 
     * Recibe una lista de información personal, de indole familiar y dirección de su domicilio
     * Se genera las credenciales para la tabla cuenta, con el correro personal y numero de identificación, al ser esta
     * la clave, será encriptada.
     * Ademas generá informacion por defecto para la tabla infoMedica y perfilProfesional
     * Antes de registrar esta información, se comprueba si la cedula es ecuatoriana y si ya existe una persona con ese numero 
     * de identificación
     * En la tabla perfilProfesional, solo se registrará la informacion cuando el usuario no tenga 
     * el rol estudiante
     * @returns La información de la persona y su cuenta.
     */
    registrarPersonal: async (req, res) => {
        const { lista_Personal } = req.body;
        for (let i = 0; i < lista_Personal.length; i++) {
            const {
                nombre, apellido, tipoDocId, numeroId,
                correoPersonal, id_rol
            } = lista_Personal[i];
            const searchPersona = await Persona.findOne({
                where: {
                    [Op.or]: [{ numeroId: numeroId }, { correoPersonal: correoPersonal }]
                }
            });
            const cedulaValida = cedulaValidator.validator(numeroId);
            //return res.json({ message: cedulaValida.flag });
            if (cedulaValida.flag == 3) {
                if (!searchPersona) {
                    const personaData = {
                        nombre: nombre, apellido: apellido,
                        tipoDocId: tipoDocId, numeroId: numeroId,
                        id_rol: id_rol,
                        correoPersonal: correoPersonal,
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
                    if (!newPersonaCuenta) console.log({ message: 'Su cuenta no se puedo crear, revise bien si informacion.' })
                    //const token = jwt.sign({ id: newPersona.id }, process.env.Secret_key);
                    const dataInfoMed = {
                        id_persona: newPersona.id,
                        discapacidad: "1",
                        tipoDiscapacidad: "N/A",
                        porcentajeDiscapacidad: "N/A",
                        nCarnetDiscapacidad: "N/A",
                        enfermedadCatastrofica: "1",
                        tipoEnfermedadCatastrofica: "N/A"
                    };
                    //const persona = await Persona.findOne({ where: { id: idP } });
                    //console.log({persona });
                    const newInfoMedica = await InfoMedica.create(dataInfoMed);
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
                    console.log({ message: 'Ha generado un nuevo usuario', persona, newPersonaCuenta, newInfoMedica, newperfilProfesional, newtituloProfesional });

                } else {
                    console.log({ message: 'Ya existe un usuario con ese numero de DNI o correo personal' });
                }
            } else {
                console.log({ message: cedulaValida.message });
            }
        }
        return res.json({ message: 'Se ha resitrado al Personal de institución' })
    },
    /**Fin funciones validadas */
}

module.exports = controller;
