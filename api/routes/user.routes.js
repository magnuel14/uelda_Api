const {Router} = require('express');
const userrouter = Router();
const userController = require('../controllers/user.controller');

userrouter.post('/singup',userController.singup);
userrouter.post('/signin',userController.signin);


module.exports = userrouter;