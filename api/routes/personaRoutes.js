const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const userController = require('../controllers/personaController');

//persona
router.post('/registrar_persona',tryCatch(userController.createPerson));
router.post('/update_infoPersona',tryCatch(userController.updatePersona));
//cuenta
router.post('/update_infoCuenta',tryCatch(userController.updateCuenta));
router.post('/update_estadoC',tryCatch(userController.updateEstadoCuenta));
//información adicional
router.post('/update_infoMec',tryCatch(userController.updateinfoMedica));
router.post('/update_infoPPro',tryCatch(userController.updatePerfilProfe));

module.exports = router;

//router.post('/regis_infoMec',tryCatch(userController.infoMedica));
