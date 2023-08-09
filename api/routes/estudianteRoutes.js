const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

//estudiante
router.get('/getEstudiantes', tryCatch(estudianteController.getEstudiantes));
router.get('/getEstudiantesExternal', tryCatch(estudianteController.getEstudiantesExternal));

router.get('/getEstudianteByEx/:externalId', tryCatch(estudianteController.getEstudianteByEx));
router.post('/update_infoEstudiante', tryCatch(estudianteController.updateEstudiante));

router.post('/registrar_estudiante', tryCatch(estudianteController.createEstudiante));
router.post('/registrar_lista_estudiantes', tryCatch(estudianteController.registroEstudiantes));

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
//calificaciones - asistencias
router.get('/getCalifiaciones_asistencias/:externalId', tryCatch(estudianteController.getCalifiaciones_asistencias));

module.exports = router;

