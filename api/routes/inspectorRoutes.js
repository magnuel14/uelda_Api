const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const inspectorController = require('../controllers/inspectorController');

//persona
//router.get('/getPersonal', tryCatch(inspectorController.getPersonal));
//router.post('/registrar_persona', (inspectorController.createPerson));
//router.post('/update_infoPersona', tryCatch(inspectorController.updatePersona));
//id_rol

router.get('/getPersonal_asistencia', (inspectorController.getPersonal_asistencia));
router.post('/update_rolAux_Persona', (inspectorController.updateRol_auxilar));
router.post('/registrar_asisteciaDocente', (inspectorController.createAsistencia_Docentes));

module.exports = router;

//router.post('/regis_infoMec',tryCatch(userController.infoMedica));
