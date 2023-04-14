const User = require('../models/persona');
const jwt= require('jsonwebtoken')

const UserContrl = {};

UserContrl.signup = async (req, res) => {
    const { email, password } = req.body;
    const newUser = new User({email, password});
    await newUser.save();
    //console.log(newUser);
    //res.send({ message: 'User create' });
    const token = jwt.sign({_id: newUser._id},'secretkey');
    res.json({token});
}
UserContrl.singnin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email:email, password: password});
    if (!user) return res.send('The email does not exists');
    if (user.password!==password) return res.send('Wrong Password'); 
    const token = jwt.sign({_id: user._id},'secretkey');
    res.json({token});
    
}


module.exports = UserContrl;