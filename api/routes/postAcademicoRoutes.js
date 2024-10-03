const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const postAcademicoController = require('../controllers/postAcademicoController');

router.get('/get_AllpostAcademico',  tryCatch(postAcademicoController.getAllpostAcademico));
router.get('/get_AllpostAcademicos/:externalId',  tryCatch(postAcademicoController.getAllpostAcademicoByExternalId));
router.get('/get_AllpostAcademicos2/:externalId',  tryCatch(postAcademicoController.getAllpostAcademicoByExternalId2));
router.post('/create_postAcademico',  tryCatch(postAcademicoController.createpostAcademico));
router.post('/update_postAcademico',  tryCatch(postAcademicoController.updatepostAcademico));
router.post('/update_Estado_postAcademico',  tryCatch(postAcademicoController.update_Estado_postAcademico));
router.post('/delete_postAcademico',  tryCatch(postAcademicoController.deletepostAcademico));

module.exports = router;

