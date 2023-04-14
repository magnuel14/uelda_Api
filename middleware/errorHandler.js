const errorHandler = async (error, req, res, next) => {
    const mysqlConnection = require('../api/connection/connection');
    const mailing = require('../helpers/emailTemplates');
    //await mailing.sendSystemErrorMail(error.stack);
    //console.log('ERROR STACK: ', error.stack);
    await mysqlConnection.query("INSERT INTO `audit-menfri`.log SET error=?, date = NOW()", error.stack.replaceAll("'",""));
    return res.status(400).send(error.message);
}

module.exports = errorHandler;