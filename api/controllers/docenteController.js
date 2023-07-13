'use strict';
const models = require('../models');
const { Op } = require("sequelize");

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
        const { externalId } = req.params;
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
                const info_paraleloTutor = [];
                const lista_paralelo = [];
                const lista_materia = [];

                const info_paralelo_tutor = await Paralelo.findOne({ where: { id: info_cargaHoraria.id_paralelo_tutor } });
                const info_curso_tutor = await Curso.findOne(
                    {
                        attributes: ['nivelAcademico', 'gradoAcademico'],
                        where: { id: info_paralelo_tutor.id }
                    }
                );
                const info_paralelo_tutor_curso = {
                    ...info_paralelo_tutor.dataValues,
                    nivelAcademico: info_curso_tutor.nivelAcademico,
                    gradoAcademico: info_curso_tutor.gradoAcademico
                };

                info_paraleloTutor.push(info_paralelo_tutor_curso);


                for (let i = 0; i < info_cargaHoraria.cargaHoraria_Paralelos.length; i++) {
                    const id_paralelo = info_cargaHoraria.cargaHoraria_Paralelos[i].id_paralelo;
                    const info_paralelo_docente = await Paralelo.findOne({ where: { id: id_paralelo } });
                    const info_curso = await Curso.findOne(
                        {
                            attributes: ['nivelAcademico', 'gradoAcademico'],
                            where: { id: info_paralelo_docente.id }
                        }
                    );
                    const info_paralelo_con_curso = {
                        ...info_paralelo_docente.dataValues,
                        nivelAcademico: info_curso.nivelAcademico,
                        gradoAcademico: info_curso.gradoAcademico
                    };

                    lista_paralelo.push(info_paralelo_con_curso);
                }

                for (let j = 0; j < info_cargaHoraria.cargaHoraria_Materias.length; j++) {
                    const id_materia = info_cargaHoraria.cargaHoraria_Materias[j].id_materia;
                    const info_materia_docente = await Materia.findOne({ where: { id: id_materia } });
                    lista_materia.push(info_materia_docente);
                }

                return res.json({ info_paraleloTutor, lista_paralelo, lista_materia });
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
    updateCalicaciones: async (req, res) => {
        const { lista_externalsMateria_calificacion } = req.body;
        const info_anioLectivo = await AnioLectivo.findOne({ where: { estadoAniolectivo: '0' } })
        for (let i = 0; i < lista_externalsMateria_calificacion.length; i++) {

            if (info_anioLectivo.tipoCalificacion == 0) {

                const { externalId,
                    firstParcialPQ,
                    secondParcialPQ,
                    testPQ,

                    firstParcialSQ,
                    secondParcialSQ,
                    testSQ,

                    supletorio,
                    remedial,
                    gracia
                } = lista_externalsMateria_calificacion[i];

                //primer quimestre
                var _subTotalPQ = (firstParcialPQ * 0.8 + secondParcialPQ * 0.8) / 2;
                _subTotalPQ = Number(_subTotalPQ.toFixed(2));
                var _testPQ = testPQ * 0.2;
                _testPQ = Number(_testPQ.toFixed(2));
                var _totalPQ = _subTotalPQ + _testPQ;

                //segundo quimestre
                var _subTota2PQ = (firstParcialSQ * 0.8 + secondParcialSQ * 0.8) / 2;
                _subTota2PQ = Number(_subTota2PQ.toFixed(2));
                var _testSQ = testSQ * 0.2;
                _testSQ = Number(_testSQ.toFixed(2));
                var _totalSQ = _subTota2PQ + _testSQ;

                var _notaFinal = (_totalPQ + _totalSQ) / 2;

                if (_notaFinal >= 7) {

                    const dataCalificacionQ = {
                        firstParcialPQ: firstParcialPQ,
                        secondParcialPQ: secondParcialPQ,
                        subTotalPQ: _subTotalPQ,
                        testPQ: _testPQ,
                        totalPQ: _totalPQ,

                        firstParcialSQ: firstParcialSQ,
                        secondParcialSQ: secondParcialSQ,
                        subTota2PQ: _subTota2PQ,
                        testSQ: _testSQ,
                        totalSQ: _totalSQ,

                        notaFinal: _notaFinal,

                        aprobado: 0
                    };

                    await CalificacionQ.update(dataCalificacionQ, { where: { external_id: externalId } })
                    console.log({ dataCalificacionQ })

                } else {

                    const dataCalificacionQ = {
                        firstParcialPQ: firstParcialPQ,
                        secondParcialPQ: secondParcialPQ,
                        subTotalPQ: _subTotalPQ,
                        testPQ: _testPQ,
                        totalPQ: _totalPQ,

                        firstParcialSQ: firstParcialSQ,
                        secondParcialSQ: secondParcialSQ,
                        subTota2PQ: _subTota2PQ,
                        testSQ: _testSQ,
                        totalSQ: _totalSQ,

                        notaFinal: _notaFinal,

                        aprobado: 1
                    };

                    await CalificacionQ.update(dataCalificacionQ, { where: { external_id: externalId } })
                    console.log({ dataCalificacionQ })

                }

            } else {

                const { externalId,
                    aportesPrimerTimestre,
                    proIntegradorFase_1,
                    evaluacion_estructurada_1,

                    aportesSegundoTimestre,
                    proIntegradorFase_2,
                    evaluacion_estructurada_2,

                    aportesTercerTimestre,
                    proIntegradorFase_3,
                    evaluacion_estructurada_3,

                    proyecto_Final,
                    evaluacion_nivel,
                    aprobado } = lista_externalsMateria_calificacion[i];

                const info_calificacionT = await CalificacionT.findOne(
                    {
                        attributes: ['id_materia'],
                        where: { external_id: externalId }
                    });

                const info_Materia = await Materia.findOne(
                    {
                        attributes: ['id_curso'],
                        where: { id: info_calificacionT.id_materia }
                    });

                const info_Curso = await Curso.findOne(
                    {
                        attributes: ['nivelAcademico', 'gradoAcademico'],
                        where: { id: info_Materia.id_curso }
                    });

                if (info_Curso.nivelAcademico == "Inicial 3 años"
                    || info_Curso.nivelAcademico == "Inicial 4 años"
                    || info_Curso.nivelAcademico == "Básica Preparatoria") {

                    const dataCalificacionT = {

                        evaluacion_estructurada_1: evaluacion_estructurada_1,

                        evaluacion_estructurada_2: evaluacion_estructurada_2,

                        evaluacion_estructurada_3: evaluacion_estructurada_3,

                        aprobado: aprobado
                    };

                    await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } })
                    console.log({ dataCalificacionT })

                } else if (info_Curso.nivelAcademico == "Básica Elemental") {

                    const dataCalificacionT = {
                        aportesPrimerTimestre: _aportesPrimerTimestre,
                        proIntegradorFase_1: _proIntegradorFase_1,
                        evaluacion_estructurada_1: _evaluacion_estructurada_1,

                        aportesSegundoTimestre: _aportesSegundoTimestre,
                        proIntegradorFase_2: _proIntegradorFase_2,
                        evaluacion_estructurada_2: _evaluacion_estructurada_2,

                        aportesTercerTimestre: _aportesTercerTimestre,
                        proIntegradorFase_3: _proIntegradorFase_3,
                        evaluacion_estructurada_3: _evaluacion_estructurada_3,

                        proyecto_Final: _proyecto_Final,

                        total_Final: total_Final,

                        aprobado: aprobado
                    };

                    await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } })
                    console.log({ totalPT, totalST, totalTT, _proyecto_Final, total_3t, total_Final })

                } else {

                    //primer tirmestre
                    var _aportesPrimerTimestre = aportesPrimerTimestre * 0.9;
                    _aportesPrimerTimestre = Number(_aportesPrimerTimestre.toFixed(2));
                    var _proIntegradorFase_1 = (proIntegradorFase_1 * 0.5) / 10;
                    _proIntegradorFase_1 = Number(_proIntegradorFase_1.toFixed(2));
                    var _evaluacion_estructurada_1 = (evaluacion_estructurada_1 * 0.5) / 10;
                    _evaluacion_estructurada_1 = Number(_evaluacion_estructurada_1.toFixed(2));
                    var totalPT = _aportesPrimerTimestre + _proIntegradorFase_1 + _evaluacion_estructurada_1;
                    totalPT = Number(totalPT.toFixed(2));

                    //segundo trimestre
                    var _aportesSegundoTimestre = aportesSegundoTimestre * 0.9;
                    _aportesSegundoTimestre = Number(_aportesSegundoTimestre.toFixed(2));
                    var _proIntegradorFase_2 = (proIntegradorFase_2 * 0.5) / 10;
                    _proIntegradorFase_2 = Number(_proIntegradorFase_2.toFixed(2));
                    var _evaluacion_estructurada_2 = (evaluacion_estructurada_2 * 0.5) / 10;
                    _evaluacion_estructurada_2 = Number(_evaluacion_estructurada_2.toFixed(2));
                    var totalST = _aportesSegundoTimestre + _proIntegradorFase_2 + _evaluacion_estructurada_2;
                    totalST = Number(totalST.toFixed(2));

                    //tercer trimestre
                    var _aportesTercerTimestre = aportesTercerTimestre * 0.9;
                    _aportesTercerTimestre = Number(_aportesTercerTimestre.toFixed(2));
                    var _proIntegradorFase_3 = (proIntegradorFase_3 * 0.5) / 10;
                    _proIntegradorFase_3 = Number(_proIntegradorFase_3.toFixed(2));
                    var _evaluacion_estructurada_3 = (evaluacion_estructurada_3 * 0.5) / 10;
                    _evaluacion_estructurada_3 = Number(_evaluacion_estructurada_3.toFixed(2));
                    var totalTT = _aportesTercerTimestre + _proIntegradorFase_3 + _evaluacion_estructurada_3;
                    totalTT = Number(totalTT.toFixed(2));

                    if (info_Curso.nivelAcademico == 'Bachillerato' && info_Curso.gradoAcademico == 3 ||
                        info_Curso.gradoAcademico == 10 || info_Curso.gradoAcademico == 7) {

                        //proyecto final 0.5
                        var _proyecto_Final = (proyecto_Final * 0.5) / 10;
                        _proyecto_Final = Number(_proyecto_Final.toFixed(2));
                        //evaluacion x nivel 0.5
                        var _evaluacion_nivel = (evaluacion_nivel * 0.5) / 10;
                        _evaluacion_nivel = Number(_evaluacion_nivel.toFixed(2));

                        //calculo promedio total
                        //90% total de los 3 trimestres 
                        var total_3t = ((totalPT + totalST + totalTT) / 3) * 0.9;
                        total_3t = Number(total_3t.toFixed(2));

                        var total_Final = total_3t + _proyecto_Final + _evaluacion_nivel;
                        total_Final = Number(total_Final.toFixed(2));

                        if (total_Final >= 7) {

                            const dataCalificacionT = {
                                aportesPrimerTimestre: _aportesPrimerTimestre,
                                proIntegradorFase_1: _proIntegradorFase_1,
                                evaluacion_estructurada_1: _evaluacion_estructurada_1,
                                totalPT: totalPT,

                                aportesSegundoTimestre: _aportesSegundoTimestre,
                                proIntegradorFase_2: _proIntegradorFase_2,
                                evaluacion_estructurada_2: _evaluacion_estructurada_2,
                                totalST: totalST,

                                aportesTercerTimestre: _aportesTercerTimestre,
                                proIntegradorFase_3: _proIntegradorFase_3,
                                evaluacion_estructurada_3: _evaluacion_estructurada_3,
                                totalTT: totalTT,

                                proyecto_Final: _proyecto_Final,
                                evaluacion_nivel: _evaluacion_nivel,

                                total_Final: total_Final,

                                aprobado: 0
                            };

                            await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } })
                            console.log({ totalPT, totalST, totalTT, _proyecto_Final, total_3t, total_Final })

                        } else {

                            const dataCalificacionT = {
                                aportesPrimerTimestre: _aportesPrimerTimestre,
                                proIntegradorFase_1: _proIntegradorFase_1,
                                evaluacion_estructurada_1: _evaluacion_estructurada_1,
                                totalPT: totalPT,

                                aportesSegundoTimestre: _aportesSegundoTimestre,
                                proIntegradorFase_2: _proIntegradorFase_2,
                                evaluacion_estructurada_2: _evaluacion_estructurada_2,
                                totalST: totalST,

                                aportesTercerTimestre: _aportesTercerTimestre,
                                proIntegradorFase_3: _proIntegradorFase_3,
                                evaluacion_estructurada_3: _evaluacion_estructurada_3,
                                totalTT: totalTT,
                                total_Final: total_Final,
                                evaluacion_nivel: _evaluacion_nivel,

                                aprobado: 1
                            };

                            await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } })
                            console.log({ totalPT, totalST, totalTT, _proyecto_Final, total_3t, total_Final })

                        }
                    } else {

                        //proyecto final
                        var _proyecto_Final = proyecto_Final / 10
                        _proyecto_Final = Number(_proyecto_Final.toFixed(2));

                        //calculo promedio total
                        //90% total de los 3 trimestres 
                        var total_3t = ((totalPT + totalST + totalTT) / 3) * 0.9;
                        total_3t = Number(total_3t.toFixed(2));

                        var total_Final = total_3t + _proyecto_Final;
                        total_Final = Number(total_Final.toFixed(2));

                        if (total_Final >= 7) {

                            const dataCalificacionT = {
                                aportesPrimerTimestre: _aportesPrimerTimestre,
                                proIntegradorFase_1: _proIntegradorFase_1,
                                evaluacion_estructurada_1: _evaluacion_estructurada_1,
                                totalPT: totalPT,

                                aportesSegundoTimestre: _aportesSegundoTimestre,
                                proIntegradorFase_2: _proIntegradorFase_2,
                                evaluacion_estructurada_2: _evaluacion_estructurada_2,
                                totalST: totalST,

                                aportesTercerTimestre: _aportesTercerTimestre,
                                proIntegradorFase_3: _proIntegradorFase_3,
                                evaluacion_estructurada_3: _evaluacion_estructurada_3,
                                totalTT: totalTT,

                                proyecto_Final: _proyecto_Final,

                                total_Final: total_Final,

                                aprobado: 0
                            };

                            await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } })
                            console.log({ totalPT, totalST, totalTT, _proyecto_Final, total_3t, total_Final })

                        } else {

                            const dataCalificacionT = {
                                aportesPrimerTimestre: _aportesPrimerTimestre,
                                proIntegradorFase_1: _proIntegradorFase_1,
                                evaluacion_estructurada_1: _evaluacion_estructurada_1,
                                totalPT: totalPT,

                                aportesSegundoTimestre: _aportesSegundoTimestre,
                                proIntegradorFase_2: _proIntegradorFase_2,
                                evaluacion_estructurada_2: _evaluacion_estructurada_2,
                                totalST: totalST,

                                aportesTercerTimestre: _aportesTercerTimestre,
                                proIntegradorFase_3: _proIntegradorFase_3,
                                evaluacion_estructurada_3: _evaluacion_estructurada_3,
                                totalTT: totalTT,
                                total_Final: total_Final,

                                aprobado: 1
                            };

                            await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } })
                            console.log({ totalPT, totalST, totalTT, _proyecto_Final, total_3t, total_Final })

                        }

                    }

                }

            }
        }
        return res.json({ message: 'Se han actualizado las calificaciones exitosamente' });
    },
    /**
       * 
       * @param {*} req 
       * @param {*} res 
       * @returns 
       */
    updateAsistencias: async (req, res) => {
        const { lista_externalAsistencias } = req.body;
        const info_anioLectivo = await AnioLectivo.findOne({ where: { estadoAniolectivo: '0' } })

        for (let i = 0; i < lista_externalAsistencias.length; i++) {
            const {
                externalId, asistencia, periodosAcademicos_dictados
            } = lista_externalAsistencias[i];

            const info_AsistenciaXDia = await AsistenciaXDia.findOne(
                {
                    where: { external_id: externalId }
                });

            const info_AsistenciaXMate = await AsistenciaXMate.findOne(
                {
                    where: { external_id: externalId }
                });

            if (asistencia == 0) {
                if (info_AsistenciaXDia) {

                    const _horasClase_programadas = info_AsistenciaXDia.horasClase_programadas;
                    var _horasClase_dictadas = parseInt(info_AsistenciaXDia.horasClase_dictadas, 10) + periodosAcademicos_dictados;
                    var _horasClase_asistidas = parseInt(info_AsistenciaXDia.horasClase_asistidas, 10) + periodosAcademicos_dictados;

                    const data_Asistencia = {
                        horasClase_dictadas: _horasClase_dictadas,
                        horasClase_asistidas: _horasClase_asistidas
                    };

                    await AsistenciaXDia.update(data_Asistencia, { where: { id: info_AsistenciaXDia.id } })

                    console.log({ info_AsistenciaXDia, _horasClase_programadas, _horasClase_dictadas, _horasClase_asistidas })

                } else if (info_AsistenciaXMate) {
                    const _horasClase_programadas = info_AsistenciaXMate.horasClase_programadas;
                    var _horasClase_dictadas = parseInt(info_AsistenciaXMate.horasClase_dictadas, 10) + periodosAcademicos_dictados;
                    var _horasClase_asistidas = parseInt(info_AsistenciaXMate.horasClase_asistidas, 10) + periodosAcademicos_dictados;

                    const data_Asistencia = {
                        horasClase_dictadas: _horasClase_dictadas,
                        horasClase_asistidas: _horasClase_asistidas
                    };

                    await AsistenciaXMate.update(data_Asistencia, { where: { id: info_AsistenciaXMate.id } })

                    console.log({ info_AsistenciaXMate, _horasClase_programadas, _horasClase_dictadas, _horasClase_asistidas })
                }
            } else {

                if (info_AsistenciaXDia) {

                    const _horasClase_programadas = info_AsistenciaXDia.horasClase_programadas;
                    var _horasClase_dictadas = parseInt(info_AsistenciaXDia.horasClase_dictadas, 10) + periodosAcademicos_dictados;

                    const data_Asistencia = {
                        horasClase_dictadas: _horasClase_dictadas,
                    };

                    await AsistenciaXDia.update(data_Asistencia, { where: { id: info_AsistenciaXDia.id } })

                    console.log({ info_AsistenciaXDia, _horasClase_programadas, _horasClase_dictadas })

                } else if (info_AsistenciaXMate) {
                    const _horasClase_programadas = info_AsistenciaXMate.horasClase_programadas;
                    var _horasClase_dictadas = parseInt(info_AsistenciaXMate.horasClase_dictadas, 10) + periodosAcademicos_dictados;

                    const data_Asistencia = {
                        horasClase_dictadas: _horasClase_dictadas,
                    };

                    await AsistenciaXMate.update(data_Asistencia, { where: { id: info_AsistenciaXMate.id } })

                    console.log({ info_AsistenciaXMate, _horasClase_programadas, _horasClase_dictadas })

                }
            }

        }
        return res.json({ message: 'Se han actualizado las asistencias exitosamente' });

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

    /**Fin funciones validadas */
}

module.exports = controller;
