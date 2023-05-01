const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const userController = require('../controllers/personaController');

router.post('/registrar_persona',tryCatch(userController.createPerson));
//router.post('/regis_infoMec',tryCatch(userController.infoMedica));
router.post('/update_infoMec',tryCatch(userController.updateinfoMedica));
router.post('/update_infoPersona',tryCatch(userController.updatePersona));
router.post('/update_infoCuenta',tryCatch(userController.updateCuenta));
router.post('/update_infoPPro',tryCatch(userController.updatePerfilProfe));







module.exports = router;