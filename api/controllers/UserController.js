'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const Persona = models.persona;
const Cuenta = models.cuenta;
const Rol = models.rol;

let controller = {
    /** Implementado try cath*/
    getUsers: async (req, res) => {
        const users = await Persona.findAll();
        res.json(users);
    },
    singnin: async (req, res) => {
        try {
            const { correo, clave, checkedT } = req.body;
            //busca que el correro sea valido
            const userCuenta = await Cuenta.findOne({ where: { correo: correo } });
            if (!userCuenta) return res.send('The email does not exists');
            //console.log(userCuenta);
            let passwordEncript = userCuenta.clave;
            //console.log(passwordEncript);
            const passwordValide = await bcrypt.compare(clave, passwordEncript);
            //console.log(passwordValide)
            if (!passwordValide) return res.send('Wrong Password');
            const persona = await Persona.findOne({ where: { id: userCuenta.id_persona } })
            const rol = await Rol.findOne({ where: { id: persona.id_rol } })
            if (!checkedT) {
                const token = jwt.sign({ id: userCuenta.id }, process.env.Secret_key, { expiresIn: '8h' });
                res.json({ token, persona, rol });
                console.log('8 horas')
            } else {
                const token = jwt.sign({ id: userCuenta.id }, process.env.Secret_key, { expiresIn: '30d' });
                res.json({ token, persona, rol });
                console.log('30 dias')
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    /** fin Implementado try cath*/
}
module.exports = controller;