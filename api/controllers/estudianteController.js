'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');

const cedulaValidator = require('../../helpers/cedulaHelper');

const Persona = models.persona;
const Cuenta = models.cuenta;
const InfoMedica = models.infoMedica;
const Rol = models.rol;



let controller = {
    /** Implementado try cath*/
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    getEstudiantes: async (req, res) => {
        const estudiantes = await Persona.findAll({ where: { id_rol: 6 } });
        res.json(estudiantes);
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
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    getEstudianteByEx: async (req, res) => {
        const { externalId } = req.params;
        const infoEstudiante = await Persona.findOne({ where: { external_id: externalId } });
        return res.json({ infoEstudiante });
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
    updateEstudiante: async (req, res) => {
        const {
            externalId,
            nombre, apellido, nacionalidad, cuidadNaci, provincia, tipoDocId, numeroId,
            fechaNaci, edad, correoPersonal, correroInstitucional, celular, telefono,
            estadoCivil, etnia, tipoGenero, parroquia, barrio, refeCasa,
            idenCasa, callePrin, calleSecond, codigoUnicLuz, estadoPadres, listaHogar, estadoAc
        } = req.body;

        const udatepersonaData = {
            nombre: nombre, apellido: apellido, nacionalidad: nacionalidad, cuidadNaci: cuidadNaci,
            provincia: provincia, tipoDocId: tipoDocId, numeroId: numeroId, fechaNaci: fechaNaci,
            edad: edad, correoPersonal: correoPersonal, correroInstitucional: correroInstitucional,
            celular: celular, telefono: telefono, estadoCivil: estadoCivil, etnia: etnia,
            tipoGenero: tipoGenero, parroquia: parroquia,
            barrio: barrio, refeCasa: refeCasa, idenCasa: idenCasa, callePrin: callePrin,
            calleSecond: calleSecond, codigoUnicLuz: codigoUnicLuz, estadoPadres: estadoPadres,
            listaHogar: listaHogar,
            estadoAc: estadoAc
        };
        //console.log('datos: ', udatepersonaData)
        await Persona.update(udatepersonaData, { where: { external_id: externalId } });
        return res.json({ message: 'Se ha actualizado la información de usario' });
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    getRepresentanteByEx: async (req, res) => {},
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    createRepresentante: async (req, res) => {},
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    updateRepresentante: async (req, res) => {},


    /**Fin funciones validadas */
}

module.exports = controller;
