'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const Persona = models.persona;
const Cuenta = models.cuenta;

let controller = {
    /** Implementado try cath*/
    createPerson: async (req, res) => {
        const {
            nombre, apellido, nacionalidad, cuidadNaci, provincia, tipoDocId, numeroId,
            fechaNaci, edad, correoPersonal, correroInstitucional, celular, telefono,
            estadoCivil, etnia, nCarFamilia, nCarEdu, parroquia, barrio, refeCasa,
            idenCasa, callePrin, calleSecond, codigoUnicLuz, estadoPadres, listaHogar,
            foto, estadoCuenta, id_rol
        } = req.body
        const persona = await Persona.create({
            nombre: nombre,
            apellido: apellido,
            nacionalidad: nacionalidad,
            cuidadNaci: cuidadNaci,
            provincia: provincia,
            tipoDocId: tipoDocId,
            numeroId: numeroId,
            fechaNaci: fechaNaci,
            edad: edad,
            correoPersonal: correoPersonal,
            correroInstitucional: correroInstitucional,
            celular: celular,
            telefono: telefono,
            estadoCivil: estadoCivil,
            etnia: etnia,
            nCarFamilia: nCarFamilia,
            nCarEdu: nCarEdu,
            parroquia: parroquia,
            barrio: barrio,
            refeCasa: refeCasa,
            idenCasa: idenCasa,
            callePrin: callePrin,
            calleSecond: calleSecond,
            codigoUnicLuz: codigoUnicLuz,
            estadoPadres: estadoPadres,
            listaHogar: listaHogar,
            foto: foto,
            estadoCuenta: estadoCuenta,
            id_rol: id_rol
        });
        const newPersona = await Persona.findOne({ where: { numeroId: numeroId } });
        var salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(numeroId, salt);
        const dataCuenta = {
            correo: correoPersonal,
            clave: password,
            estado: 0,
            id_persona: newPersona.id,
        };
        const newuserCuenta = await Cuenta.create(dataCuenta);
        //if (newuserCuenta) return res.status(200).json({ message: 'Ha generado un nuevo usuario' })
        if (!newuserCuenta) return res.status(500).json({ error: 'Su cuenca no se puedo crear, revise bien si informacion no sea imbecil' })
        const token = jwt.sign({ id: newPersona.id }, process.env.Secret_key);
        return res.json({ message: 'Ha generado un nuevo usuario', token, persona, newuserCuenta });
    }
}

module.exports = controller;

