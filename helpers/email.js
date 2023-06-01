const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Configurar las credenciales de OAuth 2.0
const clientId = '580634221547-ug0tukk8e4otat5jo2qastfhqm944gbm.apps.googleusercontent.com';
const clientSecret = 'HVgYSRTVOx3kKc2bk2DSfh6V';
const refreshToken = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.send&response_type=code&client_id=580634221547-ug0tukk8e4otat5jo2qastfhqm944gbm.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fuelda%2F';

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

// Obtener un token de acceso válido
const accessToken = await oAuth2Client.getAccessToken();

const sendMail = {};
sendMail.transporter = nodemailer.createTransport({
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
// send mail with defined transport object
module.exports = sendMail;