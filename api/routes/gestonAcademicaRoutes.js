const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const controller = '../controllers/gestionAcademicaController.js';
const gestionAcademicaController = require(controller);

router.get('/get-allAniosLectivos', tryCatch(gestionAcademicaController.getAllAniosLectivos));
router.post('/create_AnioLectivo', (gestionAcademicaController.createAnioLectivo));


module.exports = router;