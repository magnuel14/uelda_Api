'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const cloudinaryC = require('../../cloudinary');
const fs = require('fs-extra');
const dotenv = require('dotenv');
dotenv.config();

// Asignación de modelos con nombres actualizados
const User = models.user;
const AccountUser = models.accountUser;
const UserRole = models.userRole;

let controller = {

    getUsers: async (req, res) => {
        const users = await User.findAll({
            attributes: ['idUser', 'firstNameUser', 'lastNameUser']
        });

        return res.json(users);
    },

    getAllUserRole: async (req, res) => {
        const roles = await UserRole.findAll();

        return res.json(roles)
    },

    getUserByExternalId: async (req, res) => {
        const { externalId } = req.params;
        const user = await User.findOne({ where: { externalId } });
        return res.json(user);
    },

    signin: async (req, res) => {
        const { email, password, checkExpiresSession } = req.body;
        console.log(email, password, checkExpiresSession)
        const userAccount = await AccountUser.findOne({ where: { email } });

        if (!userAccount) {
            return res.json({ message: 'No existe una cuenta ligada a ese correo', flag: 1 });
        }

        if (userAccount.status !== 0) {
            return res.json({ message: 'La cuenta está inactiva, comuníquese con la UELDA', flag: 1 });
        }

        const isPasswordValid = await bcrypt.compare(password, userAccount.password);

        if (!isPasswordValid) {
            return res.json({ message: 'Contraseña equivocada', flag: 1 });
        }

        const user = await User.findOne({ where: { idUser: userAccount.idUser } });
        const role = await UserRole.findOne({ where: { idUserRole: user.idUserRole } });
        const expiresIn = checkExpiresSession ? '30d' : '8h';
        const token = jwt.sign({ id: userAccount.id }, process.env.Secret_key, { expiresIn });

        return res.json({ token, user, role });
    },

    updateAccount: async (req, res) => {
        try {
            const { externalId, password } = req.body;
            const userInfo = await User.findOne({ where: { externalId } });

            if (!userInfo) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const userAccount = await AccountUser.findOne({ where: { idUser: userInfo.idUser } });

            if (!userAccount) {
                return res.status(404).json({ message: 'Cuenta no encontrada' });
            }

            // Si solo se actualiza la contraseña y no hay archivos
            if (!req.files) {
                await controller.updatePassword(userAccount.idAccountUser, password);
                return res.json({ message: 'Se ha actualizado su contraseña', flagResponse: 1 });
            }

            // Si el usuario tiene una foto anterior, eliminarla
            if (userInfo.publicId) {
                await cloudinaryC.deleteFile(userInfo.publicId);
            }

            // Si hay una nueva foto, subirla
            if (req.files?.photo) {
                const result = await cloudinaryC.uploadImage(req.files.photo.tempFilePath);
                const photoData = {
                    photo: result.secure_url,
                    publicIdPhoto: result.public_id
                };

                await fs.unlink(req.files.photo.tempFilePath);
                await User.update(photoData, { where: { idUser: userInfo.idUser } });

                // Si también hay una nueva contraseña
                if (password !== 'null') {
                    await controller.updatePassword(userAccount.idAccountUser, password);
                    return res.json({ message: 'Se ha actualizado su foto y contraseña', photoData, flagResponse: 2 });
                }

                return res.json({ message: 'Se ha actualizado su foto de usuario', photoData, flagResponse: 2 });
            }

            return res.status(400).json({ message: 'No se recibieron cambios válidos' });

        } catch (error) {
            console.error('Error en updateAccount:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },

    updatePassword: async (idAccountUser, newPassword) => {
        const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
        await AccountUser.update({ password: hashedPassword }, { where: { idAccountUser: idAccountUser } });
    },

    updateAccountStatus: async (req, res) => {
        try {
            const { externalId, status } = req.body;

            // Buscar usuario por externalId
            const userInfo = await User.findOne({ where: { externalId } });

            if (!userInfo) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Buscar cuenta del usuario
            const userAccount = await AccountUser.findOne({ where: { idUser: userInfo.idUser } });

            if (!userAccount) {
                return res.status(404).json({ message: 'Cuenta de usuario no encontrada' });
            }

            // Actualizar estado de la cuenta
            await AccountUser.update({ status }, { where: { idAccountUser: userAccount.idAccountUser } });

            return res.json({
                message: 'Se ha actualizado el estado de la cuenta',
                user: {
                    lastName: userInfo.lastNameUser,
                    firstName: userInfo.firstNameUser
                }
            });

        } catch (error) {
            console.error('Error en updateAccountStatus:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    },

    verifyToken: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Unauthorized Request' });
            }

            const token = authHeader.split(' ')[1];
            if (!token || token === 'null') {
                return res.status(401).json({ message: 'Unauthorized Request' });
            }

            const payload = jwt.verify(token, process.env.Secret_key);
            if (!payload) {
                return res.status(401).json({ message: 'Unauthorized Request' });
            }

            req.userId = payload.id;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized Request' });
        }
    },

};

module.exports = controller;
