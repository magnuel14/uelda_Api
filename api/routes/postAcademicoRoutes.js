const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const postAcademicoController = require('../controllers/postAcademicoController');

//estudiante
//router.get('/getCargaHoraria_byList_externalID', (postAcademicoController.getCargaHoraria_byList_externalID));
//router.get('/getCargaHoraria_by_externalID', (postAcademicoController.getCargaHoraria_by_externalID));
//router.post('/update_CargaHoraria', (postAcademicoController.updateCargaHoraria));
router.post('/create_postAcademico', (postAcademicoController.createpostAcademico));


module.exports = router;

