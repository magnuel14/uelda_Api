const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

//estudiante
router.get('/getEstudiantes', estudianteController.verifyToken, tryCatch(estudianteController.getEstudiantes));
router.get('/getEstudiantesExternal', estudianteController.verifyToken, tryCatch(estudianteController.getEstudiantesExternal));


router.get('/getCalificacionesEstudianteByExternal/:externalId', estudianteController.verifyToken, estudianteController.getCalificacionesEstudianteByExternalId);
router.get('/getEstudianteByEx/:externalId', estudianteController.verifyToken, tryCatch(estudianteController.getEstudianteByEx));
router.post('/update_infoEstudiante', estudianteController.verifyToken, tryCatch(estudianteController.updateEstudiante));


router.post('/registrar_estudiante', estudianteController.verifyToken, tryCatch(estudianteController.createEstudiante));
router.post('/registrar_lista_estudiantes', estudianteController.verifyToken, tryCatch(estudianteController.registroEstudiantes));

//representante
router.get('/getRepresentanteByEx/:externalId', estudianteController.verifyToken, tryCatch(estudianteController.getRepresentantesByEx));
router.get('/getRepresentanteByDNI/:numeroId', estudianteController.verifyToken, tryCatch(estudianteController.getRepresentanteByDNI));
router.post('/registrar_representante', estudianteController.verifyToken, tryCatch(estudianteController.createRepresentante));
router.post('/update_infoRepresentante', estudianteController.verifyToken, tryCatch(estudianteController.updateRepresentante));
router.post('/delete_infoRepresentante', estudianteController.verifyToken, tryCatch(estudianteController.deleteRepresentante));
//hernanos
router.get('/getHermanosByEx/:externalId', estudianteController.verifyToken, tryCatch(estudianteController.getAllhermanos));
router.post('/registrar_hermano', estudianteController.verifyToken, tryCatch(estudianteController.addHermano));
router.post('/delete_hermano', estudianteController.verifyToken, tryCatch(estudianteController.deleteHermano));
//calificaciones - asistencias
router.get('/getAsistenciasEstudiante/:externalId', estudianteController.verifyToken, tryCatch(estudianteController.getAsistenciasEstudiante));

module.exports = router;

