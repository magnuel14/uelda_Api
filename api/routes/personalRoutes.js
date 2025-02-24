const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const personalController = require('../controllers/personalController');

//persona
router.get('/getPersonal', tryCatch(personalController.getPersonal));
router.get('/getPersonByExternalId/:externalId', tryCatch(personalController.getUserByExternalId));

router.post('/createPerson', tryCatch(personalController.createPerson));
router.post('/updateInfoPersona', tryCatch(personalController.updatePersona));
//registrar varios usuario
router.post('/registrarListapersonal', tryCatch(personalController.registrarPersonal));
//id_rol
router.post('/updateRolePersona', tryCatch(personalController.updateUserRole));
//información medica
router.get('/getMedicalInfoByExternalId/:externalId', tryCatch(personalController.getMedicalInfoByExternalId));
router.post('/updateMedicalInfo', tryCatch(personalController.updateMedicalInfo));
//información profesional
router.get('/getProfessionalProfileByExternalId/:externalId', tryCatch(personalController.getProfessionalProfileByExternalId));
router.post('/updateProfessionalProfile', tryCatch(personalController.updateProfessionalProfile));
//información titulo profesional
//router.get('/getProfessionalTitlesByExternalId/:externalId',  tryCatch(personalController.getProfessionalTitlesByExternalId));
router.post('/createProfessionalTitle', tryCatch(personalController.createProfessionalTitle));
router.post('/updateProfessionalTitle', tryCatch(personalController.updateProfessionalTitle));
//informacion direccion de casa
router.get('/getHomeAddressByExternalId/:externalId', tryCatch(personalController.getHomeAddressByExternalId));
router.post('/updateHomeAddress', tryCatch(personalController.updateHomeAddress));

module.exports = router;

