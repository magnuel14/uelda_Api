'use strict';

let getCurrentDate = {
     getCurrentDate : () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
module.exports = getCurrentDate;