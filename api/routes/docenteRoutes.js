const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const docenteController = require('../controllers/docenteController');

//estudiante
router.get('/getCargaHoraria_byList_externalID', (docenteController.getCargaHoraria_byList_externalID));
//router.get('/getCargaHoraria_by_externalID', (docenteController.getCargaHoraria_by_externalID));
router.get('/get_AllCargaHoraria', (docenteController.getAllCargaHoraria));

//router.post('/create_CargaHoraria', (docenteController.createCargaHoraria));
router.post('/update_CargaHoraria', (docenteController.updateCargaHoraria));

router.post('/create_CargaHorariaV2', (docenteController.createCargaHorariaV2));
router.get('/getCargaHorariaByExternalID', (docenteController.getCargaHorariaByExternalID));



//califiaciones
router.post('/update_Calicaciones', tryCatch(docenteController.updateCalicaciones));

//asistencias
router.post('/update_Asistencias', tryCatch(docenteController.updateAsistencias));

//paralelos
router.get('/getParaleloTutor_docente/:externalId', tryCatch(docenteController.getParaleloTutor_docente));
router.get('/getParaleloTutor_docenteV2/:externalId', tryCatch(docenteController.getParaleloTutor_docenteV2));

router.get('/getAllmatriculas_byIdParalelo/:id_paralelo', tryCatch(docenteController.getAllmatriculas_byIdParalelo));

//promover estudiantes
router.post('/comprobarPromocionEstudiante_byParalelo', tryCatch(docenteController.comprobarPromocionEstudiante_byParalelo));

module.exports = router;

