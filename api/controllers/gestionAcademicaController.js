'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");

const Persona = models.persona;
const AnioLectivo = models.anioLectivo;
const Curso = models.curso;
const Paralelo = models.paralelo;
const Matricula = models.matricula;
const Materia = models.materia;
const AsistenciaXMate = models.asistenciaXMate;
const AsistenciaXDia = models.asistenciaXDia;
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
    getAllCursos_Materias: async (req, res) => {
        const { id_anioLectivo } = req.params;
        const curso = await Curso.findAll({
            include: [Paralelo, Materia],
            where: { id_anioLectivo: id_anioLectivo }
        });
        //console.log(aniosLectivos)
        return res.json({ curso });
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    matricularEstudiantes: async (req, res) => {
        let {
            lista_externalid_estudiantes, id_paralelo,
            periodo_academicos_Programados_inicial,
            periodo_academicos_Programados_preparatoria,
            periodo_academicos_Programados_elemental,
            periodo_academicos_Programados_media,
        } = req.body

        for (let i = 0; i < lista_externalid_estudiantes.length; i++) {
            const { externalId } = lista_externalid_estudiantes[i];

            const infoParalelo = await Paralelo.findOne({
                where: { id: id_paralelo }
            });

            const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: infoParalelo.id_curso }
            });

            const infoEstudiante = await Persona.findOne({ where: { external_id: externalId } });

            if (infoEstudiante.estadoAc !== '0' || infoEstudiante.estadoAc === null) {
                const info_AnioLectivo = await AnioLectivo.findOne({ where: { estadoAniolectivo: 0 } });

                const data_newMatriculaEstudiante = {
                    id_paralelo: id_paralelo,
                    id_persona: infoEstudiante.id,
                    id_anioLectivo_actual: info_AnioLectivo.id
                }
                const dataEstadoAcademico = {
                    estadoAc: '0'
                }

                await Persona.update(dataEstadoAcademico, { where: { id: infoEstudiante.id } });

                const newMatricula_estudiante = await Matricula.create(data_newMatriculaEstudiante);

                if (newMatricula_estudiante) {

                    if (infoCurso.nivelAcademico == 'Inicial 3 años') {
                        const asistenciaXDia = {
                            horasClase_programadas: periodo_academicos_Programados_inicial,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_matricula: newMatricula_estudiante.id
                        }
                        await AsistenciaXDia.create(asistenciaXDia);
                    }
                    if (infoCurso.nivelAcademico == 'Inicial 4 años') {
                        const asistenciaXDia = {
                            horasClase_programadas: periodo_academicos_Programados_inicial,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_matricula: newMatricula_estudiante.id
                        }
                        await AsistenciaXDia.create(asistenciaXDia);
                    }
                    if (infoCurso.nivelAcademico == 'Básica Preparatoria') {
                        const asistenciaXDia = {
                            horasClase_programadas: periodo_academicos_Programados_preparatoria,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_matricula: newMatricula_estudiante.id
                        }
                        await AsistenciaXDia.create(asistenciaXDia);

                        const info_materia_ECA = await Materia.findOne(
                            {
                                where: {
                                    nombre: 'Educación Cultural y Artística',
                                    id_curso: infoCurso.id
                                }
                            }
                        );
                        const asistenciasXMateria_ECA = {
                            horasClase_programadas: info_materia_ECA.horasClase_programadas,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_materia: info_materia_ECA.id,
                            id_matricula: newMatricula_estudiante.id
                        };

                        await AsistenciaXMate.create(asistenciasXMateria_ECA);

                        const info_materia_EF = await Materia.findOne(
                            {
                                where: {
                                    nombre: 'Educación Física',
                                    id_curso: infoCurso.id
                                }
                            }
                        );
                        const asistenciasXMateria_EF = {
                            horasClase_programadas: info_materia_EF.horasClase_programadas,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_materia: info_materia_EF.id,
                            id_matricula: newMatricula_estudiante.id
                        };

                        await AsistenciaXMate.create(asistenciasXMateria_EF);

                    }
                    if (infoCurso.nivelAcademico == 'Básica Elemental') {
                        const asistenciaXDia = {
                            horasClase_programadas: periodo_academicos_Programados_elemental,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_matricula: newMatricula_estudiante.id
                        }
                        await AsistenciaXDia.create(asistenciaXDia);

                        const info_materia_ECA = await Materia.findOne(
                            {
                                where: {
                                    nombre: 'Educación Cultural y Artística',
                                    id_curso: infoCurso.id
                                }
                            }
                        );
                        const asistenciasXMateria_ECA = {
                            horasClase_programadas: info_materia_ECA.horasClase_programadas,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_materia: info_materia_ECA.id,
                            id_matricula: newMatricula_estudiante.id
                        };

                        await AsistenciaXMate.create(asistenciasXMateria_ECA);

                        const info_materia_EF = await Materia.findOne(
                            {
                                where: {
                                    nombre: 'Educación Física',
                                    id_curso: infoCurso.id
                                }
                            }
                        );
                        const asistenciasXMateria_EF = {
                            horasClase_programadas: info_materia_EF.horasClase_programadas,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_materia: info_materia_EF.id,
                            id_matricula: newMatricula_estudiante.id
                        };

                        await AsistenciaXMate.create(asistenciasXMateria_EF);

                        const info_materia_EN = await Materia.findOne(
                            {
                                where: {
                                    nombre: 'Inglés',
                                    id_curso: infoCurso.id
                                }
                            }
                        );
                        const asistenciasXMateria_EN = {
                            horasClase_programadas: info_materia_EN.horasClase_programadas,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_materia: info_materia_EN.id,
                            id_matricula: newMatricula_estudiante.id
                        };

                        await AsistenciaXMate.create(asistenciasXMateria_EN);
                    }
                    if (infoCurso.nivelAcademico == 'Básica Media') {
                        const asistenciaXDia = {
                            horasClase_programadas: periodo_academicos_Programados_media,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_matricula: newMatricula_estudiante.id
                        }
                        await AsistenciaXDia.create(asistenciaXDia);

                        const info_materia_ECA = await Materia.findOne(
                            {
                                where: {
                                    nombre: 'Educación Cultural y Artística',
                                    id_curso: infoCurso.id
                                }
                            }
                        );
                        const asistenciasXMateria_ECA = {
                            horasClase_programadas: info_materia_ECA.horasClase_programadas,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_materia: info_materia_ECA.id,
                            id_matricula: newMatricula_estudiante.id
                        };

                        await AsistenciaXMate.create(asistenciasXMateria_ECA);

                        const info_materia_EF = await Materia.findOne(
                            {
                                where: {
                                    nombre: 'Educación Física',
                                    id_curso: infoCurso.id
                                }
                            }
                        );
                        const asistenciasXMateria_EF = {
                            horasClase_programadas: info_materia_EF.horasClase_programadas,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_materia: info_materia_EF.id,
                            id_matricula: newMatricula_estudiante.id
                        };

                        await AsistenciaXMate.create(asistenciasXMateria_EF);

                        const info_materia_EN = await Materia.findOne(
                            {
                                where: {
                                    nombre: 'Inglés',
                                    id_curso: infoCurso.id
                                }
                            }
                        );
                        const asistenciasXMateria_EN = {
                            horasClase_programadas: info_materia_EN.horasClase_programadas,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_materia: info_materia_EN.id,
                            id_matricula: newMatricula_estudiante.id
                        };

                        await AsistenciaXMate.create(asistenciasXMateria_EN);
                    }
                    for (let i = 0; i < infoCurso.materia.length; i++) {
                        const { tipoCalificacion } = infoCurso.materia[i];
                        const id_materia = infoCurso.materia[i].id;
                        const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                        const asistenciasXMateria = {
                            horasClase_programadas: infoMateria.horasClase_programadas,
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_materia: id_materia,
                            id_matricula: newMatricula_estudiante.id
                        };

                        await AsistenciaXMate.create(asistenciasXMateria);

                        if (tipoCalificacion == 0) {
                            const dataCalificacionQ = {
                                firstParcialPQ: 0, secondParcialPQ: 0,
                                subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                firstParcialSQ: 0, secondParcialSQ: 0,
                                subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                notaFinal: 0, aprobado: 1,
                                id_materia: id_materia,
                                id_matricula: newMatricula_estudiante.id
                            };
                            await CalificacionQ.create(dataCalificacionQ);
                        } else {
                            if (infoCurso.nivelAcademico == 'Bachillerato' && infoCurso.gradoAcademico == 3 ||
                                infoCurso.gradoAcademico == 10 || infoCurso.gradoAcademico == 7) {
                                const dataCalificacionT = {
                                    aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                    evaluacion_estructurada_1: 0,
                                    aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                    evaluacion_estructurada_2: 0,
                                    aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                    evaluacion_estructurada_3: 0,
                                    proyecto_Final: 0, evaluacion_nivel: 0,
                                    total_Final: 0, aprobado: 1,
                                    id_materia: id_materia,
                                    id_matricula: newMatricula_estudiante.id
                                };
                                await CalificacionT.create(dataCalificacionT);
                            } else {
                                const dataCalificacionT = {
                                    aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                    evaluacion_estructurada_1: 0,
                                    aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                    evaluacion_estructurada_2: 0,
                                    aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                    evaluacion_estructurada_3: 0,
                                    proyecto_Final: 0, evaluacion_nivel: 0,
                                    total_Final: 0, aprobado: 1,
                                    id_materia: id_materia,
                                    id_matricula: newMatricula_estudiante.id
                                };
                                await CalificacionT.create(dataCalificacionT);
                            }
                        }
                    }
                } else {
                    return res.json({ message: 'Ocurrio un problema' });
                }
            }
        }
        return res.json({ message: 'Se matriculo el o los estudiante/s' });
    },
    /**
    * 
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    promoverEstudiantes: async (req, res) => {
        //let { lista_externalid_estudiantes, horasClase_programadas } = req.body
        const {
            externalId_anioLectivo
        } = req.body;

        const info_anioLectivo = await AnioLectivo.findOne({
            include: [Curso],
            where: {
                external_id: externalId_anioLectivo
            }
        });
        const list_Estudiantes = await Persona.findAll({ where: { id_rol: '6' } });
        const info_AnioLectivo = await AnioLectivo.findOne({ where: { estadoAniolectivo: 0 } });


        for (let i = 0; i < list_Estudiantes.length; i++) {
            const estadoAc = list_Estudiantes[i].estadoAc;
            const id_persona = list_Estudiantes[i].id;

            //estudiante promovido
            if (estadoAc == '1') {
                const list_matricula = await Matricula.findAll({ where: { id_persona: id_persona } });
                for (let j = 0; j < list_matricula.length; j++) {
                    const id_paralelo = list_matricula[j].id_paralelo;
                    const info_paralelo = await Paralelo.findOne({ where: { id: id_paralelo } });
                    const info_curso = await Curso.findOne({ where: { id: info_paralelo.id_curso } });

                    if (info_curso.id_anioLectivo == info_anioLectivo.id) {
                        const info_newAnioLectivo = await AnioLectivo.findOne({ where: { estadoAniolectivo: '0' } });

                        if (info_curso.nivelAcademico == 'Inicial 3 años') {

                            const info_curso_matricula = await Curso.findOne({
                                where: {
                                    nivelAcademico: 'Inicial 4 años',
                                    id_anioLectivo: info_newAnioLectivo.id
                                }
                            });

                            const info_paralelo_matricula = await Paralelo.findOne({
                                where: {
                                    titulo: info_paralelo.titulo,
                                    id_curso: info_curso_matricula.id
                                }
                            });

                            const data_newMatriculaEstudiante = {
                                id_paralelo: id_paralelo,
                                id_persona: infoEstudiante.id,
                                id_anioLectivo_actual: info_AnioLectivo.id
                            }

                            const dataEstadoAcademico = {
                                estadoAc: '0'
                            }

                            await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });


                            const newMatricula_estudiante = await Matricula.create(data_newMatriculaEstudiante);

                            const infoCurso = await Curso.findOne({
                                include: [Materia],
                                where: { id: info_paralelo_matricula.id_curso }
                            });

                            const asistenciaXDia = {
                                horasClase_programadas: '900',
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_matricula: newMatricula_estudiante.id
                            }
                            await AsistenciaXDia.create(asistenciaXDia);
                            let id_materia;
                            let tipoCalificacion;

                            for (let i = 0; i < infoCurso.materia.length; i++) {
                                id_materia = infoCurso.materia[i].id;
                                tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                await Materia.findOne({ where: { id: id_materia } });

                                if (tipoCalificacion == 0) {
                                    const dataCalificacionQ = {
                                        firstParcialPQ: 0, secondParcialPQ: 0,
                                        subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                        firstParcialSQ: 0, secondParcialSQ: 0,
                                        subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                        notaFinal: 0, aprobado: 1,
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await CalificacionQ.create(dataCalificacionQ);
                                } else {

                                    const dataCalificacionT = {
                                        aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                        evaluacion_estructurada_1: 0,
                                        aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                        evaluacion_estructurada_2: 0,
                                        aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                        evaluacion_estructurada_3: 0,
                                        proyecto_Final: 0,
                                        total_Final: 0, aprobado: 1,
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await CalificacionT.create(dataCalificacionT);
                                }
                            }
                        }
                        if (info_curso.nivelAcademico == 'Inicial 4 años') {
                            const info_curso_matricula = await Curso.findOne({
                                where: {
                                    nivelAcademico: 'Básica Preparatoria',
                                    id_anioLectivo: info_newAnioLectivo.id
                                }
                            });

                            const info_paralelo_matricula = await Paralelo.findOne({
                                where: {
                                    titulo: info_paralelo.titulo,
                                    id_curso: info_curso_matricula.id
                                }
                            });

                            const dataEstudiante = {
                                id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                            }
                            const dataEstadoAcademico = {
                                estadoAc: '0'
                            }

                            await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                            const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                            const infoCurso = await Curso.findOne({
                                include: [Materia],
                                where: { id: info_paralelo_matricula.id_curso }
                            });

                            const asistenciaXDia = {
                                periodo_academicos_Programados: "900",
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_matricula: newMatricula_estudiante.id
                            }
                            await AsistenciaXDia.create(asistenciaXDia);

                            const info_materia_ECA = await Materia.findOne(
                                {
                                    where: {
                                        nombre: 'Educación Cultural y Artística',
                                        id_curso: infoCurso.id
                                    }
                                }
                            );
                            const asistenciasXMateria_ECA = {
                                horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_materia: info_materia_ECA.id,
                                id_matricula: newMatricula_estudiante.id
                            };

                            await AsistenciaXMate.create(asistenciasXMateria_ECA);

                            const info_materia_EF = await Materia.findOne(
                                {
                                    where: {
                                        nombre: 'Educación Física',
                                        id_curso: infoCurso.id
                                    }
                                }
                            );
                            const asistenciasXMateria_EF = {
                                horasClase_programadas: info_materia_EF.horasClase_programadas,
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_materia: info_materia_EF.id,
                                id_matricula: newMatricula_estudiante.id
                            };

                            await AsistenciaXMate.create(asistenciasXMateria_EF);

                            let id_materia;
                            let tipoCalificacion;

                            for (let i = 0; i < infoCurso.materia.length; i++) {
                                id_materia = infoCurso.materia[i].id;
                                tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                await Materia.findOne({ where: { id: id_materia } });

                                if (tipoCalificacion == 0) {
                                    const dataCalificacionQ = {
                                        firstParcialPQ: 0, secondParcialPQ: 0,
                                        subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                        firstParcialSQ: 0, secondParcialSQ: 0,
                                        subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                        notaFinal: 0, aprobado: 1,
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await CalificacionQ.create(dataCalificacionQ);
                                } else {

                                    const dataCalificacionT = {
                                        aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                        evaluacion_estructurada_1: 0,
                                        aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                        evaluacion_estructurada_2: 0,
                                        aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                        evaluacion_estructurada_3: 0,
                                        proyecto_Final: 0,
                                        total_Final: 0, aprobado: 1,
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await CalificacionT.create(dataCalificacionT);
                                }
                            }
                        }
                        if (info_curso.nivelAcademico == 'Básica Preparatoria') {
                            const info_curso_matricula = await Curso.findOne({
                                where: {
                                    nivelAcademico: 'Básica Elemental',
                                    gradoAcademico: '2',
                                    id_anioLectivo: info_newAnioLectivo.id
                                }
                            });

                            console.log(info_curso_matricula)

                            const info_paralelo_matricula = await Paralelo.findOne({
                                where: {
                                    titulo: info_paralelo.titulo,
                                    id_curso: info_curso_matricula.id
                                }
                            });

                            const dataEstudiante = {
                                id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                            }
                            const dataEstadoAcademico = {
                                estadoAc: '0'
                            }

                            await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                            const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                            const infoCurso = await Curso.findOne({
                                include: [Materia],
                                where: { id: info_paralelo_matricula.id_curso }
                            });

                            const asistenciaXDia = {
                                horasClase_programadas: '792',
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_matricula: newMatricula_estudiante.id
                            }
                            await AsistenciaXDia.create(asistenciaXDia);

                            const info_materia_ECA = await Materia.findOne(
                                {
                                    where: {
                                        nombre: 'Educación Cultural y Artística',
                                        id_curso: infoCurso.id
                                    }
                                }
                            );
                            const asistenciasXMateria_ECA = {
                                horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_materia: info_materia_ECA.id,
                                id_matricula: newMatricula_estudiante.id
                            };

                            await AsistenciaXMate.create(asistenciasXMateria_ECA);

                            const info_materia_EF = await Materia.findOne(
                                {
                                    where: {
                                        nombre: 'Educación Física',
                                        id_curso: infoCurso.id
                                    }
                                }
                            );
                            const asistenciasXMateria_EF = {
                                horasClase_programadas: info_materia_EF.horasClase_programadas,
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_materia: info_materia_EF.id,
                                id_matricula: newMatricula_estudiante.id
                            };

                            await AsistenciaXMate.create(asistenciasXMateria_EF);

                            const info_materia_EN = await Materia.findOne(
                                {
                                    where: {
                                        nombre: 'Inglés',
                                        id_curso: infoCurso.id
                                    }
                                }
                            );
                            const asistenciasXMateria_EN = {
                                horasClase_programadas: info_materia_EN.horasClase_programadas,
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_materia: info_materia_EN.id,
                                id_matricula: newMatricula_estudiante.id
                            };

                            await AsistenciaXMate.create(asistenciasXMateria_EN);

                            let id_materia;
                            let tipoCalificacion;

                            for (let i = 0; i < infoCurso.materia.length; i++) {
                                id_materia = infoCurso.materia[i].id;
                                tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                await Materia.findOne({ where: { id: id_materia } });

                                if (tipoCalificacion == 0) {
                                    const dataCalificacionQ = {
                                        firstParcialPQ: 0, secondParcialPQ: 0,
                                        subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                        firstParcialSQ: 0, secondParcialSQ: 0,
                                        subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                        notaFinal: 0, aprobado: 1,
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await CalificacionQ.create(dataCalificacionQ);
                                } else {

                                    const dataCalificacionT = {
                                        aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                        evaluacion_estructurada_1: 0,
                                        aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                        evaluacion_estructurada_2: 0,
                                        aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                        evaluacion_estructurada_3: 0,
                                        proyecto_Final: 0,
                                        total_Final: 0, aprobado: 1,
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await CalificacionT.create(dataCalificacionT);
                                }
                            }
                        }
                        if (info_curso.nivelAcademico == 'Básica Elemental') {
                            if (info_curso.gradoAcademico == 2) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Elemental',
                                        gradoAcademico: '3',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                const asistenciaXDia = {
                                    horasClase_programadas: '792',
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_matricula: newMatricula_estudiante.id
                                }
                                await AsistenciaXDia.create(asistenciaXDia);

                                const info_materia_ECA = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Cultural y Artística',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_ECA = {
                                    horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_ECA.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_ECA);

                                const info_materia_EF = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Física',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EF = {
                                    horasClase_programadas: info_materia_EF.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EF.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EF);

                                const info_materia_EN = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Inglés',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EN = {
                                    horasClase_programadas: info_materia_EN.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EN.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EN);

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    await Materia.findOne({ where: { id: id_materia } });

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 3) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Elemental',
                                        gradoAcademico: '4',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                const asistenciaXDia = {
                                    horasClase_programadas: '792',
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_matricula: newMatricula_estudiante.id
                                }
                                await AsistenciaXDia.create(asistenciaXDia);

                                const info_materia_ECA = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Cultural y Artística',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_ECA = {
                                    horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_ECA.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_ECA);

                                const info_materia_EF = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Física',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EF = {
                                    horasClase_programadas: info_materia_EF.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EF.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EF);

                                const info_materia_EN = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Inglés',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EN = {
                                    horasClase_programadas: info_materia_EN.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EN.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EN);

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    await Materia.findOne({ where: { id: id_materia } });

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 4) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Media',
                                        gradoAcademico: '5',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                const asistenciaXDia = {
                                    horasClase_programadas: '792',
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_matricula: newMatricula_estudiante.id
                                }
                                await AsistenciaXDia.create(asistenciaXDia);

                                const info_materia_ECA = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Cultural y Artística',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_ECA = {
                                    horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_ECA.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_ECA);

                                const info_materia_EF = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Física',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EF = {
                                    horasClase_programadas: info_materia_EF.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EF.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EF);

                                const info_materia_EN = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Inglés',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EN = {
                                    horasClase_programadas: info_materia_EN.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EN.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EN);

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    await Materia.findOne({ where: { id: id_materia } });

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }
                            }

                        }
                        if (info_curso.nivelAcademico == 'Básica Media') {
                            if (info_curso.gradoAcademico == 5) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Media',
                                        gradoAcademico: '6',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                const asistenciaXDia = {
                                    horasClase_programadas: '792',
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_matricula: newMatricula_estudiante.id
                                }
                                await AsistenciaXDia.create(asistenciaXDia);

                                const info_materia_ECA = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Cultural y Artística',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_ECA = {
                                    horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_ECA.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_ECA);

                                const info_materia_EF = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Física',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EF = {
                                    horasClase_programadas: info_materia_EF.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EF.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EF);

                                const info_materia_EN = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Inglés',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EN = {
                                    horasClase_programadas: info_materia_EN.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EN.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EN);

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    await Materia.findOne({ where: { id: id_materia } });

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 6) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Media',
                                        gradoAcademico: '7',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                const asistenciaXDia = {
                                    horasClase_programadas: '792',
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_matricula: newMatricula_estudiante.id
                                }
                                await AsistenciaXDia.create(asistenciaXDia);

                                const info_materia_ECA = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Cultural y Artística',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_ECA = {
                                    horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_ECA.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_ECA);

                                const info_materia_EF = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Física',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EF = {
                                    horasClase_programadas: info_materia_EF.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EF.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EF);

                                const info_materia_EN = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Inglés',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EN = {
                                    horasClase_programadas: info_materia_EN.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EN.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EN);

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    await Materia.findOne({ where: { id: id_materia } });

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 7) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Superior',
                                        gradoAcademico: '8',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    const { tipoCalificacion } = infoCurso.materia[i];
                                    const id_materia = infoCurso.materia[i].id;
                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    };

                                    await AsistenciaXMate.create(asistenciasXMateria);

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        };
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.nivelAcademico == 'Bachillerato' && infoCurso.gradoAcademico == 3 ||
                                            infoCurso.gradoAcademico == 10 || infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }
                            }

                        }
                        if (info_curso.nivelAcademico == 'Básica Superior') {
                            if (info_curso.gradoAcademico == 8) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Superior',
                                        gradoAcademico: '9',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    const { tipoCalificacion } = infoCurso.materia[i];
                                    const id_materia = infoCurso.materia[i].id;
                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    };

                                    await AsistenciaXMate.create(asistenciasXMateria);

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        };
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.nivelAcademico == 'Bachillerato' && infoCurso.gradoAcademico == 3 ||
                                            infoCurso.gradoAcademico == 10 || infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 9) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Superior',
                                        gradoAcademico: '10',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    if (infoCurso.nivelAcademico == 'Básica Superior') {
                                        const asistenciasXMateria = {
                                            horasClase_programadas: infoMateria.horasClase_programadas,
                                            horasClase_dictadas: '0',
                                            horasClase_asistidas: '0',
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await AsistenciaXMate.create(asistenciasXMateria);
                                    }
                                    if (infoCurso.nivelAcademico == 'Bachillerato') {
                                        const asistenciasXMateria = {
                                            horasClase_programadas: infoMateria.horasClase_programadas,
                                            horasClase_dictadas: '0',
                                            horasClase_asistidas: '0',
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await AsistenciaXMate.create(asistenciasXMateria);
                                    }
                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.gradoAcademico == 3) {
                                            //console.log('2: ', infoCurso.nivelAcademico == 'Bachillerato')
                                            if (infoCurso.nivelAcademico == 'Bachillerato') {
                                                const dataCalificacionT = {
                                                    aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                    evaluacion_estructurada_1: 0,
                                                    aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                    evaluacion_estructurada_2: 0,
                                                    aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                    evaluacion_estructurada_3: 0,
                                                    proyecto_Final: 0, evaluacion_nivel: 0,
                                                    total_Final: 0, aprobado: 1,
                                                    id_materia: id_materia,
                                                    id_matricula: newMatricula_estudiante.id
                                                }
                                                await CalificacionT.create(dataCalificacionT);
                                            }
                                        }
                                        if (infoCurso.gradoAcademico == 10) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            }
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                        if (infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            }
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            }
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 10) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Bachillerato',
                                        gradoAcademico: '1',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    if (infoCurso.nivelAcademico == 'Básica Superior') {
                                        const asistenciasXMateria = {
                                            horasClase_programadas: infoMateria.horasClase_programadas,
                                            horasClase_dictadas: '0',
                                            horasClase_asistidas: '0',
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await AsistenciaXMate.create(asistenciasXMateria);
                                    }
                                    if (infoCurso.nivelAcademico == 'Bachillerato') {
                                        const asistenciasXMateria = {
                                            horasClase_programadas: infoMateria.horasClase_programadas,
                                            horasClase_dictadas: '0',
                                            horasClase_asistidas: '0',
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await AsistenciaXMate.create(asistenciasXMateria);
                                    }
                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.gradoAcademico == 3) {
                                            //console.log('2: ', infoCurso.nivelAcademico == 'Bachillerato')
                                            if (infoCurso.nivelAcademico == 'Bachillerato') {
                                                const dataCalificacionT = {
                                                    aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                    evaluacion_estructurada_1: 0,
                                                    aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                    evaluacion_estructurada_2: 0,
                                                    aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                    evaluacion_estructurada_3: 0,
                                                    proyecto_Final: 0, evaluacion_nivel: 0,
                                                    total_Final: 0, aprobado: 1,
                                                    id_materia: id_materia,
                                                    id_matricula: newMatricula_estudiante.id
                                                }
                                                await CalificacionT.create(dataCalificacionT);
                                            }
                                        }
                                        if (infoCurso.gradoAcademico == 10) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            }
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                        if (infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            }
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            }
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }
                            }

                        }
                        if (info_curso.nivelAcademico == 'Bachillerato') {
                            if (info_curso.gradoAcademico == 1) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Bachillerato',
                                        gradoAcademico: '2',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    const { tipoCalificacion } = infoCurso.materia[i];
                                    const id_materia = infoCurso.materia[i].id;
                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    };

                                    await AsistenciaXMate.create(asistenciasXMateria);

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        };
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.nivelAcademico == 'Bachillerato' && infoCurso.gradoAcademico == 3 ||
                                            infoCurso.gradoAcademico == 10 || infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 2) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Bachillerato',
                                        gradoAcademico: '3',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    const { tipoCalificacion } = infoCurso.materia[i];
                                    const id_materia = infoCurso.materia[i].id;
                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    };

                                    await AsistenciaXMate.create(asistenciasXMateria);

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        };
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.nivelAcademico == 'Bachillerato' && infoCurso.gradoAcademico == 3 ||
                                            infoCurso.gradoAcademico == 10 || infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }

                            }

                        }

                    }

                }
            }
            //estudiante no promovido
            if (estadoAc == '2') {

                const list_matricula = await Matricula.findAll({ where: { id_persona: id_persona } });
                for (let j = 0; j < list_matricula.length; j++) {
                    const id_paralelo = list_matricula[j].id_paralelo;
                    const info_paralelo = await Paralelo.findOne({ where: { id: id_paralelo } });
                    const info_curso = await Curso.findOne({ where: { id: info_paralelo.id_curso } });

                    if (info_curso.id_anioLectivo == info_anioLectivo.id) {
                        const info_newAnioLectivo = await AnioLectivo.findOne({ where: { estadoAniolectivo: '0' } });

                        if (info_curso.nivelAcademico == 'Inicial 3 años') {
                            const info_curso_matricula = await Curso.findOne({
                                where: {
                                    nivelAcademico: 'Inicial 3 años',
                                    id_anioLectivo: info_newAnioLectivo.id
                                }
                            });

                            const info_paralelo_matricula = await Paralelo.findOne({
                                where: {
                                    titulo: info_paralelo.titulo,
                                    id_curso: info_curso_matricula.id
                                }
                            });

                            const dataEstudiante = {
                                id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                            }
                            const dataEstadoAcademico = {
                                estadoAc: '0'
                            }

                            await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                            const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                            const infoCurso = await Curso.findOne({
                                include: [Materia],
                                where: { id: info_paralelo_matricula.id_curso }
                            });

                            const asistenciaXDia = {
                                horasClase_programadas: '900',
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_matricula: newMatricula_estudiante.id
                            }
                            await AsistenciaXDia.create(asistenciaXDia);
                            let id_materia;
                            let tipoCalificacion;

                            for (let i = 0; i < infoCurso.materia.length; i++) {
                                id_materia = infoCurso.materia[i].id;
                                tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                if (infoCurso.nivelAcademico == 'Básica Superior') {
                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await AsistenciaXMate.create(asistenciasXMateria);
                                }
                                if (infoCurso.nivelAcademico == 'Bachillerato') {
                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await AsistenciaXMate.create(asistenciasXMateria);
                                }
                                if (tipoCalificacion == 0) {
                                    const dataCalificacionQ = {
                                        firstParcialPQ: 0, secondParcialPQ: 0,
                                        subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                        firstParcialSQ: 0, secondParcialSQ: 0,
                                        subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                        notaFinal: 0, aprobado: 1,
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await CalificacionQ.create(dataCalificacionQ);
                                } else {
                                    if (infoCurso.gradoAcademico == 3) {
                                        //console.log('2: ', infoCurso.nivelAcademico == 'Bachillerato')
                                        if (infoCurso.nivelAcademico == 'Bachillerato') {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            }
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                    if (infoCurso.gradoAcademico == 10) {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0, evaluacion_nivel: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                    if (infoCurso.gradoAcademico == 7) {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0, evaluacion_nivel: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }
                            }
                        }
                        if (info_curso.nivelAcademico == 'Inicial 4 años') {
                            const info_curso_matricula = await Curso.findOne({
                                where: {
                                    nivelAcademico: 'Inicial 4 años',
                                    id_anioLectivo: info_newAnioLectivo.id
                                }
                            });

                            const info_paralelo_matricula = await Paralelo.findOne({
                                where: {
                                    titulo: info_paralelo.titulo,
                                    id_curso: info_curso_matricula.id
                                }
                            });

                            const dataEstudiante = {
                                id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                            }
                            const dataEstadoAcademico = {
                                estadoAc: '0'
                            }

                            await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                            const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                            const infoCurso = await Curso.findOne({
                                include: [Materia],
                                where: { id: info_paralelo_matricula.id_curso }
                            });

                            const asistenciaXDia = {
                                horasClase_programadas: '900',
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_matricula: newMatricula_estudiante.id
                            }
                            await AsistenciaXDia.create(asistenciaXDia);
                            let id_materia;
                            let tipoCalificacion;

                            for (let i = 0; i < infoCurso.materia.length; i++) {
                                id_materia = infoCurso.materia[i].id;
                                tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                if (infoCurso.nivelAcademico == 'Básica Superior') {
                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await AsistenciaXMate.create(asistenciasXMateria);
                                }
                                if (infoCurso.nivelAcademico == 'Bachillerato') {
                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await AsistenciaXMate.create(asistenciasXMateria);
                                }
                                if (tipoCalificacion == 0) {
                                    const dataCalificacionQ = {
                                        firstParcialPQ: 0, secondParcialPQ: 0,
                                        subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                        firstParcialSQ: 0, secondParcialSQ: 0,
                                        subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                        notaFinal: 0, aprobado: 1,
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await CalificacionQ.create(dataCalificacionQ);
                                } else {
                                    if (infoCurso.gradoAcademico == 3) {
                                        //console.log('2: ', infoCurso.nivelAcademico == 'Bachillerato')
                                        if (infoCurso.nivelAcademico == 'Bachillerato') {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            }
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                    if (infoCurso.gradoAcademico == 10) {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0, evaluacion_nivel: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                    if (infoCurso.gradoAcademico == 7) {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0, evaluacion_nivel: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }
                            }
                        }
                        if (info_curso.nivelAcademico == 'Básica Preparatoria') {
                            const info_curso_matricula = await Curso.findOne({
                                where: {
                                    nivelAcademico: 'Básica Preparatoria',
                                    id_anioLectivo: info_newAnioLectivo.id
                                }
                            });

                            const info_paralelo_matricula = await Paralelo.findOne({
                                where: {
                                    titulo: info_paralelo.titulo,
                                    id_curso: info_curso_matricula.id
                                }
                            });

                            const dataEstudiante = {
                                id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                            }
                            const dataEstadoAcademico = {
                                estadoAc: '0'
                            }

                            await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                            const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                            const infoCurso = await Curso.findOne({
                                include: [Materia],
                                where: { id: info_paralelo_matricula.id_curso }
                            });

                            const asistenciaXDia = {
                                periodo_academicos_Programados: "900",
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_matricula: newMatricula_estudiante.id
                            }
                            await AsistenciaXDia.create(asistenciaXDia);

                            const info_materia_ECA = await Materia.findOne(
                                {
                                    where: {
                                        nombre: 'Educación Cultural y Artística',
                                        id_curso: infoCurso.id
                                    }
                                }
                            );
                            const asistenciasXMateria_ECA = {
                                horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_materia: info_materia_ECA.id,
                                id_matricula: newMatricula_estudiante.id
                            };

                            await AsistenciaXMate.create(asistenciasXMateria_ECA);

                            const info_materia_EF = await Materia.findOne(
                                {
                                    where: {
                                        nombre: 'Educación Física',
                                        id_curso: infoCurso.id
                                    }
                                }
                            );
                            const asistenciasXMateria_EF = {
                                horasClase_programadas: info_materia_EF.horasClase_programadas,
                                horasClase_dictadas: '0',
                                horasClase_asistidas: '0',
                                id_materia: info_materia_EF.id,
                                id_matricula: newMatricula_estudiante.id
                            };

                            await AsistenciaXMate.create(asistenciasXMateria_EF);

                            let id_materia;
                            let tipoCalificacion;

                            for (let i = 0; i < infoCurso.materia.length; i++) {
                                id_materia = infoCurso.materia[i].id;
                                tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                await Materia.findOne({ where: { id: id_materia } });

                                if (tipoCalificacion == 0) {
                                    const dataCalificacionQ = {
                                        firstParcialPQ: 0, secondParcialPQ: 0,
                                        subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                        firstParcialSQ: 0, secondParcialSQ: 0,
                                        subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                        notaFinal: 0, aprobado: 1,
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await CalificacionQ.create(dataCalificacionQ);
                                } else {

                                    const dataCalificacionT = {
                                        aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                        evaluacion_estructurada_1: 0,
                                        aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                        evaluacion_estructurada_2: 0,
                                        aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                        evaluacion_estructurada_3: 0,
                                        proyecto_Final: 0,
                                        total_Final: 0, aprobado: 1,
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    }
                                    await CalificacionT.create(dataCalificacionT);
                                }
                            }
                        }
                        if (info_curso.nivelAcademico == 'Básica Elemental') {
                            if (info_curso.gradoAcademico == 2) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Elemental',
                                        gradoAcademico: '2',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                const asistenciaXDia = {
                                    horasClase_programadas: '792',
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_matricula: newMatricula_estudiante.id
                                }
                                await AsistenciaXDia.create(asistenciaXDia);

                                const info_materia_ECA = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Cultural y Artística',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_ECA = {
                                    horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_ECA.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_ECA);

                                const info_materia_EF = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Física',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EF = {
                                    horasClase_programadas: info_materia_EF.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EF.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EF);

                                const info_materia_EN = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Inglés',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EN = {
                                    horasClase_programadas: info_materia_EN.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EN.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EN);

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    await Materia.findOne({ where: { id: id_materia } });

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 3) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Elemental',
                                        gradoAcademico: '3',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                const asistenciaXDia = {
                                    horasClase_programadas: '792',
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_matricula: newMatricula_estudiante.id
                                }
                                await AsistenciaXDia.create(asistenciaXDia);

                                const info_materia_ECA = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Cultural y Artística',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_ECA = {
                                    horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_ECA.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_ECA);

                                const info_materia_EF = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Física',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EF = {
                                    horasClase_programadas: info_materia_EF.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EF.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EF);

                                const info_materia_EN = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Inglés',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EN = {
                                    horasClase_programadas: info_materia_EN.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EN.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EN);

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    await Materia.findOne({ where: { id: id_materia } });

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 4) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Media',
                                        gradoAcademico: '4',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                const asistenciaXDia = {
                                    horasClase_programadas: '792',
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_matricula: newMatricula_estudiante.id
                                }
                                await AsistenciaXDia.create(asistenciaXDia);

                                const info_materia_ECA = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Cultural y Artística',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_ECA = {
                                    horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_ECA.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_ECA);

                                const info_materia_EF = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Física',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EF = {
                                    horasClase_programadas: info_materia_EF.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EF.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EF);

                                const info_materia_EN = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Inglés',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EN = {
                                    horasClase_programadas: info_materia_EN.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EN.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EN);

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    await Materia.findOne({ where: { id: id_materia } });

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }
                            }

                        }
                        if (info_curso.nivelAcademico == 'Básica Media') {
                            if (info_curso.gradoAcademico == 5) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Media',
                                        gradoAcademico: '5',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                const asistenciaXDia = {
                                    horasClase_programadas: '792',
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_matricula: newMatricula_estudiante.id
                                }
                                await AsistenciaXDia.create(asistenciaXDia);

                                const info_materia_ECA = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Cultural y Artística',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_ECA = {
                                    horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_ECA.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_ECA);

                                const info_materia_EF = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Física',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EF = {
                                    horasClase_programadas: info_materia_EF.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EF.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EF);

                                const info_materia_EN = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Inglés',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EN = {
                                    horasClase_programadas: info_materia_EN.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EN.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EN);

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    await Materia.findOne({ where: { id: id_materia } });

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 6) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Media',
                                        gradoAcademico: '6',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                const asistenciaXDia = {
                                    horasClase_programadas: '792',
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_matricula: newMatricula_estudiante.id
                                }
                                await AsistenciaXDia.create(asistenciaXDia);

                                const info_materia_ECA = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Cultural y Artística',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_ECA = {
                                    horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_ECA.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_ECA);

                                const info_materia_EF = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Física',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EF = {
                                    horasClase_programadas: info_materia_EF.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EF.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EF);

                                const info_materia_EN = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Inglés',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EN = {
                                    horasClase_programadas: info_materia_EN.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EN.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EN);

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    await Materia.findOne({ where: { id: id_materia } });

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 7) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Media',
                                        gradoAcademico: '7',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                const asistenciaXDia = {
                                    horasClase_programadas: '792',
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_matricula: newMatricula_estudiante.id
                                }
                                await AsistenciaXDia.create(asistenciaXDia);

                                const info_materia_ECA = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Cultural y Artística',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_ECA = {
                                    horasClase_programadas: info_materia_ECA.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_ECA.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_ECA);

                                const info_materia_EF = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Educación Física',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EF = {
                                    horasClase_programadas: info_materia_EF.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EF.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EF);

                                const info_materia_EN = await Materia.findOne(
                                    {
                                        where: {
                                            nombre: 'Inglés',
                                            id_curso: infoCurso.id
                                        }
                                    }
                                );
                                const asistenciasXMateria_EN = {
                                    horasClase_programadas: info_materia_EN.horasClase_programadas,
                                    horasClase_dictadas: '0',
                                    horasClase_asistidas: '0',
                                    id_materia: info_materia_EN.id,
                                    id_matricula: newMatricula_estudiante.id
                                };

                                await AsistenciaXMate.create(asistenciasXMateria_EN);

                                let id_materia;
                                let tipoCalificacion;

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    id_materia = infoCurso.materia[i].id;
                                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                                    await Materia.findOne({ where: { id: id_materia } });

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        const dataCalificacionT = {
                                            aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                            evaluacion_estructurada_1: 0,
                                            aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                            evaluacion_estructurada_2: 0,
                                            aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                            evaluacion_estructurada_3: 0,
                                            proyecto_Final: 0,
                                            total_Final: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        }
                                        await CalificacionT.create(dataCalificacionT);
                                    }
                                }

                            }
                        }
                        if (info_curso.nivelAcademico == 'Básica Superior') {
                            if (info_curso.gradoAcademico == 8) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Superior',
                                        gradoAcademico: '8',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    const { tipoCalificacion } = infoCurso.materia[i];
                                    const id_materia = infoCurso.materia[i].id;
                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    };

                                    await AsistenciaXMate.create(asistenciasXMateria);

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        };
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.nivelAcademico == 'Bachillerato' && infoCurso.gradoAcademico == 3 ||
                                            infoCurso.gradoAcademico == 10 || infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 9) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Superior',
                                        gradoAcademico: '9',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    const { tipoCalificacion } = infoCurso.materia[i];
                                    const id_materia = infoCurso.materia[i].id;
                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    };

                                    await AsistenciaXMate.create(asistenciasXMateria);

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        };
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.nivelAcademico == 'Bachillerato' && infoCurso.gradoAcademico == 3 ||
                                            infoCurso.gradoAcademico == 10 || infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 10) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Básica Superior',
                                        gradoAcademico: '10',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    const { tipoCalificacion } = infoCurso.materia[i];
                                    const id_materia = infoCurso.materia[i].id;
                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    };

                                    await AsistenciaXMate.create(asistenciasXMateria);

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        };
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.nivelAcademico == 'Bachillerato' && infoCurso.gradoAcademico == 3 ||
                                            infoCurso.gradoAcademico == 10 || infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }
                            }

                        }
                        if (info_curso.nivelAcademico == 'Bachillerato') {
                            if (info_curso.gradoAcademico == 1) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Bachillerato',
                                        gradoAcademico: '1',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    const { tipoCalificacion } = infoCurso.materia[i];
                                    const id_materia = infoCurso.materia[i].id;
                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    };

                                    await AsistenciaXMate.create(asistenciasXMateria);

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        };
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.nivelAcademico == 'Bachillerato' && infoCurso.gradoAcademico == 3 ||
                                            infoCurso.gradoAcademico == 10 || infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 2) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Bachillerato',
                                        gradoAcademico: '2',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    const { tipoCalificacion } = infoCurso.materia[i];
                                    const id_materia = infoCurso.materia[i].id;
                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    };

                                    await AsistenciaXMate.create(asistenciasXMateria);

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        };
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.nivelAcademico == 'Bachillerato' && infoCurso.gradoAcademico == 3 ||
                                            infoCurso.gradoAcademico == 10 || infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }

                            }
                            if (info_curso.gradoAcademico == 3) {

                                const info_curso_matricula = await Curso.findOne({
                                    where: {
                                        nivelAcademico: 'Bachillerato',
                                        gradoAcademico: '3',
                                        id_anioLectivo: info_newAnioLectivo.id
                                    }
                                });

                                const info_paralelo_matricula = await Paralelo.findOne({
                                    where: {
                                        titulo: info_paralelo.titulo,
                                        id_curso: info_curso_matricula.id
                                    }
                                });

                                const dataEstudiante = {
                                    id_paralelo: info_paralelo_matricula.id, id_persona: id_persona
                                }
                                const dataEstadoAcademico = {
                                    estadoAc: '0'
                                }

                                await Persona.update(dataEstadoAcademico, { where: { id: id_persona } });

                                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                                const infoCurso = await Curso.findOne({
                                    include: [Materia],
                                    where: { id: info_paralelo_matricula.id_curso }
                                });

                                for (let i = 0; i < infoCurso.materia.length; i++) {
                                    const { tipoCalificacion } = infoCurso.materia[i];
                                    const id_materia = infoCurso.materia[i].id;
                                    const infoMateria = await Materia.findOne({ where: { id: id_materia } });

                                    const asistenciasXMateria = {
                                        horasClase_programadas: infoMateria.horasClase_programadas,
                                        horasClase_dictadas: '0',
                                        horasClase_asistidas: '0',
                                        id_materia: id_materia,
                                        id_matricula: newMatricula_estudiante.id
                                    };

                                    await AsistenciaXMate.create(asistenciasXMateria);

                                    if (tipoCalificacion == 0) {
                                        const dataCalificacionQ = {
                                            firstParcialPQ: 0, secondParcialPQ: 0,
                                            subTotalPQ: 0, testPQ: 0, totalPQ: 0,
                                            firstParcialSQ: 0, secondParcialSQ: 0,
                                            subTota2PQ: 0, testSQ: 0, totalSQ: 0,
                                            notaFinal: 0, aprobado: 1,
                                            id_materia: id_materia,
                                            id_matricula: newMatricula_estudiante.id
                                        };
                                        await CalificacionQ.create(dataCalificacionQ);
                                    } else {
                                        if (infoCurso.nivelAcademico == 'Bachillerato' && infoCurso.gradoAcademico == 3 ||
                                            infoCurso.gradoAcademico == 10 || infoCurso.gradoAcademico == 7) {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        } else {
                                            const dataCalificacionT = {
                                                aportesPrimerTimestre: 0, proIntegradorFase_1: 0,
                                                evaluacion_estructurada_1: 0,
                                                aportesSegundoTimestre: 0, proIntegradorFase_2: 0,
                                                evaluacion_estructurada_2: 0,
                                                aportesTercerTimestre: 0, proIntegradorFase_3: 0,
                                                evaluacion_estructurada_3: 0,
                                                proyecto_Final: 0, evaluacion_nivel: 0,
                                                total_Final: 0, aprobado: 1,
                                                id_materia: id_materia,
                                                id_matricula: newMatricula_estudiante.id
                                            };
                                            await CalificacionT.create(dataCalificacionT);
                                        }
                                    }
                                }

                            }

                        }

                    }

                }

            }

        }
        return res.json({ message: 'Se han promovido a los estudiantes con estado académico promovido' })
    },
    /**getAllAniosLectivos: Funcion get para obtener la lista de de años lectivos
       * @param {*} req 
       * @param {*} res 
       * @returns Una lista en formato json de los anios lectivos registrados
       */
    getAllAniosLectivos: async (req, res) => {
        const aniosLectivos = await AnioLectivo.findAll({ include: [Curso] });
        //console.log(aniosLectivos)
        return res.json({ aniosLectivos });
    },
    /**createAnioLectivo: Funcion para crear un año lectivo
       * @param {*} req 
       * @param {*} res 
       * @returns Una lista en formato json de los anios lectivos registrados
       */
    createAnioLectivo: async (req, res) => {
        const {
            jornada, periodo, fechaInicio,
            fechaFin, modalidad, tipoCalificacion,
            inicial, preparatoria,
            elemental, media, superior,
            bachillerato, bachillerato_3ro
        } = req.body;

        const anioLectivoData = {
            jornada: jornada, periodo: periodo,
            fechaInicio: fechaInicio, fechaFin: fechaFin,
            modalidad: modalidad, tipoCalificacion: tipoCalificacion,
            estadoAniolectivo: '0'
        }
        const infoAniosLectivos = await AnioLectivo.findAll();

        let contadorEstadoAnioLectivo = 0; // Variable contador
        for (let i = 0; i < infoAniosLectivos.length; i++) {
            if (infoAniosLectivos[i].estadoAniolectivo === 0) {
                contadorEstadoAnioLectivo++;
            }
        }

        if (contadorEstadoAnioLectivo == 0) {
            const newAnioLectivo = await AnioLectivo.create(anioLectivoData);
            //crear cursos
            const {
                boolInicial, boolBasica, boolBachillerato,
                bool1I, num_paralelo1I,
                bool2I, num_paralelo2I,
                bool1B, num_paralelo1B,
                bool2B, num_paralelo2B,
                bool3B, num_paralelo3B,
                bool4B, num_paralelo4B,
                bool5B, num_paralelo5B,
                bool6B, num_paralelo6B,
                bool7B, num_paralelo7B,
                bool8B, num_paralelo8B,
                bool9B, num_paralelo9B,
                bool10B, num_paralelo10B,
                bool1S, num_paralelo1S,
                bool2S, num_paralelo2S,
                bool3S, num_paralelo3S
            } = req.body;
            if (newAnioLectivo) {
                if (boolInicial == true) {
                    if (bool1I == true) {

                        const cursoData = {
                            nivelAcademico: 'Inicial 3 años',
                            gradoAcademico: '1',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);

                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < inicial.length; i++) {
                                const { area, nombre, horasClase_programadas } = inicial[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo1I;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const parareloData = {
                                    titulo: letra,
                                    id_curso: id_curso
                                }
                                await Paralelo.create(parareloData);
                            }
                        }
                    }
                    if (bool2I == true) {
                        const cursoData = {
                            nivelAcademico: 'Inicial 4 años',
                            gradoAcademico: '2',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;

                        if (newCurso) {
                            for (let i = 0; i < inicial.length; i++) {
                                const { area, nombre, horasClase_programadas } = inicial[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo2I;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const paraleloData = {
                                    titulo: letra,
                                    id_curso: id_curso
                                }
                                await Paralelo.create(paraleloData);
                            }
                        }
                    }
                }

                if (boolBasica == true) {
                    if (bool1B == true) {
                        const cursoData = {
                            nivelAcademico: 'Básica Preparatoria',
                            gradoAcademico: '1',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < preparatoria.length; i++) {
                                const { area, nombre, horasClase_programadas } = preparatoria[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }
                            const numeroParalelo = num_paralelo1B;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                    if (bool2B == true) {
                        const cursoData = {
                            nivelAcademico: 'Básica Elemental',
                            gradoAcademico: '2',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < elemental.length; i++) {
                                const { area, nombre, horasClase_programadas } = elemental[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo2B;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                    if (bool3B == true) {
                        const cursoData = {
                            nivelAcademico: 'Básica Elemental',
                            gradoAcademico: '3',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < elemental.length; i++) {
                                const { area, nombre, horasClase_programadas } = elemental[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo3B;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                    if (bool4B == true) {
                        const cursoData = {
                            nivelAcademico: 'Básica Elemental',
                            gradoAcademico: '4',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < elemental.length; i++) {
                                const { area, nombre, horasClase_programadas } = elemental[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo4B;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                    if (bool5B == true) {
                        const cursoData = {
                            nivelAcademico: 'Básica Media',
                            gradoAcademico: '5',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < media.length; i++) {
                                const { area, nombre, horasClase_programadas } = media[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo5B;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                    if (bool6B == true) {
                        const cursoData = {
                            nivelAcademico: 'Básica Media',
                            gradoAcademico: '6',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < media.length; i++) {
                                const { area, nombre, horasClase_programadas } = media[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo6B;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                    if (bool7B == true) {
                        const cursoData = {
                            nivelAcademico: 'Básica Media',
                            gradoAcademico: '7',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < media.length; i++) {
                                const { area, nombre, horasClase_programadas } = media[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo7B;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                    if (bool8B == true) {
                        const cursoData = {
                            nivelAcademico: 'Básica Superior',
                            gradoAcademico: '8',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < superior.length; i++) {
                                const { area, nombre, horasClase_programadas } = superior[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo8B;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                    if (bool9B == true) {
                        const cursoData = {
                            nivelAcademico: 'Básica Superior',
                            gradoAcademico: '9',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < superior.length; i++) {
                                const { area, nombre, horasClase_programadas } = superior[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo9B;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                    if (bool10B == true) {
                        const cursoData = {
                            nivelAcademico: 'Básica Superior',
                            gradoAcademico: '10',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < superior.length; i++) {
                                const { area, nombre, horasClase_programadas } = superior[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo10B;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                }

                if (boolBachillerato == true) {

                    if (bool1S == true) {
                        const cursoData = {
                            nivelAcademico: 'Bachillerato',
                            gradoAcademico: '1',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < bachillerato.length; i++) {
                                const { area, nombre, horasClase_programadas } = bachillerato[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo1S;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                    if (bool2S == true) {
                        const cursoData = {
                            nivelAcademico: 'Bachillerato',
                            gradoAcademico: '2',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < bachillerato.length; i++) {
                                const { area, nombre, horasClase_programadas } = bachillerato[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo2S;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }

                    if (bool3S == true) {
                        const cursoData = {
                            nivelAcademico: 'Bachillerato',
                            gradoAcademico: '3',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < bachillerato_3ro.length; i++) {
                                const { area, nombre, horasClase_programadas } = bachillerato_3ro[i];
                                const dataMateria = {
                                    area: area,
                                    nombre: nombre,
                                    horasClase_programadas: horasClase_programadas,
                                    tipoCalificacion: tipoCalificacion,
                                    id_curso: id_curso
                                }
                                await Materia.create(dataMateria);
                            }

                            const numeroParalelo = num_paralelo3S;
                            const startCharCode = 65; // Código ASCII de la letra 'A'
                            for (let i = 0; i < numeroParalelo; i++) {
                                const letra = String.fromCharCode(startCharCode + i);
                                const cursoData = {
                                    titulo: letra,
                                    id_curso: newCurso.id
                                }
                                await Paralelo.create(cursoData);
                            }
                        }
                    }
                }

                return res.json({ message: 'Se ha generado el año lectivo y la oferta académica exitosamente', newAnioLectivo });
            } else {
                return res.json({ message: 'Error, revise bien la información' });
            }
        } else {
            return res.json({ message: 'Ya existe un Año lectivo con estado activo' });
        }
    },
    /**updateAnioLectivo: Funcion para actualizar ciertos campos de un año lectivo
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    updateAnioLectivo: async (req, res) => {
        const { external_id, jornada, periodo, fechaFin, modalidad, tipoCalificacion } = req.body;
        const info_AnioLectivo = await AnioLectivo.findOne({ where: { externalId: external_id } });
        const info_matricula = await Matricula.findAll({ where: { id_anioLectivo_actual: info_AnioLectivo.id } });
        if (!info_matricula) {
            const dataAnioLectivo = {
                jornada: jornada,
                periodo: periodo,
                fechaFin: fechaFin,
                modalidad: modalidad,
                tipoCalificacion: tipoCalificacion
            }
            const updateAnioLectivo = await AnioLectivo.update(dataAnioLectivo, { where: { external_id: external_id } });
            return res.json({ message: 'Se ha actulizado el Año lectivo corecctemente', updateAnioLectivo });
        } else {
            return res.json({ message: 'No se puede actualizar el tipo de califiacion del año lectivo, debido que ya existen estudiantes matriculados' });
        }
    },
    /**updateEstadoAnioLectivo: Funcion para actualizar el estado lectivo
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    updateEstadoAnioLectivo: async (req, res) => {
        const { external_id, estadoAniolectivo } = req.body;
        const dataAnioLectivo = {
            estadoAniolectivo: estadoAniolectivo
        }
        const updateAnioLectivo = await AnioLectivo.update(dataAnioLectivo, { where: { external_id: external_id } });
        return res.json({ message: 'El año lectivo actual ha finalizado', updateAnioLectivo });
    },
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
    }
    /**Fin funciones validadas */
}

module.exports = controller;
