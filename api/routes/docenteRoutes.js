const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const docenteController = require('../controllers/docenteController');

//estudiante
router.get('/getCargaHoraria_byList_externalID', (docenteController.getCargaHoraria_byList_externalID));
router.get('/get_AllCargaHoraria', (docenteController.getAllCargaHoraria));
router.post('/create_CargaHoraria', (docenteController.createCargaHoraria));

//paralelos
router.get('/getParaleloTutor_docente', (docenteController.getParaleloTutor_docente));
router.get('/getAllmatriculas_byIdParalelo/:id_paralelo', (docenteController.getAllmatriculas_byIdParalelo));



module.exports = router;

