const mysqlConnection = require('../api/connection/connection');
//const cron = require('node-cron');

const notifications = {};

notifications.LookForPendingNotifications=() => {
  //Buscar notificaciones pendientes en BD y setearlas para que se envien
  console.log("Funcion para enviar notificaciones pendientes");
}

notifications.PromisesNotification = () => {}

//Ingresar parametros necesarios en  notifications.GenerateNotiifcation = (param1, param2, ...)
notifications.GenerateNotiifcation = (type, data) => {
    /**
     * Para fechas especificas se sigue la siguiente formula
     * "0 0 14 2 *"
     *  a b c  d e
     * 
     *  Minutos: 0
        Horas: 0
        Días del mes: 14
        Meses: 2 (Febrero)
        Días de la semana: * (todos los días)
        como hay fecha especifica solo se realiza la accion una sola vez
     */
    let textSend = ''
    if(type == 1){ // 1= New Promise
      textSend= 'Se ha generado una nueva promesa de pago';
      console.log(textSend);
      console.log(data);
      console.log(wildcardGenerator(data));
      console.log("NOTIFICACION PROGRAMADA");
      /**
       * cron.schedule("41 16 15 2 *", function() {
        //Funcion para enviar notificaciones()
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        console.log("Se muestra la notificacion");
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      });
       */
    }
}


function wildcardGenerator(date) {
  let fecha = new Date(date);
  let minutes=  fecha.getMinutes()
  let hours= fecha.getHours()
  let day= fecha.getDate()
  let month= fecha.getMonth()+1
  let weekday= '*'
  let wildcard = minutes+" "+hours+" "+day+" "+month+" "+weekday
  return wildcard
}


async function getIdCustomer(ruc) {
  let result = await mysqlConnection.query(`SELECT name FROM customer where ruc = ?`, [ruc]);
  return result[0].id;
}





module.exports = notifications;