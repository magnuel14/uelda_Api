const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const estudianteController = require('../controllers/estudianteController');

//estudiante
router.get('/getEstudiantes', tryCatch(estudianteController.getEstudiantes));
router.post('/registrar_estudiante', (estudianteController.createEstudiante));
router.get('/getEstudianteByEx/:externalId', tryCatch(estudianteController.getEstudianteByEx));
router.post('/update_infoEstudiante', tryCatch(estudianteController.updateEstudiante));
//representante
router.get('/getRepresentanteByEx/:externalId', tryCatch(estudianteController.getRepresentanteByEx));
router.post('/registrar_representante', tryCatch(estudianteController.createRepresentante));
router.post('/update_infoRepresentante', tryCatch(estudianteController.updateRepresentante));
router.post('/delete_infoRepresentante', tryCatch(estudianteController.deleteRepresentante));
//hernanos
router.get('/getHermanosByEx/:externalId', (estudianteController.getAllhermanos));
router.post('/registrar_hermano', (estudianteController.addHermano));
router.post('/delete_hermano', (estudianteController.deleteHermano));



//router.get('/getEstudianteByEx/:externalId',tryCatch(estudianteController.getEstudianteByEx));
//router.post('/update_infoEstudiante',tryCatch(estudianteController.updateEstudiante));


/** 
router.get('/getPersonByEx/:externalId',tryCatch(estudianteController.getPersonByEx));
router.post('/registrar_persona',tryCatch(estudianteController.createPerson));
router.post('/update_infoPersona',tryCatch(estudianteController.updatePersona));
//cuenta
router.post('/update_infoCuenta',tryCatch(estudianteController.updateCuenta));
router.post('/update_estadoC',tryCatch(estudianteController.updateEstadoCuenta));
//información medica
router.get('/getInfoMedicByEx/:externalId',tryCatch(estudianteController.getInfoMedicByEx));
router.post('/update_infoMec',tryCatch(estudianteController.updateinfoMedica));
//información profesional
router.get('/getInfoProByEx/:externalId',(estudianteController.getInfoProByEx));
router.post('/update_infoPPro',tryCatch(estudianteController.updatePerfilProfe));
//información titulo profesional
router.get('/getTituloProByEx/:externalId',tryCatch(estudianteController.getTituloProByEx));
router.post('/update_infoTPro',tryCatch(estudianteController.updateTitutuloPro));

*/


module.exports = router;

//router.post('/regis_infoMec',tryCatch(estudianteController.infoMedica));
