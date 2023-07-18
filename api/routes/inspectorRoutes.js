const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const inspectorController = require('../controllers/inspectorController');

router.get('/getPersonal_asistencia', tryCatch(inspectorController.getPersonal_asistencia));
router.post('/registrar_asisteciaDocente', tryCatch(inspectorController.createAsistencia_Docentes));
router.post('/update_asisteciaDocente', tryCatch(inspectorController.updateAsistencia_Docente));
router.post('/update_rolAux_Persona', tryCatch(inspectorController.updateRol_auxilar));

module.exports = router;

