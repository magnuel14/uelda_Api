'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");

const cedulaValidator = require('../../helpers/cedulaHelper');
const persona = require('../models/persona');
const { json } = require('body-parser');

const Persona = models.persona;
const Cuenta = models.cuenta;
const CargaHoraria = models.cargaHoraria;
const CargaHoraria_Materias = models.cargaHoraria_Materias;
const CargaHoraria_Paralelos = models.cargaHoraria_Paralelos;
const AsistenciaDocente = models.asistenciaDocente;
const AnioLectivo = models.anioLectivo;

let controller = {
    /** Implementado try cath*/
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    createCargaHoraria: async (req, res) => {
        const { externalId, id_paralelo_tutor, horas_asignadas, list_paralelo, list_materia } = req.body;
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const info_AnioLectivo = await AnioLectivo.findOne({ where: { estadoAniolectivo: 0 } });

        const dataCargaHoraria = {
            id_paralelo_tutor: id_paralelo_tutor,
            horas_asignadas: horas_asignadas,
            id_persona: infoPersona.id,
            id_anioLectivo_actual: info_AnioLectivo.id
        };

        const newCargaHoraria = await CargaHoraria.create(dataCargaHoraria);
        if (newCargaHoraria) {
            for (let i = 0; i < list_paralelo.length; i++) {
                const { id_paralelo } = list_paralelo[i];
                const dataMateria_asignada = {
                    id_paralelo: id_paralelo,
                    id_cargaHoraria: newCargaHoraria.id
                }
                await CargaHoraria_Paralelos.create(dataMateria_asignada);
            }
            for (let i = 0; i < list_materia.length; i++) {
                const { id_materia } = list_materia[i];
                const dataMateria_asignada = {
                    id_materia: id_materia,
                    id_cargaHoraria: newCargaHoraria.id
                }
                await CargaHoraria_Materias.create(dataMateria_asignada);
            }
            return res.json({ message: 'Se ha asignado la carga horaria', newCargaHoraria });
        } else {
            return res.json({ message: 'Error al asignar la caraga horaria' });
        }
    },
    /**
    * 
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    getCargaHoraria_byList_externalID: async (req, res) => {
        const { list_personal } = req.body;
        let personal = []
        for (let i = 0; i < list_personal.length; i++) {
            const { externalId } = list_personal[i];
            const persona = await Persona.findOne({
                include: [
                    {
                        model: Cuenta,
                        where: {
                            estado: 0
                        }
                    },
                    {
                        model: CargaHoraria,
                        include: [
                            CargaHoraria_Materias,
                            CargaHoraria_Paralelos
                        ]
                    }
                ],
                where: {
                    external_id: externalId
                }
            });
            personal.push(persona)
        }
        return res.json({ personal })
    },
    /**
  * 
  * @param {*} req 
  * @param {*} res 
  * @returns 
  */
    getAllCargaHoraria: async (req, res) => {
        const personal = await Persona.findAll({
            include: [
                {
                    model: Cuenta,
                    where: {
                        estado: 0
                    }
                },
                {
                    model: CargaHoraria,
                    include: [
                        CargaHoraria_Materias,
                        CargaHoraria_Paralelos
                    ]
                }
            ],
            where: {
                id_rol: {
                    [Op.or]: [1, 2, 3, 5]
                }
            }
        });
        return res.json({ personal })
    },
    /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
    getCalicaciones: async (req, res) => {
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
     * @returns Una lista en formato json de los estuidantes registrados
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

    /**Fin funciones validadas */
}

module.exports = controller;
