const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/get-allUsers', tryCatch(userController.getUsers));
//inicar sesión
router.post('/signin', (userController.singnin));
//cuenta
router.post('/update_infoCuenta', tryCatch(userController.updateCuenta));
router.post('/update_estadoC', tryCatch(userController.updateEstadoCuenta));

module.exports = router;