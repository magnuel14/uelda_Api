const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const personalController = require('../controllers/personalController');

//persona
router.get('/getPersonal', personalController.verifyToken, tryCatch(personalController.getPersonal));
router.get('/getPersonByEx/:externalId', personalController.verifyToken, tryCatch(personalController.getPersonByEx));
router.post('/update_infoPersona', personalController.verifyToken, tryCatch(personalController.updatePersona));
router.post('/registrar_persona', personalController.verifyToken, tryCatch(personalController.createPerson));
router.post('/registrar_Listapersonal', personalController.verifyToken, tryCatch(personalController.registrarPersonal));
//id_rol
router.post('/update_rolPersona', personalController.verifyToken, tryCatch(personalController.updatePersonalRol));
//información medica
router.get('/getInfoMedicByEx/:externalId', personalController.verifyToken, tryCatch(personalController.getInfoMedicByEx));
router.post('/update_infoMec', personalController.verifyToken, tryCatch(personalController.updateinfoMedica));
//información profesional
router.get('/getInfoProByEx/:externalId', personalController.verifyToken, (personalController.getInfoProByEx));
router.post('/update_infoPPro', personalController.verifyToken, tryCatch(personalController.updatePerfilProfe));
//información titulo profesional
router.get('/getTituloProByEx/:externalId', personalController.verifyToken, tryCatch(personalController.getTituloProByEx));
router.post('/update_infoTPro', personalController.verifyToken, tryCatch(personalController.updateTitutuloPro));

module.exports = router;

