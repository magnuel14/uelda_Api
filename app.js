const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const models = require('./api/models');
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

dotenv.config();

//enviroment variables
app.set('port', process.env.PORT || 4000);
//app.use(cors({origin:"http://localhost:4200/"}))
app.use(session({
    secret: 'Manuel',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}));
//sincronizacion dde los modelos de la bd
try {
    // basede dtatos 
    models.sequelize.sync().then(() => {
        console.log('Base de Datos conectada');
    }).catch(err => {
        console.log(err, "No se conecto a la BD");
    });
} catch (error) {
    console.error('Unable to connect to the server ', error);
}
//rol de usuarios
//require('./api/controllers/dataRol/insert_rol');

//routes
app.use('/uelda/user', require('./api/routes/userRoutes'))
app.use('/uelda/persona', require('./api/routes/personaRoutes'))

//middleware
app.use(errorHandler);

module.exports = app;