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
    matricularEstudiante: async (req, res) => {
        let { lista_externalid_estudiantes, id_paralelo } = req.body
        //const { cursoMatricula, plnatelAnterior, id_paralelo, id_persona, newEstudiante } = req.body;

        for (let i = 0; i < lista_externalid_estudiantes.length; i++) {
            const { externalId } = lista_externalid_estudiantes[i];

            const infoParalelo = await Paralelo.findOne({
                where: { id: id_paralelo }
            });

            const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: infoParalelo.id_curso }
            });

            //en caso de que el estudiante sea nuevo se recibe un 0=si o un 1=0
            const infoEstudiante = await Persona.findOne({ where: { external_id: externalId } })
            const dataEstudiante = {
                id_paralelo: id_paralelo, id_persona: infoEstudiante.id
            }
            const newMatricula_estudiante = await Matricula.create(dataEstudiante);

            if (newMatricula_estudiante) {
                let id_materia;
                let tipoCalificacion;

                if (infoCurso.nivelAcademico == 'Inicial 3 años') {
                    const asistenciaXDia = {
                        horasClase_programadas: '55',
                        horasClase_dictadas: '0',
                        horasClase_asistidas: '0',
                        id_matricula: newMatricula_estudiante.id
                    }
                    await AsistenciaXDia.create(asistenciaXDia);
                }
                if (infoCurso.nivelAcademico == 'Inicial 4 años') {
                    const asistenciaXDia = {
                        horasClase_programadas: '55',
                        horasClase_dictadas: '0',
                        horasClase_asistidas: '0',
                        id_matricula: newMatricula_estudiante.id
                    }
                    await AsistenciaXDia.create(asistenciaXDia);
                }
                if (infoCurso.nivelAcademico == 'Básica Preparatoria') {
                    const asistenciaXDia = {
                        horasClase_programadas: '55',
                        horasClase_dictadas: '0',
                        horasClase_asistidas: '0',
                        id_matricula: newMatricula_estudiante.id
                    }
                    await AsistenciaXDia.create(asistenciaXDia);
                }
                if (infoCurso.nivelAcademico == 'Básica Elemental') {
                    const asistenciaXDia = {
                        horasClase_programadas: '55',
                        horasClase_dictadas: '0',
                        horasClase_asistidas: '0',
                        id_matricula: newMatricula_estudiante.id
                    }
                    await AsistenciaXDia.create(asistenciaXDia);
                }
                if (infoCurso.nivelAcademico == 'Básica Media') {
                    const asistenciaXDia = {
                        horasClase_programadas: '55',
                        horasClase_dictadas: '0',
                        horasClase_asistidas: '0',
                        id_matricula: newMatricula_estudiante.id
                    }
                    await AsistenciaXDia.create(asistenciaXDia);
                }
                for (let i = 0; i < infoCurso.materia.length; i++) {
                    id_materia = infoCurso.materia[i].id;
                    tipoCalificacion = infoCurso.materia[i].tipoCalificacion;
                    if (infoCurso.nivelAcademico == 'Básica Superior') {
                        const asistenciasXMateria = {
                            horasClase_programadas: '55',
                            horasClase_dictadas: '0',
                            horasClase_asistidas: '0',
                            id_materia: id_materia,
                            id_matricula: newMatricula_estudiante.id
                        }
                        await AsistenciaXMate.create(asistenciasXMateria);
                    }
                    if (infoCurso.nivelAcademico == 'Bachillerato') {
                        const asistenciasXMateria = {
                            horasClase_programadas: '55',
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
                                proyecto_Final: 0, evaluacion_nivel: 0,
                                total_Final: 0, aprobado: 1,
                                id_materia: id_materia,
                                id_matricula: newMatricula_estudiante.id
                            }
                            await CalificacionT.create(dataCalificacionT);
                        }
                    }
                }
            } else {
                return res.json({ message: 'Ocurrio un problema 1' });
            }
        }
        return res.json({ message: 'Se matriculo el o los estudiante/s' });
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
            inicial, preparatoria, ele_med_sup,
            bachillerato
        } = req.body;

        const anioLectivoData = {
            jornada: jornada, periodo: periodo,
            fechaInicio: fechaInicio, fechaFin: fechaFin,
            modalidad: modalidad, estadoAniolectivo: '0'
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

                if (boolInicial == 0) {
                    if (bool1I == 0) {

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
                    if (bool2I == 0) {
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

                if (boolBasica == 0) {
                    if (bool1B == 0) {
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

                    if (bool2B == 0) {
                        const cursoData = {
                            nivelAcademico: 'Básica Elemental',
                            gradoAcademico: '2',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < ele_med_sup.length; i++) {
                                const { area, nombre, horasClase_programadas } = ele_med_sup[i];
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

                    if (bool3B == 0) {
                        const cursoData = {
                            nivelAcademico: 'Básica Elemental',
                            gradoAcademico: '3',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < ele_med_sup.length; i++) {
                                const { area, nombre, horasClase_programadas } = ele_med_sup[i];
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

                    if (bool4B == 0) {
                        const cursoData = {
                            nivelAcademico: 'Básica Elemental',
                            gradoAcademico: '4',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < ele_med_sup.length; i++) {
                                const { area, nombre, horasClase_programadas } = ele_med_sup[i];
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

                    if (bool5B == 0) {
                        const cursoData = {
                            nivelAcademico: 'Básica Media',
                            gradoAcademico: '5',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < ele_med_sup.length; i++) {
                                const { area, nombre, horasClase_programadas } = ele_med_sup[i];
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

                    if (bool6B == 0) {
                        const cursoData = {
                            nivelAcademico: 'Básica Media',
                            gradoAcademico: '6',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < ele_med_sup.length; i++) {
                                const { area, nombre, horasClase_programadas } = ele_med_sup[i];
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

                    if (bool7B == 0) {
                        const cursoData = {
                            nivelAcademico: 'Básica Media',
                            gradoAcademico: '7',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < ele_med_sup.length; i++) {
                                const { area, nombre, horasClase_programadas } = ele_med_sup[i];
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

                    if (bool8B == 0) {
                        const cursoData = {
                            nivelAcademico: 'Básica Superior',
                            gradoAcademico: '8',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < ele_med_sup.length; i++) {
                                const { area, nombre, horasClase_programadas } = ele_med_sup[i];
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

                    if (bool9B == 0) {
                        const cursoData = {
                            nivelAcademico: 'Básica Superior',
                            gradoAcademico: '9',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < ele_med_sup.length; i++) {
                                const { area, nombre, horasClase_programadas } = ele_med_sup[i];
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

                    if (bool10B == 0) {
                        const cursoData = {
                            nivelAcademico: 'Básica Superior',
                            gradoAcademico: '10',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;
                        if (newCurso) {
                            for (let i = 0; i < ele_med_sup.length; i++) {
                                const { area, nombre, horasClase_programadas } = ele_med_sup[i];
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

                }

                if (boolBachillerato == 0) {

                    if (bool1S == 0) {
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

                    if (bool2S == 0) {
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

                    if (bool3S == 0) {
                        const cursoData = {
                            nivelAcademico: 'Bachillerato',
                            gradoAcademico: '3',
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
                }

                return res.json({ message: 'Se ha generado el año lectivo y la oferta académica exitosamente', newAnioLectivo });
            } else {
                return res.json({ message: 'Error, revise bien la información' });
            }
        } else {
            return res.json({ message: 'Ya existe un Año lectivo con estado activo' });
        }
    },
    /**Fin funciones validadas */

    test: async (req, res) => {
        let { info } = req.body
        return res.json(info)
    }
}

module.exports = controller;
