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
const Curso = models.curso;
const Paralelo = models.paralelo;
const Materia = models.materia;
const Matricula = models.matricula;
const AsistenciaXDia = models.asistenciaXDia;
const AsistenciaXMate = models.asistenciaXMate;
const CalificacionQ = models.calificacionQ;
const CalificacionT = models.calificacionT;

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
    getParaleloTutor_docente: async (req, res) => {
        const { externalId } = req.body;
        const infoAniosLectivo = await AnioLectivo.findOne({ where: { estadoAniolectivo: '0' } });
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        if (infoPersona) {
            const info_cargaHoraria = await CargaHoraria.findOne({
                where: {
                    id_persona: infoPersona.id,
                    id_anioLectivo_actual: infoAniosLectivo.id
                },
                include: [
                    {
                        model: CargaHoraria_Materias,
                        as: 'cargaHoraria_Materias'
                    },
                    {
                        model: CargaHoraria_Paralelos,
                        as: 'cargaHoraria_Paralelos'
                    }
                ]
            });

            if (info_cargaHoraria) {
                const lista_paralelo = [];
                const lista_materia = [];

                const info_paralelo_tutor = await Paralelo.findOne({ where: { id: info_cargaHoraria.id_paralelo_tutor } });

                for (let i = 0; i < info_cargaHoraria.cargaHoraria_Paralelos.length; i++) {
                    const id_paralelo = info_cargaHoraria.cargaHoraria_Paralelos[i].id_paralelo;
                    const info_paralelo_docente = await Paralelo.findOne({ where: { id: id_paralelo } });
                    lista_paralelo.push(info_paralelo_docente);
                }

                for (let j = 0; j < info_cargaHoraria.cargaHoraria_Materias.length; j++) {
                    const id_materia = info_cargaHoraria.cargaHoraria_Materias[j].id_materia;
                    const info_materia_docente = await Materia.findOne({ where: { id: id_materia } });
                    lista_materia.push(info_materia_docente);
                }

                return res.json({ info_paralelo_tutor, lista_paralelo, lista_materia });
            } else {
                return res.json({ message: 'Ocurrió un error 2' });
            }
        } else {
            return res.json({ message: 'Ocurrió un error 1' });
        }
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    getAllmatriculas_byIdParalelo: async (req, res) => {
        const { id_paralelo } = req.params;

        const all_matriculas = await Matricula.findAll({
            where: { id_paralelo: id_paralelo },
            include: [
              { model: AsistenciaXDia, order: [['id', 'ASC']] },
              { model: AsistenciaXMate, order: [['id', 'ASC']] },
              { model: CalificacionQ, order: [['id', 'ASC']] },
              { model: CalificacionT, order: [['id', 'ASC']] }
            ]
          });

        // Obtener los id_persona de las matrículas
        const id_personas = all_matriculas.map(matricula => matricula.id_persona);

        // Consultar los datos de las personas asociadas a las matrículas
        const personas = await Persona.findAll({ where: { id: id_personas } });

        // Agregar la información de la persona a cada matrícula
        const matriculas_con_personas = all_matriculas.map(matricula => {
            const persona = personas.find(p => p.id === matricula.id_persona);
            return {
                ...matricula.toJSON(),
                persona: persona.toJSON()
            };
        });

        // Devolver el resultado
        res.json({ all_matriculas: matriculas_con_personas });

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
