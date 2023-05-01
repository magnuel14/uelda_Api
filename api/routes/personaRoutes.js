const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const userController = require('../controllers/personaController');

router.post('/registrar',tryCatch(userController.createPerson));
//router.post('/regis_infoMec',tryCatch(userController.infoMedica));
router.post('/update_infoMec',userController.updateinfoMedica);
router.post('/update_infoPersona',userController.updatePersona);





module.exports = router;