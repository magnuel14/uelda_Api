const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');

const router = express.Router();
const userController = require('../controllers/userController');

router.get('/get-allUsers', userController.verifyToken, tryCatch(userController.getUsers));
//inicar sesión
router.post('/signin', (userController.singnin));
//cuenta
router.post('/update_infoCuenta', userController.verifyToken, tryCatch(userController.updateCuenta));
router.post('/update_estadoC', userController.verifyToken, tryCatch(userController.updateEstadoCuenta));

module.exports = router;