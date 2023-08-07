const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');
const flash = require('connect-flash');
const fs = require('fs-extra');
const path = require('path');
const borrarTemp = require('./helpers/borrarTemps');
const funcionesBD = require('./helpers/funcionesBD');
const cron = require('node-cron');
const app = express();

dotenv.config();

//enviroment variables
app.set('port', process.env.PORT || 4000);
//app.use(cors({origin:"http://localhost:4200/"}))
app.use(session({
    secret: 'Ueldaweb',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// Configurar cabeceras y CORS
app.use(cors());
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
// Programa la tarea cron para ejecutar la función de borrado a las 12 AM cada día
cron.schedule('0 0 * * *', () => {
    borrarTemp.borrar(tempFolderPath);
});

/**
 * antes de usar la funcion de sincronizar
 * se debe respaldar la data
 * usar force: true solo en caso de sincronizar cambios en una bd con tablas
 * sync({force: true})
 * models.sequelize.sync({force: true}).then(() => {
 */
//sincronizacion de los modelos de la bd
//funcionesBD.sincronizarBd();

//insertar rol para usuarios
//require('./api/controllers/dataRol/insert_rol');

// Middleware para verificar la conexión a la base de datos
funcionesBD.coneccionBd();

//middleware que evita que el server se detenga en caso de detectar un error
app.use(errorHandler);

//routes
app.use('/uelda/user', require('./api/routes/userRoutes'));
app.use('/uelda/personal', require('./api/routes/personalRoutes'));
app.use('/uelda/estudiantes', require('./api/routes/estudianteRoutes'));
app.use('/uelda/gestion_academica', require('./api/routes/gestionAcademicaRoutes'));
app.use('/uelda/inspector', require('./api/routes/inspectorRoutes'));
app.use('/uelda/docente', require('./api/routes/docenteRoutes'));
app.use('/uelda/post_academico', require('./api/routes/postAcademicoRoutes'));
app.use('/uelda/lista_visibilidad', require('./api/routes/listaVisibilidadRoutes'));

module.exports = app;