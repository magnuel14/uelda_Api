'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");

const cedulaValidator = require('../../helpers/cedulaHelper');

const Persona = models.persona;
const Cuenta = models.cuenta;
const AsistenciaDocente = models.asistenciaDocente;

let controller = {
    /** Implementado try cath*/
    /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
    getPersonal_asistencia: async (req, res) => {
        const personal = await Persona.findAll(
            {
                include: [
                    Cuenta,
                    AsistenciaDocente
                ],
                where: {
                    [Op.or]: [
                        { id_rol: 1 },
                        { id_rol: 2 },
                        { id_rol: 3 },
                        { id_rol: 4 },
                        { id_rol: 5 }
                    ]
                }
            });
        res.json(personal);
    },

    /**updateRol_auxilar: Funcion para actulizar el rol auxiliar al personal
     * @param {*} res 
     * @returns Una lista en formato json de los estuidantes registrados
     */
    createAsistencia_Docente: async (req, res) => {
        const { externalId, asistencia, hora_llegada, observacion } = req.body;
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } })
        if (infoPersona) {
            const dataAsistecia = {
                id_persona: infoPersona.id,
                asistencia: asistencia,
                fechaRegistro: hora_llegada,
                observacion: observacion
            }
            const newAsistenciaDocente = await AsistenciaDocente.create(dataAsistecia)
            return res.json({ message: 'Se ha registrado la asistencia', newAsistenciaDocente });
        } else {
            return res.json({ message: 'La persona no existe' });
        }
    },
    createAsistencia_Docentes: async (req, res) => {
        const { externalId, asistencia, hora_llegada, observacion } = req.body;
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } })
        if (infoPersona) {
            const dataAsistecia = {
                id_persona: infoPersona.id,
                asistencia: asistencia,
                fechaRegistro: hora_llegada,
                observacion: observacion
            }
            const newAsistenciaDocente = await AsistenciaDocente.create(dataAsistecia)
            return res.json({ message: 'Se ha registrado la asistencia', newAsistenciaDocente });
        } else {
            return res.json({ message: 'La persona no existe' });
        }
    },
    /**updateRol_auxilar: Funcion para actulizar el rol auxiliar al personal
     * @param {*} res 
     * @returns Una lista en formato json de los estuidantes registrados
     */
    updateRol_auxilar: async (req, res) => {
        const { externalId_list, rolAuxiliar } = req.body;
        if (rolAuxiliar == 0) {
            for (let i = 0; i < externalId_list.length; i++) {
                const { externalId } = externalId_list[i];
                const data_update_flagAuxiliar = {
                    rolAuxiliar: rolAuxiliar
                }
                const infoPerson = await Persona.findOne({ where: { external_id: externalId } });
                if (infoPerson) {
                    await Persona.update(data_update_flagAuxiliar, { where: { id: infoPerson.id } });
                }
            }
            return res.json({ message: 'Se ha eliminado el rol auxiliar al o los docentes selecionados' });

        }
        if (rolAuxiliar == 1) {
            for (let i = 0; i < externalId_list.length; i++) {
                const { externalId } = externalId_list[i];
                const data_update_flagAuxiliar = {
                    rolAuxiliar: rolAuxiliar
                }
                const infoPerson = await Persona.findOne({ where: { external_id: externalId } });
                if (infoPerson) {
                    await Persona.update(data_update_flagAuxiliar, { where: { id: infoPerson.id } });
                }
            }
            return res.json({ message: 'Se han asigando el rol auxiliar de sub-inspector al o los docentes selecionados' });
        }
        else {
            return res.json({ message: 'Este rol auxiliar no existe' });
        }
    },

    /**Fin funciones validadas */
}

module.exports = controller;
