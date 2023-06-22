'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const curso = require('../models/curso');


const AnioLectivo = models.anioLectivo;
const Curso = models.curso;
const Paralelo = models.paralelo;
const Matricula = models.matricula;
const Materia = models.materia;
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
        let { info } = req.body


        //const { cursoMatricula, plnatelAnterior, id_paralelo, id_persona, newEstudiante } = req.body;

        for (let i = 0; i < info.length; i++) {
            const { cursoMatricula, plnatelAnterior, id_paralelo, id_persona, newEstudiante } = info[i];

            const infoParalelo = await Paralelo.findOne({
                where: { id: id_paralelo }
            });
            //console.log('paralelo: ', infoParalelo)

            const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: infoParalelo.id_curso }
            });
            //console.log('curso: ', infoCurso.materia.length)
            //en caso de que el estudiante sea nuevo se recibe un 0=si o un 1=0

            if (newEstudiante == 0) {
                const dataEstudiante = {
                    cursoMatricula: cursoMatricula, plnatelAnterior: plnatelAnterior,
                    id_paralelo: id_paralelo, id_persona: id_persona
                }
                const newMatricula_estudiante = await Matricula.create(dataEstudiante);

                // return res.json({ newMatricula_estudiante });
                if (newMatricula_estudiante) {
                    let id_materia;
                    let tipoCalificacion;
                    for (let i = 0; i < infoCurso.materia.length; i++) {
                        id_materia = infoCurso.materia[i].id;
                        tipoCalificacion = infoCurso.materia[i].tipoCalificacion;
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
                                console.log('2: ', infoCurso.nivelAcademico == 'Bachillerato')
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
                            } if (infoCurso.gradoAcademico == 10) {
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
                            }
                            else {
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
                //return res.json({ message: 'Se matriculo al estudiante' });
            } else {
                const dataEstudiante = {
                    id_paralelo: id_paralelo, id_persona: id_persona
                }
                const newMatricula_estudiante = await Matricula.create(dataEstudiante);
                if (newMatricula_estudiante) {
                    let id_materia;
                    let tipoCalificacion;
                    for (let i = 0; i < infoCurso.materia.length; i++) {
                        id_materia = infoCurso.materia[i].id;
                        tipoCalificacion = infoCurso.materia[i].tipoCalificacion;
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
                                console.log('2: ', infoCurso.nivelAcademico == 'Bachillerato')
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
                            } if (infoCurso.gradoAcademico == 10) {
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
                            }
                            else {
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
                    return res.json({ message: 'Ocurrio un problema 2' });
                }
                //return res.json({ message: 'Se matriculo al estudiante' });
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
        const { jornada, periodo, fechaInicio, fechaFin, modalidad, tipoCalificacion } = req.body;
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
        //console.log(contadorEstadoAnioLectivo)

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
                            const dataMateria_1 = {
                                area: 'Desarrollo Personal y Social',
                                nombre: 'Identidad y autonomía',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Desarrollo Personal y Social',
                                nombre: 'Convivencia',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Descubrimiento del Medio Natural y Cultural',
                                nombre: 'Relaciones con el Medio Natural y Cultural',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Descubrimiento del Medio Natural y Cultural',
                                nombre: 'Relaciones con el Medio Natural y Cultural',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Descubrimiento del Medio Natural y Cultural',
                                nombre: 'Relaciones Lógico / Matemáticas',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Expresión y Comunicación',
                                nombre: 'Comprensión y Expresión del Lenguaje',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Expresión y Comunicación',
                                nombre: 'Expresión Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Expresión y Comunicación',
                                nombre: 'Exploración Corporal y Motricidad',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);
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
                    if (bool2I == 0) {
                        const cursoData = {
                            nivelAcademico: 'Inicial 4 años',
                            gradoAcademico: '2',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        const id_curso = newCurso.id;

                        if (newCurso) {
                            const dataMateria_1 = {
                                area: 'Desarrollo Personal y Social',
                                nombre: 'Identidad y autonomía',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Desarrollo Personal y Social',
                                nombre: 'Convivencia',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Descubrimiento del Medio Natural y Cultural',
                                nombre: 'Relaciones con el Medio Natural y Cultural',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Descubrimiento del Medio Natural y Cultural',
                                nombre: 'Relaciones con el Medio Natural y Cultural',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Descubrimiento del Medio Natural y Cultural',
                                nombre: 'Relaciones Lógico / Matemáticas',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Expresión y Comunicación',
                                nombre: 'Comprensión y Expresión del Lenguaje',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Expresión y Comunicación',
                                nombre: 'Expresión Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Expresión y Comunicación',
                                nombre: 'Exploración Corporal y Motricidad',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);
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
                            const dataMateria_1 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Estudios Sociales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Ciencias Naturales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Animación a la lectura',
                                nombre: 'Animación a la lectura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Orientación vocacional y profesional',
                                nombre: 'Orientación vocacional y profesional',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo1B;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Estudios Sociales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Ciencias Naturales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Animación a la lectura',
                                nombre: 'Animación a la lectura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Orientación vocacional y profesional',
                                nombre: 'Orientación vocacional y profesional',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                        }
                        //res.json( newCurso);
                        const numeroParalelo = num_paralelo2B;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Estudios Sociales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Ciencias Naturales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Animación a la lectura',
                                nombre: 'Animación a la lectura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Orientación vocacional y profesional',
                                nombre: 'Orientación vocacional y profesional',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo3B;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Estudios Sociales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Ciencias Naturales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Animación a la lectura',
                                nombre: 'Animación a la lectura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Orientación vocacional y profesional',
                                nombre: 'Orientación vocacional y profesional',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo4B;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Estudios Sociales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Ciencias Naturales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Animación a la lectura',
                                nombre: 'Animación a la lectura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Orientación vocacional y profesional',
                                nombre: 'Orientación vocacional y profesional',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo5B;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Estudios Sociales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Ciencias Naturales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Animación a la lectura',
                                nombre: 'Animación a la lectura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Orientación vocacional y profesional',
                                nombre: 'Orientación vocacional y profesional',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo6B;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Estudios Sociales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Ciencias Naturales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Animación a la lectura',
                                nombre: 'Animación a la lectura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Orientación vocacional y profesional',
                                nombre: 'Orientación vocacional y profesional',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo7B;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Estudios Sociales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Ciencias Naturales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Animación a la lectura',
                                nombre: 'Animación a la lectura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Orientación vocacional y profesional',
                                nombre: 'Orientación vocacional y profesional',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo8B;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Estudios Sociales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Ciencias Naturales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Animación a la lectura',
                                nombre: 'Animación a la lectura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Orientación vocacional y profesional',
                                nombre: 'Orientación vocacional y profesional',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo9B;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Estudios Sociales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Ciencias Naturales',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Animación a la lectura',
                                nombre: 'Animación a la lectura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Orientación vocacional y profesional',
                                nombre: 'Orientación vocacional y profesional',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo10B;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Química',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Biología',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Historia',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Educación para la Ciudadanía',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Filosofía',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                            const dataMateria_11 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_11);

                            const dataMateria_12 = {
                                area: 'Módulo Interdisciplinar',
                                nombre: 'Emprendimiento y Gestión',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_12);

                            const dataMateria_13 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_13);

                            const dataMateria_14 = {
                                area: 'ASIGNATURAS OPTATIVAS ',
                                nombre: 'Investigación Ciencia y Tecnología',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_14);

                            const dataMateria_15 = {
                                area: 'ASIGNATURAS OPTATIVAS ',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_15);

                            const dataMateria_16 = {
                                area: 'ASIGNATURAS OPTATIVAS',
                                nombre: 'Lectura Crítica de Mensajes',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_16);
                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo1S;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Química',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Biología',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Historia',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Educación para la Ciudadanía',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Filosofía',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                            const dataMateria_11 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_11);

                            const dataMateria_12 = {
                                area: 'Módulo Interdisciplinar',
                                nombre: 'Emprendimiento y Gestión',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_12);

                            const dataMateria_13 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_13);

                            const dataMateria_14 = {
                                area: 'ASIGNATURAS OPTATIVAS ',
                                nombre: 'Investigación Ciencia y Tecnología',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_14);

                            const dataMateria_15 = {
                                area: 'ASIGNATURAS OPTATIVAS ',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_15);

                            const dataMateria_16 = {
                                area: 'ASIGNATURAS OPTATIVAS',
                                nombre: 'Lectura Crítica de Mensajes',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_16);
                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo2S;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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
                            const dataMateria_1 = {
                                area: 'Matemática',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_1);

                            const dataMateria_2 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_2);

                            const dataMateria_3 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Química',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_3);

                            const dataMateria_4 = {
                                area: 'Ciencias Naturales',
                                nombre: 'Biología',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_4);

                            const dataMateria_5 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Historia',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_5);

                            const dataMateria_6 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Educación para la Ciudadanía',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_6);

                            const dataMateria_7 = {
                                area: 'Ciencias Sociales',
                                nombre: 'Filosofía',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            Materia.create(dataMateria_7);

                            const dataMateria_8 = {
                                area: 'Lengua y Literatura',
                                nombre: 'Lengua y Literatura',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_8);

                            const dataMateria_9 = {
                                area: 'Lengua Extranjera',
                                nombre: 'Inglés',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_9);

                            const dataMateria_10 = {
                                area: 'Educación Cultural y Artística',
                                nombre: 'Educación Cultural y Artística',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_10);

                            const dataMateria_11 = {
                                area: 'Educación Física',
                                nombre: 'Educación Física',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_11);

                            const dataMateria_12 = {
                                area: 'Módulo Interdisciplinar',
                                nombre: 'Emprendimiento y Gestión',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_12);

                            const dataMateria_13 = {
                                area: 'Acompañamiento integral en el aula',
                                nombre: 'Acompañamiento integral en el aula',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_13);

                            const dataMateria_14 = {
                                area: 'ASIGNATURAS OPTATIVAS ',
                                nombre: 'Investigación Ciencia y Tecnología',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_14);

                            const dataMateria_15 = {
                                area: 'ASIGNATURAS OPTATIVAS ',
                                nombre: 'Matemática',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_15);

                            const dataMateria_16 = {
                                area: 'ASIGNATURAS OPTATIVAS',
                                nombre: 'Lectura Crítica de Mensajes',
                                tipoCalificacion: tipoCalificacion,
                                id_curso: id_curso
                            }
                            await Materia.create(dataMateria_16);
                        }
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo3S;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
                            //res.json(newParalelo);
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


    test: async (req, res) => {
        let { info } = req.body

        return res.json(info)


    },



    /**Fin funciones validadas */
}

module.exports = controller;
