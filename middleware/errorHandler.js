const models = require('../api/models');
const AuditUELDA = models.uditUELDA;


const errorHandler = async (error, req, res, next) => {
    //const mysqlConnection = require('../api/connection/connection');
    const mailing = require('../helpers/emailTemplates');
    await mailing.sendSystemErrorMail(error.stack);
    //console.log('ERROR STACK: ', error.stack);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    errorData = {
        error: error.stack.replaceAll("'", ""),
        date: today
    }
    console.log('ERROR: ', errorData);

    await AuditUELDA.create(errorData);
    //await mysqlConnection.query("INSERT INTO `audit-uelda`.log SET error=?, date = NOW()", error.stack.replaceAll("'",""));
    return res.status(400).send(error.message);
}

module.exports = errorHandler;