const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const controller = '../controllers/personaController';
const userController = require(controller);

router.post('/registrar',userController.createPerson);


module.exports = router;