'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const { Op } = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();

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
        const personal = await Persona.findAll({
            include: [
                {
                    model: Cuenta,
                    where: {
                        estado: 0
                    }
                },
                AsistenciaDocente
            ],
            where: {
                id_rol: {
                    [Op.or]: [1, 2, 3, 4, 5]
                }
            }
        });
        return res.json(personal);
    },
    /**
     * @param {*} res 
     * @returns 
     */
    createAsistencia_Docentes: async (req, res) => {
        const { fechaRegistro, list_personal, asistencia } = req.body;
        for (let i = 0; i < list_personal.length; i++) {
            const { externalId, observacion } = list_personal[i];
            const infoPersona = await Persona.findOne({ where: { external_id: externalId } })
            if (infoPersona) {
                const dataAsistecia = {
                    id_persona: infoPersona.id,
                    asistencia: asistencia,
                    fechaRegistro: fechaRegistro,
                    observacion: observacion,
                }
                await AsistenciaDocente.create(dataAsistecia)
            }
        }
        return res.json({ message: 'Se ha registrado la asistencia' });
    },
    /**
     * @param {*} res 
     * @returns 
     */
    //luego de crear asistencias desactivar el boton 24 horas
    //o por fecha 
    updateAsistencia_Docente: async (req, res) => {
        const { externalId, observacion } = req.body;
        const infoAsistencia = await AsistenciaDocente.findOne({ where: { external_id: externalId } });
        const infoPersona = await Persona.findOne({ where: { id: infoAsistencia.id_persona } });
        if (infoAsistencia) {
            const dataAsistecia = {
                observacion: observacion
            }
            await AsistenciaDocente.update(dataAsistecia, { where: { external_id: externalId } })
            return res.json({ message: `Se ha registrado la asistencia del docente ${infoPersona.nombre} ${infoPersona.apellido}` });
        } else {
            return res.json({ message: 'Se ha registrado la asistencia' });
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
     /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
     createAsignacionDocente_xsubnivel: async (req, res) => {
        const { list_personal, subnivel_asignado } = req.body;
        for (let i = 0; i < list_personal.length; i++) {
            const { externalId } = list_personal[i];
            const dataAsignacion_subnivel = { subnivel_asignado: subnivel_asignado }
            await Persona.update(dataAsignacion_subnivel, { where: { external_id: externalId } })
        }
        if (subnivel_asignado == 0) {
            return res.json({ message: 'Se ha asiganado al/o docente/s al subnivel de inicial' })
        }
        if (subnivel_asignado == 1) {
            return res.json({ message: 'Se ha asiganado al/o docente/s al subnivel de básica preparatoria' })
        }
        if (subnivel_asignado == 2) {
            return res.json({ message: 'Se ha asiganado al/o docente/s al subnivel de básica elemental' })
        }
        if (subnivel_asignado == 3) {
            return res.json({ message: 'Se ha asiganado al/o docente/s al subnivel de básica media' })
        }
        if (subnivel_asignado == 4) {
            return res.json({ message: 'Se ha asiganado al/o docente/s al subnivel de básica superior' })
        }
        if (subnivel_asignado == 5) {
            return res.json({ message: 'Se ha asiganado al/o docente/s al subnivel de bachillerato' })
        }
    },
    /**Fin funciones validadas */
    verifyToken: async (req, res, next) => {
        try {
            if (!req.headers.authorization) {
                return res.status(401).send('Unauhtorized Request');
            }
            let token = req.headers.authorization.split(' ')[1];
            if (token === 'null') {
                return res.status(401).send('Unauhtorized Request');
            }

            const payload = await jwt.verify(token, process.env.Secret_key);
            if (!payload) {
                return res.status(401).send('Unauhtorized Request');
            }
            req.userId = payload._id;
            next();
        } catch (e) {
            //console.log(e)
            return res.status(401).send('Unauhtorized Request');
        }
    }
}

module.exports = controller;
