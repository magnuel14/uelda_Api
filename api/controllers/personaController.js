'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');

const cedulaValidator = require('../../helpers/cedulaHelper');

const Persona = models.persona;
const Cuenta = models.cuenta;
const InfoMedica = models.infoMedica;
const Rol = models.rol;
const PerfilProfesional = models.perfilProfesional;

let controller = {
    /** Implementado try cath*/

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
            nombre, apellido, nacionalidad, cuidadNaci, provincia, tipoDocId, numeroId,
            fechaNaci, edad, correoPersonal, correroInstitucional, celular, telefono,
            estadoCivil, etnia, nCarFamilia, nCarEdu, parroquia, barrio, refeCasa,
            idenCasa, callePrin, calleSecond, codigoUnicLuz, estadoPadres, listaHogar,
            foto, id_rol
        } = req.body

        const searchPersona = await Persona.findOne({ where: { numeroId: numeroId } });
        const cedulaValida = cedulaValidator.validator(numeroId);
        //return res.json({ message: cedulaValida.flag });
        if (cedulaValida.flag == 3) {
            if (!searchPersona) {
                const personaData = {
                    nombre: nombre, apellido: apellido, nacionalidad: nacionalidad, cuidadNaci: cuidadNaci,
                    provincia: provincia, tipoDocId: tipoDocId, numeroId: numeroId, fechaNaci: fechaNaci,
                    edad: edad, correoPersonal: correoPersonal, correroInstitucional: correroInstitucional,
                    celular: celular, telefono: telefono, estadoCivil: estadoCivil, etnia: etnia,
                    nCarFamilia: nCarFamilia, nCarEdu: nCarEdu, parroquia: parroquia, barrio: barrio,
                    refeCasa: refeCasa, idenCasa: idenCasa, callePrin: callePrin, calleSecond: calleSecond,
                    codigoUnicLuz: codigoUnicLuz, estadoPadres: estadoPadres, listaHogar: listaHogar,
                    foto: foto,
                    id_rol: id_rol
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
                if (!newPersonaCuenta) return res.json({ message: 'Su cuenta no se puedo crear, revise bien si informacion no sea imbecil' })
                //const token = jwt.sign({ id: newPersona.id }, process.env.Secret_key);
                const dataRol = await Rol.findOne({ where: { id: newPersona.id_rol } });
                const dataInfoMed = {
                    id_persona: newPersona.id,
                    tipoDiscapacidad: "Ninguna",
                    porcentajeDiscapacidad: "0%",
                    nCarnetDiscapacidad: "N/A",
                    tipoEnfermedadCatastrofica: "Ninguna"
                };
                //const persona = await Persona.findOne({ where: { id: idP } });
                //return res.json({persona });
                const newInfoMedica = await InfoMedica.create(dataInfoMed);
                if (dataRol == 'Estudiante') {
                    return res.json({ message: 'Ha generado un nuevo usuario', persona, newPersonaCuenta, newInfoMedica });
                } else {
                    const dataPerfilProfe = {
                        id_persona: newPersona.id,
                        razonUELDA: 'N/A',
                        fechaInMag: 'dia/mes/año',
                        tiempoMagisterio: 'N/A',
                        fechaInULEDA: 'dia/mes/año',
                        tiempoUelda: 'N/A',
                        categoría: 'N/A',
                        añosCategoria: 'N/A',
                        relacionLaboral: 'N/A'
                    }
                    const newperfilProfesional = await PerfilProfesional.create(dataPerfilProfe);
                    return res.json({ message: 'Ha generado un nuevo usuario', persona, newPersonaCuenta, newInfoMedica, newperfilProfesional });
                }
            } else {
                return res.json({ message: 'Ya existe un usuario con esta información' });
            }
        } else {
            return res.json({ message: cedulaValida.message });
        }
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
        const { externalId,
            nombre, apellido, nacionalidad, cuidadNaci, provincia, tipoDocId, numeroId,
            fechaNaci, edad, correoPersonal, correroInstitucional, celular, telefono,
            estadoCivil, etnia, nCarFamilia, nCarEdu, parroquia, barrio, refeCasa,
            idenCasa, callePrin, calleSecond, codigoUnicLuz, estadoPadres, listaHogar,
            foto } = req.body;

        const udatepersonaData = {
            nombre: nombre, apellido: apellido, nacionalidad: nacionalidad, cuidadNaci: cuidadNaci,
            provincia: provincia, tipoDocId: tipoDocId, numeroId: numeroId, fechaNaci: fechaNaci,
            edad: edad, correoPersonal: correoPersonal, correroInstitucional: correroInstitucional,
            celular: celular, telefono: telefono, estadoCivil: estadoCivil, etnia: etnia,
            nCarFamilia: nCarFamilia, nCarEdu: nCarEdu, parroquia: parroquia, barrio: barrio,
            refeCasa: refeCasa, idenCasa: idenCasa, callePrin: callePrin, calleSecond: calleSecond,
            codigoUnicLuz: codigoUnicLuz, estadoPadres: estadoPadres, listaHogar: listaHogar,
            foto: foto
        };
        await Persona.update(udatepersonaData, { where: { external_id: externalId } });
        return res.json({ message: 'Se ha actualizado la información de usario' });
    },
    /**
 * updateCuenta: Esta funcion sirve para actualizar los datos de cuenta
 * @param {*} req 
 * @param {*} res 
 * Esta lista se compone idP, correo y clave.
 * Se hace una busqueda en cuenta por id
 * Se carga el id de cuenta el cual se usa en la condicion "where" (sql)
 * Y la dataCuenta que es la información nueva de cuenta
 * Esta clave es encriptada para enviarla a la BD
 * @returns Un mensaje de comprobación de estado de la tarea
 */
    updateCuenta: async (req, res) => {
        const { externalId, correo, clave } = req.body
        var salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(clave, salt);
        const dataCuenta = {
            correo: correo,
            clave: password,
        };
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const updateDataCuenta = await Cuenta.findOne({ where: { id_persona: infoPersona.id } });
        if (!updateDataCuenta) return res.json({ message: 'Ocurrio un error' })
        await Cuenta.update(dataCuenta, { where: { id: updateDataCuenta.id } });
        return res.json({ message: 'Se ha actualizado la información de cuenta' });
    },
    /**
* updateEstadoCuenta: Esta funcion sirve para actualizar el estado de una cuenta
* @param {*} req 
* @param {*} res 
* Esta lista se compone idP y estado.
* Se hace una busqueda en cuenta por id de persona
* Se carga el id de cuenta el cual se usa en la condicion "where" (sql)
* Y la dataCuenta que es la información nueva de cuenta
* @returns Un mensaje de comprobación de estado de la tarea
*/
    updateEstadoCuenta: async (req, res) => {
        const { externalId, estado } = req.body
        const dataCuenta = {
            estado: estado
        };
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const updateDataCuenta = await Cuenta.findOne({ where: { id_persona: infoPersona.id } });
        if (!updateDataCuenta) return res.json({ message: 'Ocurrio un error' })
        await Cuenta.update(dataCuenta, { where: { id: updateDataCuenta.id } });
        return res.json({
            message: 'Se ha actualizado el estado de la cuenta de: ',
            apellido: infoPersona.apellido, nombre: infoPersona.nombre
        });
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
            tipoDiscapacidad,
            porcentajeDiscapacidad,
            nCarnetDiscapacidad,
            tipoEnfermedadCatastrofica
        } = req.body
        const dataInfoMed = {
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
            categoría,
            añosCategoria,
            relacionLaboral,
        } = req.body
        const dataPerfilProfe = {
            razonUELDA: razonUELDA,
            fechaInMag: fechaInMag,
            tiempoMagisterio: tiempoMagisterio,
            fechaInULEDA: fechaInULEDA,
            tiempoUelda: tiempoUelda,
            categoría: categoría,
            añosCategoria: añosCategoria,
            relacionLaboral: relacionLaboral
        }
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const infoperfilProfesional = await PerfilProfesional.findOne({ where: { id_persona: infoPersona.id } });
        if (!infoperfilProfesional) return res.json({ message: 'Ocurrio un error' })
        await PerfilProfesional.update(dataPerfilProfe, { where: { id: infoperfilProfesional.id } });
        return res.json({ message: 'Se ha actualizado la información de su perfil profesional' });
    }
    /**Fin funciones validadas */
}

module.exports = controller;
//revisar optimizar flujo entre usuarios

/**
    * Funcion para guardar datos sobre informacion medica del usuario
    * @param {*} req 
    * @param {*} res 
    * Recibe una lista de datos relacionaos con su modelo
    * @returns Un mensaje sobre el estado de la tarea.
    */
/**
infoMedica: async (idP, res) => {
    const dataInfoMed = {
        id_persona: idP,
        tipoDiscapacidad: "Ninguna",
        porcentajeDiscapacidad: "0%",
        nCarnetDiscapacidad: "N/A",
        tipoEnfermedadCatastrofica: "Ninguna"
    };
    //const persona = await Persona.findOne({ where: { id: idP } });
    //return res.json({persona });
    const newInfoMedica = await InfoMedica.create(dataInfoMed);
    return res.json({ message: 'Se ha ingresado la información', newInfoMedica });
},
*/