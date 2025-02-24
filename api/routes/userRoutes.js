const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');

const router = express.Router();
const userController = require('../controllers/userController');

//router.get('/get-allUsers', userController.verifyToken, tryCatch(userController.getUsers));
router.get('/getAllUsers', tryCatch(userController.getUsers));
router.get('/getAllUserRole', tryCatch(userController.getAllUserRole));


//inicar sesión
router.post('/signin', (userController.signin));
//cuenta
router.post('/updateInfoAccount', tryCatch(userController.updateAccount));
router.post('/updateStateAccount', tryCatch(userController.updateAccountStatus));

//get user
router.get('/getUserByEx/:externalId', tryCatch(userController.getUserByExternalId));


module.exports = router;