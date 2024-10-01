'use strict';
const models = require('../api/models');

let funcionesBd = {
    // Sincronizar la base de datos
    sincronizarBd: async () => {
        try {
            await models.sequelize.sync({ force: true });
            console.log('Base de Datos sincronizada');
        } catch (error) {
            console.error('Error al sincronizar la BD:', error);
        }
    },

    // Conectar a la base de datos
    coneccionBd: async () => {
        try {
            await models.sequelize.authenticate();
            const dbName = models.sequelize.getDatabaseName(); // Obtener el nombre de la base de datos
            console.log('Base de Datos conectada:', dbName);
        } catch (error) {
            console.error('Error de conexión a la BD:', error);
        }
    }
}

module.exports = funcionesBd;
