const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const controller = '../controllers/gestionAcademicaController.js';
const gestionAcademicaController = require(controller);

router.get('/get-allAniosLectivos', tryCatch(gestionAcademicaController.getAllAniosLectivos));
router.get('/get-AllCursos_Materias/:id_anioLectivo', (gestionAcademicaController.getAllCursos_Materias));
router.post('/create_AnioLectivo', (gestionAcademicaController.createAnioLectivo));

//matricular estudiante
router.post('/matricular_Estudiante', (gestionAcademicaController.matricularEstudiante));


router.get('/test', (gestionAcademicaController.test));



module.exports = router;