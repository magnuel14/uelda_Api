'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const Persona = models.persona;
const Cuenta = models.cuenta;
const InfoMedica = models.infoMedica;
const Rol = models.rol;
const PerfilProfesional = models.perfilProfesional;

let controller = {
    /** Implementado try cath*/
    /**
     * createPerson: 
     * Funcion para crear un nuevo usuario.
     * @param {*} req 
     * @param {*} res 
     * Recibe una lista de información personal, de indole familiar y direccion de su domicilio
     * Ademas generá informacion por defecto para la tabla infoMedica y perfilProfesional
     * Antes de registrar esta información, se comprueba si ya existe una persona con ese numero de identificación
     * Enla tabla perfilProfesional, solo se registrará la informacion cuando el usuario no tenga el rol estudiante
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
    },

   


    updatePersona: async (req, res) => {
        const { idP,
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
        await Persona.update(udatepersonaData, { where: { id: idP } });
        return res.json({ message: 'Se ha actualizado la información de usario' });
    },

    updateCuenta: async (req, res) => {
        const {
            idP,
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
        const infoMedica = await InfoMedica.findOne({ where: { id_persona: idP } });
        if (!infoMedica) return res.json({ message: 'Ocurrio un error' })
        await InfoMedica.update(dataInfoMed, { where: { id: infoMedica.id } });
        return res.json({ message: 'Se ha actualizado la información' });
    },

    /**
    * Función paraactualizar datos de la información medica 
    * @param {*} req 
    * @param {*} res 
    * Recibe una lista logada al modelo infoMedica
    * Recibe el id de la persona
    * @returns Un mensaje de comprobación de estado de la tarea
    */
    updateinfoMedica: async (req, res) => {
        const {
            idP,
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
        const infoMedica = await InfoMedica.findOne({ where: { id_persona: idP } });
        if (!infoMedica) return res.json({ message: 'Ocurrio un error' })
        await InfoMedica.update(dataInfoMed, { where: { id: infoMedica.id } });
        return res.json({ message: 'Se ha actualizado la información' });
    },

    updatePerfilProfe: async (req, res) => {
        const {
            idP,
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
        const infoMedica = await InfoMedica.findOne({ where: { id_persona: idP } });
        if (!infoMedica) return res.json({ message: 'Ocurrio un error' })
        await InfoMedica.update(dataInfoMed, { where: { id: infoMedica.id } });
        return res.json({ message: 'Se ha actualizado la información' });
    }
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