const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const postAcademicoController = require('../controllers/postAcademicoController');

router.get('/get_AllpostAcademico', (postAcademicoController.getAllpostAcademico));
router.get('/get_AllpostAcademicos/:externalId', tryCatch(postAcademicoController.getAllpostAcademico));
router.post('/create_postAcademico', tryCatch(postAcademicoController.createpostAcademico));
router.post('/update_postAcademico', tryCatch(postAcademicoController.updatepostAcademico));
router.post('/update_Estado_postAcademico', tryCatch(postAcademicoController.update_Estado_postAcademico));
router.post('/delete_postAcademico', tryCatch(postAcademicoController.deletepostAcademico));

module.exports = router;

