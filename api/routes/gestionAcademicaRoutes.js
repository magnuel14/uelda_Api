const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const gestionAcademicaController = require('../controllers/gestionAcademicaController.js');

//gestion de año lectivo
router.get('/get-allAniosLectivos', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.getAllAniosLectivos));
router.get('/get-AllCursos_Materias', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.getAllCursos_Materias));
router.post('/create_AnioLectivo', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.createAnioLectivo));
router.post('/update_AnioLectivo', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.updateAnioLectivo));
router.post('/update_EstadoAnioLectivo', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.updateEstadoAnioLectivo));

//gestion de matricula o promociones de estudiantes
router.post('/matricular_Estudiante', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.matricularEstudiantes));
router.post('/update_matricula_Estudiante', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.updateMatriculaEstudiante));
router.get('/get-allMatriculas', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.getAllMatriculas));
router.get('/get-estudiantes-no-matriculados', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.getAllEstudiantesNoMatriculados));

router.post('/promover_Estudiante', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.promoverEstudiantes));

//curso
router.get('/getCurso_byId/:id_curso', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.getCurso_byId));
//paralelo
router.get('/getParalelo_byId/:id_paralelo', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.getParalelo_byId));
//materia
router.get('/getMateria_byId/:id_materia', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.getMateria_byId));
//promocion estudiante
router.post('/comprobarPromocionEstudiante', gestionAcademicaController.verifyToken, tryCatch(gestionAcademicaController.comprobarPromocionEstudiante));

router.post('/matriculaPDF', (gestionAcademicaController.matriculaPDF));


module.exports = router;