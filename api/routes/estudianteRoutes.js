const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

//estudiante
router.get('/getEstudiantes', tryCatch(estudianteController.getEstudiantes));
router.post('/registrar_estudiante', tryCatch(estudianteController.createEstudiante));
router.get('/getEstudianteByEx/:externalId', tryCatch(estudianteController.getEstudianteByEx));
router.post('/update_infoEstudiante', tryCatch(estudianteController.updateEstudiante));
//representante
router.get('/getRepresentanteByEx/:externalId', tryCatch(estudianteController.getRepresentantesByEx));
router.get('/getRepresentanteByDNI/:numeroId', tryCatch(estudianteController.getRepresentanteByDNI));
router.post('/registrar_representante', tryCatch(estudianteController.createRepresentante));
router.post('/update_infoRepresentante', tryCatch(estudianteController.updateRepresentante));
router.post('/delete_infoRepresentante', tryCatch(estudianteController.deleteRepresentante));
//hernanos
router.get('/getHermanosByEx/:externalId', tryCatch(estudianteController.getAllhermanos));
router.post('/registrar_hermano', tryCatch(estudianteController.addHermano));
router.post('/delete_hermano', tryCatch(estudianteController.deleteHermano));

module.exports = router;

