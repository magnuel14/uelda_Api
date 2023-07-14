const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const docenteController = require('../controllers/docenteController');

//estudiante
router.get('/getCargaHoraria_byList_externalID', (docenteController.getCargaHoraria_byList_externalID));
router.get('/getCargaHoraria_by_externalID', (docenteController.getCargaHoraria_by_externalID));
router.get('/get_AllCargaHoraria', (docenteController.getAllCargaHoraria));
router.post('/create_CargaHoraria', (docenteController.createCargaHoraria));
router.post('/update_CargaHoraria', (docenteController.updateCargaHoraria));

//califiaciones
router.post('/update_Calicaciones', (docenteController.updateCalicaciones));

//asistencias
router.post('/update_Asistencias', (docenteController.updateAsistencias));

//paralelos
router.get('/getParaleloTutor_docente/:externalId', (docenteController.getParaleloTutor_docente));
router.get('/getAllmatriculas_byIdParalelo/:id_paralelo', (docenteController.getAllmatriculas_byIdParalelo));



module.exports = router;

