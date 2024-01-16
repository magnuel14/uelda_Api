'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const cloudinaryC = require('../../cloudinary');
const fs = require('fs-extra');
const dotenv = require('dotenv');
dotenv.config();

const Persona = models.persona;
const Cuenta = models.cuenta;
const Rol = models.rol;

/**
 * Controller object that contains various methods for handling user-related operations.
 *
 * @typedef {Object} Controller
 * @property {Function} getUsers - Retrieves a list of users.
 * @property {Function} singnin - Handles user sign-in.
 * @property {Function} updateCuenta - Updates user account information.
 * @property {Function} updateEstadoCuenta - Updates the status of a user account.
 * @property {Function} verifyToken - Verifies the authenticity of a token.
 */
let controller = {
    getUsers: async (req, res) => {
        /**
         * Retrieves a list of users.
         *
         * @returns {Promise<Array<Object>>} The list of users.
         */
        const users = await Persona.findAll({
            attributes: ['id', 'nombre', 'apellido'] 
        });

        return res.json(users);
    },

    singnin: async (req, res) => {
        const { correo, clave, checkedT } = req.body;
        const userCuenta = await Cuenta.findOne({ where: { correo } });

        if (!userCuenta) {
            return res.json({ message: 'No existe una cuenta ligada a ese correo', flag: 1 });
        }

        if (userCuenta.estado !== 0) {
            return res.json({ message: 'La cuenta está inactiva, comuníquese con la UELDA', flag: 1 });
        }

        const passwordValide = await bcrypt.compare(clave, userCuenta.clave);

        if (!passwordValide) {
            return res.json({ message: 'Contraseña equivocada', flag: 1 });
        }

        const persona = await Persona.findOne({ where: { id: userCuenta.id_persona } });
        const rol = await Rol.findOne({ where: { id: persona.id_rol } });
        const expiresIn = checkedT ? '30d' : '8h';
        const token = jwt.sign({ id: userCuenta.id }, process.env.Secret_key, { expiresIn });

        return res.json({ token, persona, rol });
    },

    updateCuenta: async (req, res) => {
        const { externalId, clave } = req.body;
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const updateDataCuenta = await Cuenta.findOne({ where: { id_persona: infoPersona.id } });

        if (!req.files) {
            var salt = bcrypt.genSaltSync(10);
            let password = bcrypt.hashSync(clave, salt);
            const dataCuenta = {
                clave: password,
            };
            if (!updateDataCuenta) {
                return res.json({ message: 'Ocurrio un error' });
            }
            await Cuenta.update(dataCuenta, { where: { id: updateDataCuenta.id } });
            return res.json({ message: 'Se ha actualizado su contraseña' });
        }

        if (infoPersona.public_id != null) {
            await cloudinaryC.deleteFile(infoPersona.public_id);
        }

        if (req.files?.foto) {
            const result = await cloudinaryC.uploadImage(req.files.foto.tempFilePath);
            const dataFoto = {
                foto: result.secure_url,
                public_id: result.public_id
            };

            if (clave != 'null') {
                var salt = bcrypt.genSaltSync(10);
                let password = bcrypt.hashSync(clave, salt);
                const dataCuenta = {
                    clave: password,
                };
                await fs.unlink(req.files.foto.tempFilePath);
                if (!updateDataCuenta) {
                    return res.json({ message: 'Ocurrio un error' });
                }
                await Cuenta.update(dataCuenta, { where: { id: updateDataCuenta.id } });
                await Persona.update(dataFoto, { where: { id: infoPersona.id } });
                return res.json({ message: 'Se ha actualizado su información de usuario', dataFoto });
            } else {
                await Persona.update(dataFoto, { where: { id: infoPersona.id } });
                return res.json({ message: 'Se ha actualizado su información de usuario', dataFoto });
            }
        }
    },

    updateEstadoCuenta: async (req, res) => {
        const { externalId, estado } = req.body;
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const updateDataCuenta = await Cuenta.findOne({ where: { id_persona: infoPersona.id } });

        if (!updateDataCuenta) {
            return res.json({ message: 'Ocurrió un error' });
        }

        const dataCuenta = {
            estado: estado
        };

        await Cuenta.update(dataCuenta, { where: { id: updateDataCuenta.id } });

        return res.json({
            message: 'Se ha actualizado el estado de la cuenta de:',
            apellido: infoPersona.apellido,
            nombre: infoPersona.nombre
        });
    },
    
    verifyToken: async (req, res, next) => {
        try {
            if (!req.headers.authorization) {
                return res.status(401).send('Unauthorized Request');
            }

            const token = req.headers.authorization.split(' ')[1];
            if (token === 'null') {
                return res.status(401).send('Unauthorized Request');
            }

            const payload = await jwt.verify(token, process.env.Secret_key);
            if (!payload) {
                return res.status(401).send('Unauthorized Request');
            }

            req.userId = payload.id;
            next();
        } catch (error) {
            return res.status(401).send('Unauthorized Request');
        }
    }
}
module.exports = controller;