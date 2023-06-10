'use strict';
const fs = require('fs-extra');
let borrarTemp = {
    borrar: (temp) => {
        const tempFolderPath = temp;
        
        fs.remove(tempFolderPath)
            .then(() => {
                console.log('La carpeta temporal ha sido eliminada correctamente.');
            })
            .catch((err) => {
                console.error('Error al eliminar la carpeta temporal:', err);
            });
    }
}
module.exports = borrarTemp;