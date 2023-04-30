"use strict";

var errorHandler = function errorHandler(error, req, res, next) {
  var mysqlConnection, mailing;
  return regeneratorRuntime.async(function errorHandler$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //mysqlConnection = require('../api/connection/connection');
          mailing = require('../../helpers/emailTemplates');
          _context.next = 4;
          return regeneratorRuntime.awrap(mailing.sendSystemErrorMail(error.stack));

        case 4:
          _context.next = 6;
          return console.log(error);

        case 6:
          return _context.abrupt("return", res.status(400).send(error.message));

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = errorHandler;