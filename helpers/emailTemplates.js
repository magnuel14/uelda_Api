//const mysqlConnection = require('../api/connection/connection');
const { transporter } = require('../helpers/email');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


const path = require('path');
const handlebars = require('handlebars');
let fs = require('fs');
const mailing = {};

//Helpers handlebars
handlebars.registerHelper('toFixed', function (number) {
  return number.toFixed(2);
})
handlebars.registerHelper('ifNone', function (text) {
  if (!text) {
    return "No definido"
  }
  return text
})
handlebars.registerHelper('urlDefault', function (text) {
  return text != null;
})
handlebars.registerHelper('codeNumber1', function (code) {
  return code == '1';
})
handlebars.registerHelper('codeNumber2', function (code) {
  return code == '2';
})
handlebars.registerHelper('codeNumber3', function (code) {
  return code == '3';
})
handlebars.registerHelper('codeNumber35', function (code) {
  return code == '3.5';
})
handlebars.registerHelper('codeNumber4', function (code) {
  return code == '4';
})

function file(path) {
  try {
    const data = fs.readFileSync(path, "utf8");
    return data;
  } catch (err) {
    return 0;
  }
}

async function sendMail(mailOptions) {
  try {
    await transporter.sendMail(mailOptions)
    console.log('mail sent')
    return 1;
  } catch (error) {
    console.log("error al enviar");
    return 0;
  }
}

mailing.sendNewUserEmail = async (data) => {
  const path = './public/email_templates/newUserEmail.html';
  let htmlF = fs.readFileSync(path).toString();
  if (!htmlF) {
    return 0
  } else {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    var nombreUsuario = data.nombre + " " + data.apellido;
    var correoUsuario = data.correoPersonal;
    var contraseñaUsuario = data.numeroId;

    let replacements = {
      nombreUsuario: nombreUsuario,
      correoUsuario: correoUsuario,
      contraseñaUsuario: contraseñaUsuario,
      date: yyyy
    }
    console.log(replacements)
    let template = handlebars.compile(htmlF)
    let htmlToSent = template(replacements)
    let mailOptions = {
      from: `"Usuario Nuevo - UELDAWEB" <ueldaweb2023@gmail.com>`,
      to: [correoUsuario],
      subject: 'Credenciales de acceso al sistema',
      text: 'Bienvenido',
      html: htmlToSent,
    };
    sendMail(mailOptions);
  }
}

mailing.sendNewPostEmail = async (data) => {
  const path = './public/email_templates/newPostEmail.html';
  let htmlF = fs.readFileSync(path).toString();
  if (!htmlF) {
    return 0
  } else {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    var nombreUsuario = data.nombre + " " + data.apellido;
    var correoUsuario = data.correoUsuario;
    var titulo = data.titulo;
    var tipoArchivo = data.tipoArchivo;
    var url_imagen = data.url_imagen;
    var nombreAutor = data.nombreAutor + " " + data.apellidoAutor;

    let replacements = {
      nombreUsuario: nombreUsuario,
      correoUsuario: correoUsuario,
      titulo: titulo,
      tipoArchivo: tipoArchivo,
      url_imagen: url_imagen,
      nombreAutor: nombreAutor,
      date: yyyy
    };

    let template = handlebars.compile(htmlF)
    let htmlToSent = template(replacements)
    let mailOptions = {
      from: `"Nuevo Post Académico - UELDAWEB" <ueldaweb2023@gmail.com>`,
      to: [correoUsuario],
      subject: 'Nuevas noticias en la sección de Post Académico',
      text: 'Informate',
      html: htmlToSent,
    };
    sendMail(mailOptions);
  }
}

mailing.sendSystemErrorMail = async (data) => {
  const path = './public/email_templates/newPostEmail.html';
  let htmlF = fs.readFileSync(path).toString();
  if (!htmlF) {
    return 0
  } else {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    let replacements = {
      error: data,
      fecha: today,
    }
    let template = handlebars.compile(htmlF)
    let htmlToSent = template(replacements)
    let mailOptions = {
      from: `"Error Handling - UELDAWEB" <ueldaweb2023@gmail.com>`,
      to: ['manuelvicente912@gmail.com'],
      subject: 'System Error UELDAWeb',
      text: 'Error UELDAWeb',
      html: htmlToSent,
    };
    sendMail(mailOptions);
  }
}
module.exports = mailing;