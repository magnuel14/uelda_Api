const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const personalController = require('../controllers/personalController');

//persona
router.get('/getPersonal',tryCatch(personalController.getPersonal));
router.get('/getPersonByEx/:externalId',tryCatch(personalController.getPersonByEx));
router.post('/update_infoPersona',tryCatch(personalController.updatePersona));
router.post('/registrar_persona',(personalController.createPerson));
router.post('/registrar_Listapersonal',(personalController.registrarPersonal));
//id_rol
router.post('/update_rolPersona',(personalController.updatePersonalRol));
//información medica
router.get('/getInfoMedicByEx/:externalId',tryCatch(personalController.getInfoMedicByEx));
router.post('/update_infoMec',tryCatch(personalController.updateinfoMedica));
//información profesional
router.get('/getInfoProByEx/:externalId',(personalController.getInfoProByEx));
router.post('/update_infoPPro',tryCatch(personalController.updatePerfilProfe));
//información titulo profesional
router.get('/getTituloProByEx/:externalId',tryCatch(personalController.getTituloProByEx));
router.post('/update_infoTPro',tryCatch(personalController.updateTitutuloPro));




module.exports = router;

//router.post('/regis_infoMec',tryCatch(userController.infoMedica));
