const fs = require('fs');
const mysqlConnection = require('../api/connection/connection');

const logger = {};


logger.loginCRegistrer = async (email, ip_address) => {
  let dateTime = dateFormatGenerator();
  let idUser = await getIdCustomer(email)
  text = "\nEl usuario de correo ( " + email + " ) ingresó al sistema en la fecha " + dateTime[0] + " a las " + dateTime[1] + " ip:" + ip_address + " \n";
  textDirectory = "logs/customers/day_";
  folderReview(textDirectory.concat(dateTime[0]), text, idUser);
}

logger.loginCRegistrerFail = (email, ip_address) => {
  var dateTime = dateFormatGenerator();
  text = "\nSe trató de ingresar sin exito al sistema con el correo ( " + email + " ) en la fecha " + dateTime[0] + " a las " + dateTime[1] + " ip:" + ip_address + " \n";
  textDirectory = "logs/customers/day_";
  fileGenerator(textDirectory.concat(dateTime[0], ".txt"), text);
}

logger.SingUpCRegister = (name, email, ip_address) => {
  var dateTime = dateFormatGenerator();
  text = "\n" + name + " ( " + email + " ) se ha registrado  en la fecha " + dateTime[0] + " a las " + dateTime[1] + " ip:" + ip_address + " \n";
  textDirectory = "logs/public/";
  fileGenerator(textDirectory.concat(dateTime[0], ".txt"), text);
}

logger.loginURegistrer = async (email, ip_address) => {
  let dateTime = dateFormatGenerator();
  let idUser = await getIdUser(email)
  text = "\nEl vendedor ( " + email + " ) ingresó al sistema en la fecha " + dateTime[0] + " a las " + dateTime[1] + " ip:" + ip_address + " \n";
  textDirectory = "logs/users/day_";
  folderReview(textDirectory.concat(dateTime[0]), text, idUser);
}

function dateFormatGenerator() {
  var today = new Date();
  var time = "";
  var date = today.toJSON().slice(0, 10);
  var nDate = date.slice(8, 10) + '/'
    + date.slice(5, 7) + '/'
    + date.slice(0, 4);

  var arr = [date, time.concat(today.getHours(), ":", today.getMinutes())];
  return arr;
}

function folderReview(textDirectory, text, idUser) {
  try {
    if (!fs.existsSync(textDirectory)) {
      fs.mkdirSync(textDirectory);
    }
  } catch (err) {
    console.error(err);
  }
  fileGenerator(textDirectory.concat("/user", idUser, ".txt"), text);
}

function fileGenerator(textDirectory, text) {
  fs.appendFile(textDirectory, text, (error) => {
    if (error) {
      throw error
    }
  });
}

async function getIdCustomer(ruc) {
  let result = await mysqlConnection.query(`SELECT name FROM customer where ruc = ?`, [ruc]);
  return result[0].id;
}

async function getIdUser(email) {
  let result = await mysqlConnection.query(`SELECT id FROM user where login = ?`, [email]);
  return result[0].id;
}


module.exports = logger;