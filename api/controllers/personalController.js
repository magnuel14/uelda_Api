'use strict';
const jwt = require('jsonwebtoken');
const cloudinaryC = require('../../cloudinary');
const models = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const fs = require('fs-extra');
const dotenv = require('dotenv');
dotenv.config();
const mailing = require('../../helpers/emailTemplates');

const cedulaValidator = require('../../helpers/cedulaHelper');
const getCurrentDate = require('../../helpers/getCurrentDate');

const User = models.user;
const UserRole = models.userRole;
const AccountUser = models.accountUser;
const MedicalInfo = models.medicalInfo;
const ProfessionalProfile = models.professionalProfile;
const ProfessionalTitle = models.professionalTitle;
const HomeAddress = models.homeAddress;


let controller = {
    /** Implementado try cath*/

    getPersonal: async (req, res) => {
        const personal = await User.findAll(
            {
                include: [AccountUser],
                where: {
                    [Op.or]: [
                        { idUserRole: 1 },
                        { idUserRole: 2 },
                        { idUserRole: 3 },
                        { idUserRole: 4 },
                        { idUserRole: 5 }
                    ]
                }
            });

        return res.json(personal);
    },

    getUserByExternalId: async (req, res) => {
        const { externalId } = req.params;
        const infoUser = await User.findOne({ where: { externalId: externalId } });
        return res.json(infoUser);
    },

    getNameOfRole: async (idUserRole) => {
        const nameRole = await UserRole.findOne({
            where: { idUserRole: idUserRole },
            attributes: ['name']
        });
        return nameRole.name;
    },

    createPerson: async (req, res) => {
        try {
            const { firstNameUser, lastNameUser, documentTypeUser, documentDniNumberUser, personalEmailUser, idUserRole } = req.body;

            // Convertir documento a string
            const documentNumberString = String(documentDniNumberUser);

            // Validar número de cédula
            const cedulaValidation = cedulaValidator.validator(documentNumberString);
            if (cedulaValidation.flag !== 3) {
                return res.json({ message: cedulaValidation.message, flag: 1 });
            }

            // Buscar si ya existe el usuario por DNI o correo
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { documentDniNumberUser: documentNumberString },
                        { personalEmailUser: personalEmailUser }
                    ]
                }
            });

            if (existingUser) {
                return res.json({ message: 'Ya existe un usuario con ese número de DNI o correo personal', flag: 1 });
            }

            // Crear usuario
            const newUser = await controller.createUser(firstNameUser, lastNameUser, documentTypeUser, documentNumberString, personalEmailUser, idUserRole);

            // Crear cuenta de usuario
            await controller.createAccountUser(newUser.idUser, personalEmailUser, documentNumberString);

            // Crear información médica por defecto
            await controller.createMedicalInfo(newUser.idUser);

            // Crear perfil profesional por defecto
            await controller.createProfessionalProfile(newUser.idUser);

            // Crear dirección de usuario por defecto
            await controller.createHomeAddress(newUser.idUser);

            const nameRole = await controller.getNameOfRole(idUserRole);
            return res.json({ message: 'Ha generado un nuevo usuario', user: { firstNameUser, lastNameUser, nameRole }, flag: 0 });

        } catch (error) {
            console.error("Error en createPerson:", error);
            return res.status(500).json({ message: 'Error interno del servidor', flag: 1 });
        }
    },

    createUser: async (firstNameUser, lastNameUser, documentTypeUser, documentDniNumberUser, personalEmailUser, idUserRole) => {
        return await User.create({
            firstNameUser,
            lastNameUser,
            documentTypeUser,
            documentDniNumberUser,
            idUserRole,
            personalEmailUser
        });
    },

    createAccountUser: async (idUser, email, password) => {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const statusDefaultCount = 0;

        return await AccountUser.create({
            email: email,
            password: hashedPassword,
            status: statusDefaultCount,
            idUser: idUser
        });
    },

    createMedicalInfo: async (idUser) => {
        return await MedicalInfo.create({
            idUser: idUser,
            disability: 1,
            disabilityType: "N/A",
            disabilityPercentage: "N/A",
            disabilityCardNumber: "N/A",
            catastrophicIllness: 1,
            catastrophicIllnessType: "N/A"
        });
    },

    createProfessionalProfile: async (idUser) => {
        return await ProfessionalProfile.create({
            idUser: idUser,
            entryDateMinistry: getCurrentDate.getCurrentDate(),
            ministryTime: 'N/A',
            entryDateUELDA: getCurrentDate.getCurrentDate(),
            UELDATime: 'N/A',
            category: 'N/A',
            categoryYears: 'N/A'
        });
    },

    createHomeAddress: async (idUser) => {
        try {
            return await HomeAddress.create({
                idUser,
                parish: "N/A",
                neighborhood: "N/A",
                houseReference: "N/A",
                homeId: "N/A",
                mainStreet: "N/A",
                secondaryStreet: "N/A",
            });
        } catch (error) {
            console.error("Error creando dirección por defecto:", error);
            throw error;
        }
    },


    updatePersona: async (req, res) => {
        try {
            const { externalId } = req.body;

            const userInfo = await User.findOne({ where: { externalId } });
            if (!userInfo) return res.json({ message: "No existe un usuario con esa información" });

            // Actualizar información personal
            await controller.updateUserData(userInfo, req.body);

            // Manejo de archivos (documentos de identificación)
            if (req.files?.identificationDocuments) {
                await handleDocumentUpload(userInfo, req.files.identificationDocuments);
            }

            return res.json({ message: "Se ha actualizado la información de usuario" });

        } catch (error) {
            console.error("Error en updateUser:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    updateUserData: async (userInfo, data) => {
        const updateData = {
            firstNameUser: data.firstNameUser,
            lastNameUser: data.lastNameUser,
            nationalityUser: data.nationalityUser,
            cityResidenceUser: data.cityResidenceUser,
            provinceResidenceUser: data.provinceResidenceUser,
            birthDateUser: data.birthDateUser,
            ageUser: data.ageUser,
            personalEmailUser: data.personalEmailUser,
            institutionalEmailUser: data.institutionalEmailUser,
            mobileUser: data.mobileUser,
            phoneUser: data.phoneUser,
            maritalStatusUser: data.maritalStatusUser,
            ethnicityUser: data.ethnicityUser,
            genderUser: data.genderUser,
            familyDependentsUser: data.familyDependentsUser,
            educationalDependentsUser: data.educationalDependentsUser,
            nationalElectricCode: data.nationalElectricCode,
            parentStatus: data.parentStatus,
            householdList: data.householdList
        };

        await User.update(updateData, { where: { externalId: userInfo.externalId } });
    },

    updateAccountEmail: async (userAccount, newEmail) => {
        const existingAccount = await AccountUser.findOne({ where: { email: newEmail } });

        if (existingAccount && existingAccount.idAccountUser !== userAccount.idAccountUser) {
            return { error: true, message: "Este correo está ligado a otro usuario" };
        }

        await AccountUser.update({ email: newEmail }, { where: { idAccountUser: userAccount.idAccountUser } });
        return { error: false };
    },

    handleDocumentUpload: async (userInfo, file) => {
        // Si ya tiene un documento almacenado, eliminarlo de Cloudinary
        if (userInfo.identificationDocumentsPublicId) {
            await cloudinaryC.deleteFile(userInfo.identificationDocumentsPublicId);
        }

        const result = await cloudinaryC.uploadFile(file.tempFilePath, { resource_type: "raw" });

        // Actualizar la URL y el Public ID del documento en la base de datos
        await User.update({
            identificationDocumentsUrl: result.secure_url,
            identificationDocumentsPublicId: result.public_id
        }, { where: { externalId: userInfo.externalId } });

        await fs.unlink(file.tempFilePath); // Eliminar archivo temporal del servidor
    },

    getMedicalInfoByExternalId: async (req, res) => {
        try {
            const { externalId } = req.params;

            const userInfo = await User.findOne({ where: { externalId } });
            if (!userInfo) return res.status(404).json({ message: "Usuario no encontrado" });

            const medicalInfo = await MedicalInfo.findOne({ where: { idUser: userInfo.idUser } });
            return res.json({ medicalInfo });

        } catch (error) {
            console.error("Error en getMedicalInfo:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    updateMedicalInfo: async (req, res) => {
        try {
            const { externalId, ...medicalData } = req.body;

            const userInfo = await User.findOne({ where: { externalId } });
            if (!userInfo) return res.status(404).json({ message: "Usuario no encontrado" });

            const medicalInfo = await MedicalInfo.findOne({ where: { idUser: userInfo.idUser } });
            if (!medicalInfo) return res.status(404).json({ message: "Información médica no encontrada" });

            await MedicalInfo.update(medicalData, { where: { idMedicalInfo: medicalInfo.idMedicalInfo } });
            return res.json({ message: "Información médica actualizada" });

        } catch (error) {
            console.error("Error en updateMedicalInfo:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    getProfessionalProfileByExternalId: async (req, res) => {
        try {
            const { externalId } = req.params;

            // Buscar el usuario por externalId
            const user = await User.findOne({ where: { externalId } });
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado", flag: 1 });
            }

            // Buscar perfil profesional con títulos profesionales asociados
            const professionalProfile = await ProfessionalProfile.findOne({
                where: { idUser: user.idUser },
                include: [
                    {
                        model: ProfessionalTitle,
                        as: "professionalTitles",
                        attributes: ["idProfessionalTitle", "titleName", "titleType", "yearOfAchievement"]
                    }
                ]
            });

            if (!professionalProfile) {
                return res.status(404).json({ message: "Perfil profesional no encontrado", flag: 1 });
            }

            return res.json({ professionalProfile });

        } catch (error) {
            console.error("Error en getProfessionalProfileByExternalId:", error);
            return res.status(500).json({ message: "Error interno del servidor", flag: 1 });
        }
    },

    updateProfessionalProfile: async (req, res) => {
        try {
            const { externalId, ...profileData } = req.body;

            const userInfo = await User.findOne({ where: { externalId } });
            if (!userInfo) return res.status(404).json({ message: "Usuario no encontrado" });

            const professionalProfile = await ProfessionalProfile.findOne({ where: { idUser: userInfo.idUser } });
            if (!professionalProfile) return res.status(404).json({ message: "Perfil profesional no encontrado" });

            await ProfessionalProfile.update(profileData, { where: { idProfessionalProfile: professionalProfile.idProfessionalProfile } });
            return res.json({ message: "Perfil profesional actualizado" });

        } catch (error) {
            console.error("Error en updateProfessionalProfile:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    createProfessionalTitle: async (req, res) => {
        try {
            const { idProfessionalProfile, titleName, titleType, yearOfAchievement } = req.body;

            // Validación de datos requeridos
            if (!idProfessionalProfile || !titleName || titleType === undefined || !yearOfAchievement) {
                return res.status(400).json({ message: "All fields are required", success: false });
            }

            // Creación del título profesional
            const newTitle = await ProfessionalTitle.create({
                idProfessionalProfile,
                titleName,
                titleType,
                yearOfAchievement
            });

            return res.status(201).json({ message: "Professional title added successfully", success: true, data: newTitle });
        } catch (error) {
            console.error("Error creating professional title:", error);
            return res.status(500).json({ message: "Internal server error", success: false });
        }
    },

    updateProfessionalTitle: async (req, res) => {
        try {
            const { externalId, ...titleData } = req.body;

            const professionalTitle = await ProfessionalTitle.findOne({ where: { externalId: externalId } });
            if (!professionalTitle) return res.status(404).json({ message: "Título profesional no encontrado" });

            await ProfessionalTitle.update(titleData, { where: { idProfessionalTitle: professionalTitle.idProfessionalTitle } });
            return res.json({ message: "Título profesional actualizado" });

        } catch (error) {
            console.error("Error en updateProfessionalTitle:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    getHomeAddressByExternalId: async (req, res) => {
        try {
            const { externalId } = req.params;

            const userInfo = await User.findOne({ where: { externalId } });
            if (!userInfo) return res.status(404).json({ message: "Usuario no encontrado" });

            const homeAddress = await HomeAddress.findOne({ where: { idUser: userInfo.idUser } });
            return res.json({ homeAddress });

        } catch (error) {
            console.error("Error en getHomeAddress:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    updateHomeAddress: async (req, res) => {
        try {
            const { externalId, ...addressData } = req.body;

            const userInfo = await User.findOne({ where: { externalId } });
            if (!userInfo) return res.status(404).json({ message: "Usuario no encontrado" });

            const homeAddress = await HomeAddress.findOne({ where: { idUser: userInfo.idUser } });
            if (!homeAddress) return res.status(404).json({ message: "Dirección no encontrada" });

            await HomeAddress.update(addressData, { where: { idHomeAddress: homeAddress.idHomeAddress } });
            return res.json({ message: "Dirección actualizada correctamente" });

        } catch (error) {
            console.error("Error en updateHomeAddress:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    updateUserRole: async (req, res) => {
        try {
            const { externalId, idUserRole } = req.body;

            // Validar datos de entrada
            if (!externalId || !idUserRole) {
                return res.status(400).json({ message: "External ID y rol son obligatorios." });
            }

            // Buscar usuario y su cuenta asociada
            const userInfo = await User.findOne({
                include: [{ model: models.accountUser }],
                where: { externalId }
            });

            if (!userInfo) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            // Verificar estado de la cuenta
            if (userInfo.accountUser.status !== 0) {
                return res.status(403).json({ message: "La cuenta del usuario está inactiva." });
            }

            // Actualizar rol del usuario
            await User.update({ idUserRole }, { where: { externalId } });

            return res.json({ message: "El rol del usuario ha sido actualizado correctamente." });

        } catch (error) {
            console.error("Error en updateUserRole:", error);
            return res.status(500).json({ message: "Error interno del servidor." });
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
        try {
            const { listaPersonal } = req.body;

            if (!listaPersonal || !Array.isArray(listaPersonal) || listaPersonal.length === 0) {
                return res.status(400).json({ message: "Lista de personal vacía o no válida", flag: 1 });
            }

            const usuariosRegistrados = [];

            // Procesar cada usuario de la lista de manera concurrente
            await Promise.all(listaPersonal.map(async (usuario) => {
                const { firstNameUser, lastNameUser, documentTypeUser, documentDniNumberUser, personalEmailUser, idUserRole } = usuario;
                const documentNumberString = String(documentDniNumberUser);

                // Validar número de cédula
                const cedulaValidation = cedulaValidator.validator(documentNumberString);
                if (cedulaValidation.flag !== 3) {
                    console.warn(`Cédula inválida para ${firstNameUser} ${lastNameUser}: ${cedulaValidation.message}`);
                    return;
                }

                // Verificar si el usuario ya existe
                const existingUser = await User.findOne({
                    where: {
                        [Op.or]: [
                            { documentDniNumberUser: documentNumberString },
                            { personalEmailUser: personalEmailUser }
                        ]
                    }
                });

                if (existingUser) {
                    console.warn(`Usuario ya existente: ${firstNameUser} ${lastNameUser} con DNI ${documentNumberString}`);
                    return;
                }

                // Crear usuario utilizando la función modularizada
                const newUser = await controller.createUser(firstNameUser, lastNameUser, documentTypeUser, documentNumberString, personalEmailUser, idUserRole);
                await controller.createAccountUser(newUser.idUser, personalEmailUser, documentNumberString);
                await controller.createMedicalInfo(newUser.idUser);
                await controller.createProfessionalProfile(newUser.idUser);
                await controller.createHomeAddress(newUser.idUser);

                usuariosRegistrados.push({ firstNameUser, lastNameUser, personalEmailUser });
            }));

            if (usuariosRegistrados.length === 0) {
                return res.status(200).json({ message: "No se registró ningún usuario nuevo", flag: 2 });
            }

            return res.status(200).json({ message: "Usuarios registrados exitosamente", usuariosRegistrados, flag: 0 });

        } catch (error) {
            console.error("Error en registrarPersonal:", error);
            return res.status(500).json({ message: "Error interno del servidor", flag: 1 });
        }
    },

    /**Fin funciones validadas */
    verifyToken: async (req, res, next) => {
        try {
            if (!req.headers.authorization) {
                return res.status(401).send('Unauhtorized Request');
            }
            let token = req.headers.authorization.split(' ')[1];
            if (token === 'null') {
                return res.status(401).send('Unauhtorized Request');
            }

            const payload = await jwt.verify(token, process.env.Secret_key);
            if (!payload) {
                return res.status(401).send('Unauhtorized Request');
            }
            req.userId = payload._id;
            next();
        } catch (e) {
            return res.status(401).send('Unauhtorized Request');
        }
    }
}

module.exports = controller;
