const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const gestionAcademicaController = require('../controllers/gestionAcademicaController.js');

//gestion de año lectivo
router.get('/get-allAniosLectivos', tryCatch(gestionAcademicaController.getAllAniosLectivos));
router.get('/get-AllCursos_Materias/:id_anioLectivo', tryCatch(gestionAcademicaController.getAllCursos_Materias));
router.post('/create_AnioLectivo', tryCatch(gestionAcademicaController.createAnioLectivo));
router.post('/update_AnioLectivo', tryCatch(gestionAcademicaController.updateAnioLectivo));
router.post('/update_EstadoAnioLectivo', tryCatch(gestionAcademicaController.updateEstadoAnioLectivo));

//gestion de matricula o promociones de estudiantes
router.post('/matricular_Estudiante', tryCatch(gestionAcademicaController.matricularEstudiantes));
router.post('/promover_Estudiante', tryCatch(gestionAcademicaController.promoverEstudiantes));

//asigancion por subnivel
router.post('/updateAsignacionDocente_xsubnivel', tryCatch(gestionAcademicaController.createAsignacionDocente_xsubnivel));

//curso
router.get('/getCurso_byId/:id_curso', tryCatch(gestionAcademicaController.getCurso_byId));
//paralelo
router.get('/getParalelo_byId/:id_paralelo', tryCatch(gestionAcademicaController.getParalelo_byId));
//materia
router.get('/getMateria_byId/:id_materia', tryCatch(gestionAcademicaController.getMateria_byId));
//promocion estudiante
router.post('/comprobarPromocionEstudiante', (gestionAcademicaController.comprobarPromocionEstudiante));

module.exports = router;