const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const models = require('./api/models');
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');
const flash = require('connect-flash');
const fs = require('fs-extra');
const path = require('path');
const borrarTemp = require('./helpers/borrarTemps');
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
// Configurar cabeceras y CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}));


const tempFolderPath = path.join(__dirname, './uploads');
const tiempoExpiracion = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

// Función para eliminar la carpeta temporal
setTimeout(() => {
    borrarTemp.borrar(tempFolderPath);
}, tiempoExpiracion);
/**
 * antes de usar la funcion de sincronizar
 * se debe respaldar la data
 * usar force: true solo en caso de sincronizar cambios en una bd con tablas
 * sync({force: true})
 * models.sequelize.sync({force: true}).then(() => {
 */
 /** 
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
*/
//rol de usuarios
//require('./api/controllers/dataRol/insert_rol');

//routes
app.use('/uelda/user', require('./api/routes/userRoutes'))
app.use('/uelda/personal', require('./api/routes/personalRoutes'))
app.use('/uelda/estudiantes', require('./api/routes/estudianteRoutes'))
app.use('/uelda/gestion_academica', require('./api/routes/gestonAcademicaRoutes'))



//middleware
app.use(errorHandler);

module.exports = app;