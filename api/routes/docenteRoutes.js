const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const docenteController = require('../controllers/docenteController');

//estudiante
router.get('/getCargaHoraria_byList_externalID', docenteController.verifyToken, tryCatch(docenteController.getCargaHoraria_byList_externalID));
router.get('/getCargaHoraria_by_externalID', docenteController.verifyToken, tryCatch(docenteController.getCargaHoraria_by_externalID));
router.get('/get_AllCargaHoraria', docenteController.verifyToken, tryCatch(docenteController.getAllCargaHoraria));
router.post('/create_CargaHoraria', docenteController.verifyToken, tryCatch(docenteController.createCargaHoraria));
router.post('/update_CargaHoraria', docenteController.verifyToken, tryCatch(docenteController.updateCargaHoraria));

//califiaciones
router.post('/update_Calicaciones', docenteController.verifyToken, tryCatch(docenteController.updateCalicaciones));

//asistencias
router.post('/update_Asistencias', docenteController.verifyToken, tryCatch(docenteController.updateAsistencias));

//paralelos
router.get('/getParaleloTutor_docente/:externalId', docenteController.verifyToken, tryCatch(docenteController.getParaleloTutor_docente));
router.get('/getAllmatriculas_byIdParalelo/:id_paralelo', docenteController.verifyToken, tryCatch(docenteController.getAllmatriculas_byIdParalelo));
//promover estudiantes
router.post('/comprobarPromocionEstudiante_byParalelo', docenteController.verifyToken, tryCatch(docenteController.comprobarPromocionEstudiante_byParalelo));

module.exports = router;

