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
    /**
     * Funcion para ingresar al sistema
     * @param {*} req 
     * @param {*} res 
     * Recibe el correro, clave del usuario
     * checkedT esta es la comporbacion del usuario si desa ser recordado.
     * @returns Un token de sesión e información del usuario
     */
    singnin: async (req, res) => {
        const { correo, clave, checkedT } = req.body;
        //busca que el correro sea valido
        const userCuenta = await Cuenta.findOne({ where: { correo: correo } });
        if (!userCuenta) return res.json({ message: 'No existe una cuenta ligada a ese correro', flag: 1 });
        if (userCuenta.estado != 0) return res.json(
            { message: 'La cuenta esta inactiva, comuniquese con la UELDA', flag: 1 });
        //console.log(userCuenta);
        let passwordEncript = userCuenta.clave;
        //console.log(passwordEncript);
        const passwordValide = await bcrypt.compare(clave, passwordEncript);
        //console.log(passwordValide)
        if (!passwordValide) return res.json({ message: 'Contraseña equivocada', flag: 1 });
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
    }
}
/** fin Implementado try cath*/
module.exports = controller;