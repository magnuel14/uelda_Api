const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/get-allUsers', tryCatch(userController.getUsers));
//inicar sesión
router.post('/signin', (userController.singnin));


module.exports = router;