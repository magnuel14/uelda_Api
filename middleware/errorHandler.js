const errorHandler = async (error, req, res, next) => {
    const mailing = require('../helpers/emailTemplates');
    const mode = process.env.NODE_ENV;
    if (mode == 'development') {
        console.log(error.stack);
        return res.status(400).send(error.message);
    } else {
        console.log(error.stack);
        await mailing.sendSystemErrorMail(error.stack);
        return res.status(400).send(error.message);
    }
}

module.exports = errorHandler;