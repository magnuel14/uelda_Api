'use strict';
const models = require('../api/models');
let funcionesBd = {
    sincronizarBd: () => {
        try {
            // base de datos 
            models.sequelize.sync({ force: true }).then(() => {
                console.log('Base de Datos sincronizada');
            }).catch(err => {
                console.log(err, "No se sincronizada a la BD");
            });
        } catch (error) {
            console.error('Unable to connect to the server ', error);
        }
    },
    coneccionBd: () => {
        try {
            // base de datos 
            models.sequelize.authenticate().then(() => {
                console.log('Base de Datos conectada');
            }).catch(err => {
                console.log(err, "No se conecto a la BD");
            });
        } catch (error) {
            console.error('Unable to connect to the server ', error);
        }
    },
}
module.exports = funcionesBd;