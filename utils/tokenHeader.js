const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware para verificar el token
exports.verifyToken = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized Request');
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
      return res.status(401).send('Unauthorized Request');
    }

    const payload = jwt.verify(token, process.env.Secret_key);
    if (!payload) {
      return res.status(401).send('Unauthorized Request');
    }

    req.userId = payload._id;
    next();
  } catch (e) {
    return res.status(401).send('Unauthorized Request');
  }
};
