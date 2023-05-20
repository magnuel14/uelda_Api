const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const userController = require('../controllers/personalController');

//persona
router.get('/getPersonal',tryCatch(userController.getPersonal));
router.get('/getPersonByEx/:externalId',tryCatch(userController.getPersonByEx));
router.post('/registrar_persona',(userController.createPerson));
router.post('/update_infoPersona',tryCatch(userController.updatePersona));
//cuenta
router.post('/update_infoCuenta',tryCatch(userController.updateCuenta));
router.post('/update_estadoC',tryCatch(userController.updateEstadoCuenta));
//información medica
router.get('/getInfoMedicByEx/:externalId',tryCatch(userController.getInfoMedicByEx));
router.post('/update_infoMec',tryCatch(userController.updateinfoMedica));
//información profesional
router.get('/getInfoProByEx/:externalId',(userController.getInfoProByEx));
router.post('/update_infoPPro',tryCatch(userController.updatePerfilProfe));
//información titulo profesional
router.get('/getTituloProByEx/:externalId',tryCatch(userController.getTituloProByEx));
router.post('/update_infoTPro',tryCatch(userController.updateTitutuloPro));




module.exports = router;

//router.post('/regis_infoMec',tryCatch(userController.infoMedica));
