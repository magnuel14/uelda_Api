'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");


const AnioLectivo = models.anioLectivo;


let controller = {
    /** Implementado try cath*/
    /**getAllAniosLectivos: Funcion get para obtener la lista de de años lesctivos
       * @param {*} req 
       * @param {*} res 
       * @returns Una lista en formato json de los anios lectivos registrados
       */
    getAllAniosLectivos: async (req, res) => {
        const aniosLectivos = await AnioLectivo.findAll();
        res.json(aniosLectivos);
    },
    /**createAnioLectivo: Funcion get para obtener la lista de de años lesctivos
       * @param {*} req 
       * @param {*} res 
       * @returns Una lista en formato json de los anios lectivos registrados
       */
    createAnioLectivo: async (req, res) => {
        const { jornada, periodo, fechaInicio, fechaFin, modalidad } = req.body;
        const anioLectivoData = {
            jornada: jornada, periodo: periodo,
            fechaInicio: fechaInicio, fechaFin: fechaFin,
            modalidad: modalidad, estadoAniolectivo: '0'
        }
        const newAnioLectivo = await AnioLectivo.create(anioLectivoData);

        
        res.json(newAnioLectivo);
    },
    /**Fin funciones validadas */
}

module.exports = controller;
