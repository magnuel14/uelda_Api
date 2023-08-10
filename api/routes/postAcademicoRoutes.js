const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const postAcademicoController = require('../controllers/postAcademicoController');

router.get('/get_AllpostAcademico', postAcademicoController.verifyToken, tryCatch(postAcademicoController.getAllpostAcademico));
router.get('/get_AllpostAcademicos/:externalId', postAcademicoController.verifyToken, tryCatch(postAcademicoController.getAllpostAcademicoByExternalId));
router.get('/get_AllpostAcademicos2/:externalId', postAcademicoController.verifyToken, tryCatch(postAcademicoController.getAllpostAcademicoByExternalId2));
router.post('/create_postAcademico', postAcademicoController.verifyToken, tryCatch(postAcademicoController.createpostAcademico));
router.post('/update_postAcademico', postAcademicoController.verifyToken, tryCatch(postAcademicoController.updatepostAcademico));
router.post('/update_Estado_postAcademico', postAcademicoController.verifyToken, tryCatch(postAcademicoController.update_Estado_postAcademico));
router.post('/delete_postAcademico', postAcademicoController.verifyToken, tryCatch(postAcademicoController.deletepostAcademico));

module.exports = router;

