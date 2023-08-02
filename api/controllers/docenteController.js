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
                const dataParalelo_asignada = {
                    id_paralelo: id_paralelo,
                    id_cargaHoraria: newCargaHoraria.id
                }
                await CargaHoraria_Paralelos.create(dataParalelo_asignada);
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
    updateCargaHoraria: async (req, res) => {
        const { externalId, id_paralelo_tutor, horas_asignadas, list_paralelo, list_materia } = req.body;
        const info_AnioLectivo = await AnioLectivo.findOne({ where: { estadoAniolectivo: 0 } });

        const info_cargaHoraria = await CargaHoraria.findOne({
            include: [
                { model: CargaHoraria_Paralelos, as: 'cargaHoraria_Paralelos' },
                { model: CargaHoraria_Materias, as: 'cargaHoraria_Materias' }
            ],
            where: {
                external_id: externalId,
                id_anioLectivo_actual: info_AnioLectivo.id
            }
        });

        const lista_paralelos = await info_cargaHoraria.getCargaHoraria_Paralelos();
        const lista_materia = await info_cargaHoraria.getCargaHoraria_Materias();


        for (let i = 0; i < lista_paralelos.length; i++) {
            const { id } = lista_paralelos[i];
            await CargaHoraria_Paralelos.destroy({
                where: { id: id }
            });

        }
        for (let i = 0; i < lista_materia.length; i++) {
            const { id } = lista_materia[i];
            await CargaHoraria_Materias.destroy({
                where: { id: id }
            });
        }

        const dataCargaHoraria = {
            id_paralelo_tutor: id_paralelo_tutor,
            horas_asignadas: horas_asignadas,
        };

        await CargaHoraria.update(dataCargaHoraria, { where: { id: info_cargaHoraria.id } });

        for (let i = 0; i < list_paralelo.length; i++) {
            const { id_paralelo } = list_paralelo[i];
            const dataParalelo_asignada = {
                id_paralelo: id_paralelo,
                id_cargaHoraria: info_cargaHoraria.id
            }
            await CargaHoraria_Paralelos.create(dataParalelo_asignada);
        }
        for (let i = 0; i < list_materia.length; i++) {
            const { id_materia } = list_materia[i];
            const dataMateria_asignada = {
                id_materia: id_materia,
                id_cargaHoraria: info_cargaHoraria.id
            }
            await CargaHoraria_Materias.create(dataMateria_asignada);
        }
        return res.json({ message: 'Se ha asignado la carga horaria', info_cargaHoraria });


    },
    /**
    * 
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    getCargaHoraria_by_externalID: async (req, res) => {

        const { externalId } = req.body;
        const cargaHoraria_docente = await Persona.findOne({
            attributes: [
                'id',
                'nombre',
                'apellido',
                'numeroId'
            ],
            include: [
                {
                    model: Cuenta,
                    attributes: ['id', 'correo'],
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

        return res.json({ cargaHoraria_docente })
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
            const { externalId } = req.body;
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
                        where: { id: info_paralelo_tutor.id_curso }
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
                            where: { id: info_paralelo_docente.id_curso }
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
                return res.json({ message: 'Ocurrió un error 1' });
            }
        } else {
            return res.json({ message: 'Ocurrió un error 2' });
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
        });
        let lista_personas_matricula = [];

        for (let i = 0; i < all_matriculas.length; i++) {
            const id_persona = all_matriculas[i].id_persona;
            const id = all_matriculas[i].id;


            let lista_calificaionesQ = [];
            let lista_calificaionesT = [];
            let lista_asistenciasXmateria = [];
            let info_Matricula = [];


            const info_estudiante = await Persona.findOne({
                attributes: ['id', 'nombre', 'apellido', 'numeroId'],
                where: { id: id_persona }
            });

            const info_matricula_actual = await Matricula.findOne({
                where: {
                    id: id
                }
            });
            const info_paralelo = await Paralelo.findOne({
                attributes: ['id', 'titulo', 'id_curso'],
                where: { id: info_matricula_actual.id_paralelo }
            });
            const info_curso = await Curso.findOne({
                attributes: ['id', 'nivelAcademico', 'gradoAcademico'],
                where: { id: info_paralelo.id_curso }
            });

            const info_matricula = {
                ...info_matricula_actual.dataValues,
                titulo_paralelo: info_paralelo.titulo,
                id_curso: info_curso.id,
                nivelAcademico: info_curso.nivelAcademico,
                gradoAcademico: info_curso.gradoAcademico,
            };
            info_Matricula.push(info_matricula)

            const info_AsistenciaXDia = await AsistenciaXDia.findOne({ where: { id_matricula: info_matricula_actual.id } })
            const info_AsistenciaXMate = await AsistenciaXMate.findAll({ where: { id_matricula: info_matricula_actual.id } })
            const info_calificacionT = await CalificacionT.findAll({ where: { id_matricula: info_matricula_actual.id } })
            const info_CalificacionQ = await CalificacionQ.findAll({ where: { id_matricula: info_matricula_actual.id } })



            for (let i = 0; i < info_AsistenciaXMate.length; i++) {
                const id = info_AsistenciaXMate[i].id;
                const id_materia = info_AsistenciaXMate[i].id_materia;

                const asistenciaXmateria = await AsistenciaXMate.findOne({ where: { id: id } });
                const info_materia = await Materia.findOne({
                    attributes: ['nombre', 'area'],
                    where: { id: id_materia }
                });
                const info_asistenciaXmateria = {
                    ...asistenciaXmateria.dataValues,
                    area: info_materia.area,
                    nombre: info_materia.nombre
                };
                lista_asistenciasXmateria.push(info_asistenciaXmateria);
            }
            for (let i = 0; i < info_calificacionT.length; i++) {
                const id = info_calificacionT[i].id;
                const id_materia = info_calificacionT[i].id_materia;

                const calificacionT = await CalificacionT.findOne({ where: { id: id } });
                const info_materia = await Materia.findOne({
                    attributes: ['nombre', 'area'],
                    where: { id: id_materia }
                });
                const info_CalificacionT = {
                    ...calificacionT.dataValues,
                    area: info_materia.area,
                    nombre: info_materia.nombre
                };
                lista_calificaionesT.push(info_CalificacionT);
            }
            for (let i = 0; i < info_CalificacionQ.length; i++) {
                const id = info_CalificacionQ[i].id;
                const id_materia = info_CalificacionQ[i].id_materia;

                const calificacionQ = await CalificacionQ.findOne({ where: { id: id } });
                const info_materia = await Materia.findOne({
                    attributes: ['nombre', 'area'],
                    where: { id: id_materia }
                });
                const info_calificacionQ = {
                    ...calificacionQ.dataValues,
                    area: info_materia.area,
                    nombre: info_materia.nombre
                };
                lista_calificaionesQ.push(info_calificacionQ);
            }


            lista_personas_matricula.push({
                info_estudiante,
                info_Matricula,
                lista_asistenciasXmateria,
                info_AsistenciaXDia,
                lista_calificaionesT,
                lista_calificaionesQ
            })
        }
        return res.json({ lista_personas_matricula });
    },
    /**
    * 
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    updateCalicaciones: async (req, res) => {
        //tipo de califiacion: cualitativa:0 || cuantitativamente: 1
        const { lista_externalsMateria_calificacion, tipo_asignacionNota } = req.body;
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

                    notaFinal,
                    aprobado,

                    supletorio,
                    remedial,
                    gracia
                } = lista_externalsMateria_calificacion[i];

                if (tipo_asignacionNota == 0) {

                    const dataCalificacionQ = {
                        firstParcialPQ: firstParcialPQ,
                        secondParcialPQ: secondParcialPQ,
                        testPQ: testPQ,

                        firstParcialSQ: firstParcialSQ,
                        secondParcialSQ: secondParcialSQ,
                        testSQ: testSQ,

                        notaFinal: notaFinal,

                        aprobado: aprobado
                    };

                    await CalificacionQ.update(dataCalificacionQ, { where: { external_id: externalId } });
                    console.log({ dataCalificacionQ });

                } else {

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

                        if (supletorio >= 7 || remedial >= 7 || gracia >= 7) {

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

                    }
                }

            } else {

                const {
                    externalId,
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
                    aprobado,
                    supletorio
                } = lista_externalsMateria_calificacion[i];

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
                        aportesPrimerTimestre: aportesPrimerTimestre,
                        proIntegradorFase_1: proIntegradorFase_1,
                        evaluacion_estructurada_1: evaluacion_estructurada_1,

                        aportesSegundoTimestre: aportesSegundoTimestre,
                        proIntegradorFase_2: proIntegradorFase_2,
                        evaluacion_estructurada_2: evaluacion_estructurada_2,

                        aportesTercerTimestre: aportesTercerTimestre,
                        proIntegradorFase_3: proIntegradorFase_3,
                        evaluacion_estructurada_3: evaluacion_estructurada_3,

                        proyecto_Final: proyecto_Final,

                        aprobado: aprobado
                    };

                    await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } })
                    console.log({ totalPT, totalST, totalTT, _proyecto_Final, total_3t, total_Final })

                } else if (
                    info_Curso.nivelAcademico == "Básica Media" ||
                    info_Curso.nivelAcademico == "Básica Superior" ||
                    info_Curso.nivelAcademico == "Bachillerato") {

                    if (tipo_asignacionNota == 0) {

                        if (info_Curso.nivelAcademico == 'Bachillerato' && info_Curso.gradoAcademico == 3 ||
                            info_Curso.gradoAcademico == 10 || info_Curso.gradoAcademico == 7) {

                            const dataCalificacionT = {
                                aportesPrimerTimestre: aportesPrimerTimestre,
                                proIntegradorFase_1: proIntegradorFase_1,
                                evaluacion_estructurada_1: evaluacion_estructurada_1,

                                aportesSegundoTimestre: aportesSegundoTimestre,
                                proIntegradorFase_2: proIntegradorFase_2,
                                evaluacion_estructurada_2: evaluacion_estructurada_2,

                                aportesTercerTimestre: aportesTercerTimestre,
                                proIntegradorFase_3: proIntegradorFase_3,
                                evaluacion_estructurada_3: evaluacion_estructurada_3,

                                proyecto_Final: proyecto_Final,
                                evaluacion_nivel: evaluacion_nivel,

                                aprobado: aprobado
                            };

                            await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } })
                            console.log({ dataCalificacionT })

                        } else {

                            const dataCalificacionT = {
                                aportesPrimerTimestre: aportesPrimerTimestre,
                                proIntegradorFase_1: proIntegradorFase_1,
                                evaluacion_estructurada_1: evaluacion_estructurada_1,

                                aportesSegundoTimestre: aportesSegundoTimestre,
                                proIntegradorFase_2: proIntegradorFase_2,
                                evaluacion_estructurada_2: evaluacion_estructurada_2,

                                aportesTercerTimestre: aportesTercerTimestre,
                                proIntegradorFase_3: proIntegradorFase_3,
                                evaluacion_estructurada_3: evaluacion_estructurada_3,

                                proyecto_Final: proyecto_Final,

                                aprobado: aprobado
                            };

                            await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } })
                            console.log({ dataCalificacionT })
                        }
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

                                if (supletorio >= 7) {
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

                                        aprobado: 0
                                    };

                                    await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } });
                                    console.log({ totalPT, totalST, totalTT, _proyecto_Final, total_3t, total_Final });
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

                                    await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } });
                                    console.log({ totalPT, totalST, totalTT, _proyecto_Final, total_3t, total_Final });
                                }

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
                                if (supletorio >= 7) {
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

                                        aprobado: 0
                                    };

                                    await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } });
                                    console.log({ totalPT, totalST, totalTT, _proyecto_Final, total_3t, total_Final });
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

                                    await CalificacionT.update(dataCalificacionT, { where: { external_id: externalId } });
                                    console.log({ totalPT, totalST, totalTT, _proyecto_Final, total_3t, total_Final });
                                }

                            }

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
        const { lista_externalAsistencias, periodosAcademicos_dictados } = req.body;
        const info_anioLectivo = await AnioLectivo.findOne({ where: { estadoAniolectivo: '0' } })

        for (let i = 0; i < lista_externalAsistencias.length; i++) {
            const {
                externalId, asistencia
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
                    const info_materia = await Materia.findOne({ where: { id: info_AsistenciaXMate.id_materia } });
                    const _horasClase_programadas = info_materia.horasClase_programadas;
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
                    const info_materia = await Materia.findOne({ where: { id: info_AsistenciaXMate.id_materia } });                    
                    const _horasClase_programadas = info_materia.horasClase_programadas;
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
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    comprobarPromocionEstudiante_byParalelo: async (req, res) => {
        const { id_paralelo } = req.body;
        const matriculas_byParalelo = await Matricula.findAll(
            {
                where: { id_paralelo: id_paralelo }
            });
        const info_anioLectivo = await AnioLectivo.findOne({ where: { estadoAniolectivo: '0' } });

        for (let i = 0; i < matriculas_byParalelo.length; i++) {
            const id_persona = matriculas_byParalelo[i].id_persona;

            const info_matricula_actual = await Matricula.findOne({
                where: {
                    id_persona: id_persona,
                    id_anioLectivo_actual: info_anioLectivo.id
                }
            });

            var contador_materias = 0;
            var contador_AsistenciaxMateria = 0;
            var boolAsistenciaxDia = false;

            const info_AsistenciaXDia = await AsistenciaXDia.findOne({ where: { id_matricula: info_matricula_actual.id } })
            const info_AsistenciaXMate = await AsistenciaXMate.findAll({ where: { id_matricula: info_matricula_actual.id } })
            const info_calificacionT = await CalificacionT.findAll({ where: { id_matricula: info_matricula_actual.id } })
            const info_CalificacionQ = await CalificacionQ.findAll({ where: { id_matricula: info_matricula_actual.id } })

            if (info_AsistenciaXDia) {
                const horasClase_programadas = info_AsistenciaXDia.horasClase_programadas;
                const horasClase_programadasEntero = parseInt(horasClase_programadas, 10);
                const horasClase_programadas90porciento = Math.floor(horasClase_programadasEntero * 0.9);

                const horasClase_asistidas = info_AsistenciaXDia.horasClase_asistidas;
                const horasClase_asistidasEntero = parseInt(horasClase_asistidas, 10);
                if (horasClase_asistidasEntero >= horasClase_programadas90porciento) {
                    boolAsistenciaxDia = true;
                }

                for (let i = 0; i < info_AsistenciaXMate.length; i++) {
                    const id_materia = info_AsistenciaXMate[i].id_materia;
                    const materia = await Materia.findOne({ where: { id: id_materia } });
                    const horasClase_programadas = materia.horasClase_programadas;
                    const horasClase_programadasEntero = parseInt(horasClase_programadas, 10);
                    const horasClase_programadas90porciento = Math.floor(horasClase_programadasEntero * 0.9);

                    const horasClase_asistidas = info_AsistenciaXMate[i].horasClase_asistidas;
                    const horasClase_asistidasEntero = parseInt(horasClase_asistidas, 10);
                    if (horasClase_asistidasEntero < horasClase_programadas90porciento) {
                        contador_AsistenciaxMateria += 1;
                    }
                }

                if (info_anioLectivo.tipoCalificacion === 0) {
                    for (let i = 0; i < info_CalificacionQ.length; i++) {
                        const aprobado = info_CalificacionQ[i].aprobado;
                        if (aprobado === 1) {
                            contador_materias += 1;
                        }
                    }
                } else {
                    for (let i = 0; i < info_calificacionT.length; i++) {
                        const aprobado = info_calificacionT[i].aprobado;
                        if (aprobado === 1) {
                            contador_materias += 1;
                        }
                    }
                }

                if (contador_materias === 0 &&
                    contador_AsistenciaxMateria === 0 &&
                    boolAsistenciaxDia === true
                ) {
                    const data_promocion = {
                        estadoAc: 1
                    };
                    await Persona.update(data_promocion, { where: { id: id_persona } });
                } else {
                    const data_promocion = {
                        estadoAc: 2
                    };
                    await Persona.update(data_promocion, { where: { id: id_persona } });
                }

            } else {
                for (let i = 0; i < info_AsistenciaXMate.length; i++) {
                    const id_materia = info_AsistenciaXMate[i].id_materia;
                    const materia = await Materia.findOne({ where: { id: id_materia } });
                    const horasClase_programadas = materia.horasClase_programadas;
                    const horasClase_programadasEntero = parseInt(horasClase_programadas, 10);
                    const horasClase_programadas90porciento = Math.floor(horasClase_programadasEntero * 0.9);

                    const horasClase_asistidas = info_AsistenciaXMate[i].horasClase_asistidas;
                    const horasClase_asistidasEntero = parseInt(horasClase_asistidas, 10);
                    if (horasClase_asistidasEntero < horasClase_programadas90porciento) {
                        contador_AsistenciaxMateria += 1;
                    }
                }

                if (info_anioLectivo.tipoCalificacion === 0) {
                    for (let i = 0; i < info_CalificacionQ.length; i++) {
                        const aprobado = info_CalificacionQ[i].aprobado;
                        if (aprobado === 1) {
                            contador_materias += 1;
                        }
                    }
                } else {
                    for (let i = 0; i < info_calificacionT.length; i++) {
                        const aprobado = info_calificacionT[i].aprobado;
                        if (aprobado === 1) {
                            contador_materias += 1;
                        }
                    }
                }

                if (contador_materias === 0 &&
                    contador_AsistenciaxMateria === 0
                ) {
                    const data_promocion = {
                        estadoAc: 1
                    };
                    await Persona.update(data_promocion, { where: { id: id_persona } });
                } else {
                    const data_promocion = {
                        estadoAc: 2
                    };
                    await Persona.update(data_promocion, { where: { id: id_persona } });
                }
            }

        }
        return res.json({ message: 'Se han promovido a los estudiantes que cumplen con los requisitos' });

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
    /**Fin funciones validadas */
}

module.exports = controller;
