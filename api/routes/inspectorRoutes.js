const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const inspectorController = require('../controllers/inspectorController');

router.get('/getPersonal_asistencia', inspectorController.verifyToken, tryCatch(inspectorController.getPersonal_asistencia));
router.post('/registrar_asisteciaDocente', inspectorController.verifyToken, tryCatch(inspectorController.createAsistencia_Docentes));
router.post('/update_asisteciaDocente', inspectorController.verifyToken, tryCatch(inspectorController.updateAsistencia_Docente));
router.post('/update_rolAux_Persona', inspectorController.verifyToken, tryCatch(inspectorController.updateRol_auxilar));

module.exports = router;

