const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const controller = '../controllers/userController';
const userController = require(controller);

router.get('/get-allUsers', tryCatch(userController.getUsers));
router.post('/signin',tryCatch(userController.singnin));


module.exports = router;