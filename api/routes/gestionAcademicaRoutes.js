const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const gestionAcademicaController = require('../controllers/gestionAcademicaController.js');

router.get('/get-allAniosLectivos', tryCatch(gestionAcademicaController.getAllAniosLectivos));
router.get('/get-AllCursos_Materias/:id_anioLectivo', (gestionAcademicaController.getAllCursos_Materias));
router.post('/create_AnioLectivo', (gestionAcademicaController.createAnioLectivo));

//matricular estudiante
router.post('/matricular_Estudiante', (gestionAcademicaController.matricularEstudiante));


router.post('/test', (gestionAcademicaController.test));



module.exports = router;