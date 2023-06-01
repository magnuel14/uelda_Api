//const mysqlConnection = require('../api/connection/connection');
//const { transporter } = require('../helpers/email');
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

mailing.sendOrderDetail = async (idOrder, code) => {
  const path = './public/email_templates/orderDetail.html';
  let html = file(path);
  if (!html) {
    return 0
  } else {
    let order = await mysqlConnection.query(`SELECT pedido.id as id,
                                                    pedido.subtotal as subtotal,
                                                    pedido.iva as iva,
                                                    pedido.total as total,
                                                    date_format(pedido.t_close, '%Y-%m-%d') as t_close,
                                                    pedido.idcustomer as idcustomer,
                                                    pedido.idsalesman as idsalesman,
                                                    pedido.iduser as iduser FROM pedido WHERE id = ?`, [idOrder]);
    if (order.length > 0) {
      order = order[0];
      let additionalInfo = await mysqlConnection.query(`SELECT name, ruc, email, idsalesman FROM customer 
                                                        WHERE id = ?`, [order.idcustomer]);
      additionalInfo = additionalInfo[0];
      let splitName = additionalInfo.name.split(' ');
      let orderName = '';
      for (let i = (splitName.length - 1); i >= 0; i--) {
        orderName += splitName[i] + ' ';
      }

      additionalInfo.name = orderName;
      let productsArray = await mysqlConnection.query(`select pedidodet.id AS id, CONCAT(UPPER(SUBSTRING(item.name,1,1)),LOWER(SUBSTRING(item.name,2))) AS name, item.partnumber,item.pvp1,item.stock, item.descripcion, item.porcdesc1 as pdesc,
                                                      pedidodet.iva as iva, pedidodet.descuento as descuento,
                                                      (select  CONCAT(UPPER(SUBSTRING(trim(name),1,1)),LOWER(SUBSTRING(trim(name),2))) from grupo where id=item.idgrupo) as grupo, idgrupo,
                                                      (select CONCAT(UPPER(SUBSTRING(trim(name),1,1)),LOWER(SUBSTRING(trim(name),2))) from brand where id=item.idbrand) as brand, idbrand,
                                                      (select  CONCAT(UPPER(SUBSTRING(trim(name),1,1)),LOWER(SUBSTRING(trim(name),2))) from linea where id=item.idlinea) as linea, idlinea,
                                                      (select  CONCAT(UPPER(SUBSTRING(trim(name),1,1)),LOWER(SUBSTRING(trim(name),2))) from sublinea where id=item.idsublinea) as sublinea, idsublinea,
                                                      (select group_concat(m.name) from itemmodelo as im
                                                      inner join modelo as m on im.idmodelo=m.id where im.iditem=item.id) as aplicacion,
                                                      (select group_concat(m.id) from itemmodelo as im
                                                      inner join modelo as m on im.idmodelo=m.id where im.iditem=item.id) as idmodelos,
                                                      (select  group_concat(ih.url) from item 
													                            inner join item_has_images as ih on item.id = ih.item_id
                                                      where item.id = pedidodet.iditem) as url_img,
                                                      concat('a',item.id,'.webp') as url_imgs,
                                                      round(pedidodet.precio,2) as price,
                                                      round(pedidodet.subtotal + pedidodet.iva,2) as subtotal,
                                                      pedidodet.cantidad as quantity
                                                      from item 
                                                      inner join 
                                                      pedidodet on item.id = pedidodet.iditem
                                                      inner join
                                                      pedido on pedidodet.idpedido = pedido.id
                                                      where
                                                          pedidodet.idPedido = ?;`, [idOrder]);

      let template = handlebars.compile(html);
      let subjectMail, headerMail, nameMail, mailToSend;
      const codeF = code;
      switch (code) {
        case 1: //Vendedor
          //console.log(additionalInfo.idsalesman);
          let salesmanData = await mysqlConnection.query(`SELECT name, emailuser FROM user WHERE idsalesman = ?`, [additionalInfo.idsalesman]);
          //console.log(salesmanData);
          if (salesmanData.length > 0) {
            for (let i = 0; i < salesmanData.length; i++) {
              if (salesmanData[i].emailuser != '') {
                subjectMail = 'Se ha generado una nueva orden #' + String(idOrder)
                headerMail = 'Ha generado  la orden # ' + String(idOrder) + ' para el usuario ' + String(additionalInfo.name) + 'con éxito.'
                var codeFlag = 1;
                //console.log(headerMail);
                nameMail = salesmanData[i].name
                //eddytorresmi@gmail.com , cris.ivancola@gmail.com
                //mailToSend = process.env.DEV_MODE ? 'manuelvicente912@gmail.com' + salesmanData[i].emailuser : 'manuelvicente912@gmail.com'
                const flag = salesmanData[i].emailuser;
                //console.log(flag);
                mailToSend = flag;
                // mailToSend = process.env.DEV_MODE ? 'true' + salesmanData[i].emailuser : 'manuelvicente912@gmail.com'
                mailOptionsGenerator(template, nameMail, headerMail, productsArray, order, additionalInfo, mailToSend, subjectMail, codeFlag)
              } else {
                //console.log('No existe un correo en el registro ' + salesmanData[i].name);
              }
            }
          }
          break;
        case 2: //Cliente
          subjectMail = 'Detalle de su orden #' + String(idOrder)
          var codeFlag = 2;
          headerMail = 'Su orden #' + String(idOrder) + ' se ha generado con éxito.'
          nameMail = additionalInfo.name;
          //eddytorresmi@gmail.com , cris.ivancola@gmail.com
          //mailToSend = process.env.DEV_MODE ? 'true' + additionalInfo.email : 'manuelvicente912@gmail.com'
          mailToSend = 'manuelvicente912@gmail.com'
          mailOptionsGenerator(template, nameMail, headerMail, productsArray, order, additionalInfo, mailToSend, subjectMail, codeFlag)
          break;
        case 3:  //Jefes de despacho
          let dispatchers = await mysqlConnection.query(`select name , emailuser from user inner join loguser where loguser.iduser = user.id && loguser.idlog = "1.87.3." && permiso = 1; `);
          for (var i = 0; i < dispatchers.length; i++) {
            if (dispatchers[i].emailuser != '') {
              headerMail = 'La orden #' + String(idOrder) + ' esta lista para ser despachada.'
              var codeFlag = 3;
              nameMail = dispatchers[i].name
              //rodnyledesma@gmail.com , eddytorresmi@gmail.com , cris.ivancola@gmail.com
              //mailToSend = process.env.DEV_MODE ? '' + dispatchers[i].emailuser : 'manuelvicente912@gmail.com';
              //mailToSend = 'manuelvicente912@gmail.com';
              const flag = dispatchers[i].emailuser;
              //console.log(flag);
              mailToSend = flag;
              mailOptionsGenerator(template, nameMail, headerMail, productsArray, order, additionalInfo, mailToSend, headerMail, codeFlag)
            } else {
              //console.log("-->>> No tiene Correo " + dispatchers[i].name)
            }
          }
          break;

        case 3.5:  //Despachador encargado, iduser es la variable que almacena el id del des
          let mailDespachador = await mysqlConnection.query(`SELECT name , emailuser FROM user where id = ?; `, [order.iduser]);
          if (mailDespachador[0].emailuser != '') {
            headerMail = 'La orden #' + String(idOrder) + ' esta lista para ser despachada.'
            nameMail = mailDespachador[0].name
            var codeFlag = 3.5;
            //rodnyledesma@gmail.com , eddytorresmi@gmail.com ,cris.ivancola@gmail.com
            //mailToSend = process.env.DEV_MODE ? '' + mailDespachador[0].emailuser : 'manuelvicente912@gmail.com';
            const flag = mailDespachador[0].emailuser;
            //console.log(flag);
            mailToSend = flag;
            //console.log("-->>> " + mailDespachador[0].emailuser)
            mailOptionsGenerator(template, nameMail, headerMail, productsArray, order, additionalInfo, mailToSend, headerMail, codeFlag)
          } else {
            //console.log("-->>> No tiene Correo " + mailDespachador[0].name)
          }
          break;
        case 4: //JefeCartera
          let jefesCartera = await mysqlConnection.query(`select name , emailuser from user inner join loguser where loguser.iduser = user.id && loguser.idlog = "1.87.2." && permiso = 1; `);
          //console.log(jefesCartera)
          for (var i = 0; i < jefesCartera.length; i++) {
            if (jefesCartera[i].emailuser != '') {
              headerMail = 'La orden  #' + String(idOrder) + ' esta lista para ser aprovada o rechazada.'
              var codeFlag = 4;
              nameMail = jefesCartera[i].name
              //mailToSend = process.env.DEV_MODE ? '' + jefesCartera[i].emailuser : 'rodnyledesma@gmail.com , eddytorresmi@gmail.com , cris.ivancola@gmail.com';
              const flag = jefesCartera[i].emailuser;
              //console.log(flag);
              mailToSend = flag;
              //console.log("-->>> " + jefesCartera[i].emailuser)
              mailOptionsGenerator(template, nameMail, headerMail, productsArray, order, additionalInfo, mailToSend, headerMail, codeFlag)
            } else {
              //console.log("-->>> No tiene Correo " + jefesCartera[i].name)
            }
          }
          break;
      }
    } else {
      //console.log('Order ' + String(idOrder) + ' cerrada.')
    }
  }
}

function file(path) {
  try {
    const data = fs.readFileSync(path, "utf8");
    return data;
  } catch (err) {
    return 0;
  }
}


async function mailOptionsGenerator(template, nameMail, headerMail, productsArray, order, additionalInfo, mailToSend, subjectMail, codeFlag) {
  let htmlCompiled = template({ nameToSend: nameMail, headerMail: headerMail, products: productsArray, order: order, codeFlag: codeFlag, timeStamp: new Date().toLocaleString("es-ES", 'America/Bogota'), additionalInfo: additionalInfo, logo: process.env.LOGO_EMAIL, miniLogo: process.env.MINI_LOGO_EMAIL });
  let mailOptions = {
    from: '"Menfri Tienda Virtual" <notifiaciones@tecsicom.com>', // sender address
    to: mailToSend,// list of receivers additionalInfo.email + ', cris.ivancola@gmail.com',
    subject: subjectMail, // Subject line
    text: 'Se ha generado', // plain text body
    html: htmlCompiled // html body
  };
  let answer = await sendMail(mailOptions);
}
mailing.sendGuideInfo = async (guide, req) => {
  const path = './public/email_templates/courierGuide.html';
  let htmlF = file(path);
  //console.log(htmlF)
  let template = handlebars.compile(htmlF);
  let { nombre, ruc, ciudad, direccion, postal, telefono, celular, correo, casa, refe, cantidad, peso, contenido, valorseguro, comentario } = req;
  let courierObj = {
    nameToSend: nombre,
    headerMail: 'Información de Guía',
    guia: guide,
    nombre: nombre,
    cedula: ruc,
    ciudad: "",
    direccion: direccion,
    refe: refe,
    telefono: telefono,
    celular: "0" + celular,
    contenido: contenido,
    peso: peso,
    cantidad: cantidad,
    comentario: comentario,
    correo: correo
  }
  let htmlCompiled = template(courierObj);
  let mailOptions = {
    from: '"Menfri Tienda Virtual" <notifiaciones@tecsicom.com>', // sender address
    to: correo, // list of receivers
    subject: 'Información de Guía', // Subject line
    text: 'Menfri', // plain text body {{name}} {{lastname}}
    html: htmlCompiled // html body
  };
  let answer = await sendMail(mailOptions);
}
mailing.sendMailOpenCase = async (message, email, name, phone) => {
  const path = './public/email_templates/contactRequest.html';
  let htmlF = file(path);
  if (!htmlF) {
    return 0
  } else {
    let mailOptions = {
      from: '"Menfri Tienda Virtual" <notifiaciones@tecsicom.com>', // sender address
      to: 'eddytorresmi@gmail.com , rodnyledesma@gmail.com', // list of receivers eddytorresmi@gmail.com
      subject: 'Nueva solicitud de contacto', // Subject line
      text: 'Menfri', // plain text body
      html: htmlF.replace('{{message_body}}', message).replace('{{email}}', email).replace('{{name}}', name).replace('{{phone}}', phone) // html body
    };
    let answer = await sendMail(mailOptions);
    return answer;
  }
}
mailing.sendMailValidation = async (rows, token) => {
  const path = './public/email_templates/verification.html';
  let htmlF = file(path);
  if (!htmlF) {
    return 0
  } else {
    let mailOptions = {
      from: '"Menfri Tienda Virtual" <notifiaciones@tecsicom.com>', // sender address
      to: rows[0].email, // list of receivers eddytorresmi@gmail.com
      subject: 'Activacion de cuenta', // Subject line
      text: 'Menfri', // plain text body {{name}} {{lastname}}
      html: htmlF.replace('{{name}}', rows[0].name).replace('{{token}}', token).replace('{{token}}', token).replace('{{token}}', token) // html body
    };
    let answer = await sendMail(mailOptions);
    return answer;
  }
}
mailing.sendMailPasswordReset = async (rows, token) => {
  const path = './public/email_templates/password-reset.html';
  let htmlF = file(path);
  if (!htmlF) {
    return 0
  } else {
    let mailOptions = {
      from: '"Menfri Tienda Virtual" <notifiaciones@tecsicom.com>', // sender address
      to: 'rodnyledesma@gmail.com', // list of receivers
      subject: 'Actualización de contraseña', // Subject line
      text: 'Menfri', // plain text body {{name}} {{lastname}}
      html: htmlF.replace('{{name}}', rows[0].name).replace('{{token}}', token).replace('{{token}}', token).replace('{{token}}', token) // html body
    };
    let answer = await sendMail(mailOptions);
    return answer;
  }
}

const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Configurar las credenciales de OAuth 2.0
const clientId = '580634221547-ug0tukk8e4otat5jo2qastfhqm944gbm.apps.googleusercontent.com';
const clientSecret = 'HVgYSRTVOx3kKc2bk2DSfh6V';
const refreshToken = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.send&response_type=code&client_id=580634221547-ug0tukk8e4otat5jo2qastfhqm944gbm.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fuelda%2F';

async function createTransporter() {
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2Client.setCredentials({ refresh_token: refreshToken });

  // Obtener un token de acceso válido
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'ueldaweb2023@gmail.com',
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      accessToken: accessToken,
    },
  });

  return transporter;
}

async function sendMail(mailOptions) {
  try {
    let result = await  createTransporter().sendMail(mailOptions)
    console.log('mail sent')
    return 1;
  } catch (error) {
    console.log("error al enviar");
    return 0;
  }
}

mailing.sendSystemErrorMail = async (data) => {
  const path = './public/email_templates/error_handling.html';
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
      from: `"Error Handling - UELDAWeb" <ueldaweb2023@gmail.com>`,
      to: ['manuelvicente912@gmail.com'],
      subject: 'System Error UELDAWeb', // Subject line
      text: 'Error UELDAWeb', // plain text body
      html: htmlToSent,
    };
    sendMail(mailOptions);
  }
}

module.exports = mailing;