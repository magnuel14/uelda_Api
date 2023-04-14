const mysqlConnection = require('../connection/connection');
const mailing = require('../../helpers/emailTemplates');
const axios = require('axios');
const { token } = require('morgan');
const { getCarProductsSearch } = require('./preOrder');

let controller = {
    /** Implementado try cath*/
    getCourier: async (req, res) => {
        let courierGuide = await mysqlConnection.query(`SELECT * FROM guides;`);
        res.json({ courierGuide })
    },
    postCourier: async (req, res) => {
        let { nombre, ruc, ciudad, direccion, postal, telefono, celular, correo, casa, refe, cantidad, peso, contenido, valorseguro, comentario } = req.body;
        console.log(nombre, ruc, ciudad, direccion, postal, telefono, celular, correo, casa, refe, cantidad, peso, contenido, valorseguro, comentario);
        let token = await getToken()
        let guide = await getGuide(token, req.body)
        let courierObj = {
            nameToSend: nombre,
            guia: guide,
            nombre: nombre,
            cedula: ruc,
            ciudad: ciudad,
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
        await mysqlConnection.query("INSERT INTO guides SET ?", [courierObj]);
        mailing.sendGuideInfo(guide, req.body);
        //console.log('a', guide)
        res.json("req");
    },
    getCustomers: async (req, res) => {
        let custumer = await mysqlConnection.query(`SELECT id,name , ruc, email FROM customer;`);
        res.json({ custumer })
    },
    getCourierGuidesById: async (req, res) => {
        let { id } = req.params;
        let courierGuideid = await mysqlConnection.query(`SELECT * FROM guides Where id=?;`, [id]);
        res.json({ courierGuideid })
    },
}
/**Fin funciones validadas */
async function getToken() {
    try {
        const { data } = await axios.post('https://api.laarcourier.com:9727/authenticate', {
            username: "pruebas.diego.mendoza.api",
            password: "m2g!g4@2022"
        });
        //console.log(data.token)
        return data.token
    } catch (error) {
        //console.error(error);
    }
}
async function getGuide(token, req) {
    let { nombre, ruc, ciudad, direccion, postal, telefono, celular, correo, casa, refe, cantidad, peso, contenido, valorseguro, comentario } = req;
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const { data } = await axios.post('https://api.laarcourier.com:9727/guias/contado',
            {
                origen: {
                    identificacionO: "1777777777",
                    ciudadO: "201001001001",
                    nombreO: "Cristian Cola",
                    direccion: "Loja",
                    referencia: "",
                    numeroCasa: "",
                    postal: "",
                    telefono: "3960000",
                    celular: "3960000",
                },
                destino: {
                    identificacionD: ruc,
                    ciudadD: ciudad,
                    nombreD: nombre,
                    direccion: direccion,
                    referencia: refe,
                    numeroCasa: casa,
                    postal: postal,
                    telefono: telefono,
                    celular: celular,
                    correo: correo
                },
                numeroGuia: "",
                tipoServicio: "201202002002013",
                noPiezas: cantidad,
                peso: peso,
                valorDeclarado: valorseguro,
                contiene: contenido,
                tamanio: "",
                cod: false,
                costoflete: 0,
                costoproducto: 0,
                tipocobro: 0,
                comentario: comentario,
                fechaPedido: ""
            }
            , config
        );
        //console.log(config)
        //console.log(data)
        return data.guia
    } catch (error) {
        //console.error(error);
    }
}
module.exports = controller;