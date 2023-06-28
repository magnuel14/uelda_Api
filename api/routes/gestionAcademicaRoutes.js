const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const gestionAcademicaController = require('../controllers/gestionAcademicaController.js');

router.get('/get-allAniosLectivos', tryCatch(gestionAcademicaController.getAllAniosLectivos));
router.get('/get-AllCursos_Materias/:id_anioLectivo', (gestionAcademicaController.getAllCursos_Materias));
router.post('/create_AnioLectivo', (gestionAcademicaController.createAnioLectivo));

//gestion de matricula o promociones de estudiantes
router.post('/matricular_Estudiante', (gestionAcademicaController.matricularEstudiantes));
router.post('/promover_Estudiante', (gestionAcademicaController.promoverEstudiantes));



router.post('/test', (gestionAcademicaController.test));



module.exports = router;