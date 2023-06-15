'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");


const AnioLectivo = models.anioLectivo;
const Curso = models.curso;
const Paralelo = models.paralelo;
const Matricula = models.matricula;
const Materia = models.materia;

let controller = {
    /** Implementado try cath*/
    /**getAllAniosLectivos: Funcion get para obtener la lista de de años lesctivos
       * @param {*} req 
       * @param {*} res 
       * @returns Una lista en formato json de los anios lectivos registrados
       */
    getAllAniosLectivos: async (req, res) => {
        const aniosLectivos = await AnioLectivo.findAll({ include: [Curso] });
        console.log(aniosLectivos)

        return res.json({ aniosLectivos });
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
                        console.log('newCurso: ', newCurso);
                        //res.json(newCurso);
                        const numeroParalelo = num_paralelo1I;
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
                    if (bool2I == 0) {
                        const cursoData = {
                            nivelAcademico: 'Inicial 4 años',
                            gradoAcademico: '2',
                            id_anioLectivo: newAnioLectivo.id,
                        }
                        const newCurso = await Curso.create(cursoData);
                        console.log('newCurso: ', newCurso);
                        //res.json(newCurso);

                        const numeroParalelo = num_paralelo2I;
                        const startCharCode = 65; // Código ASCII de la letra 'A'
                        for (let i = 0; i < numeroParalelo; i++) {
                            const letra = String.fromCharCode(startCharCode + i);
                            const cursoData = {
                                titulo: letra,
                                id_curso: newCurso.id
                            }
                            const newParalelo = await Paralelo.create(cursoData);
                            console.log('newParalelo: ', newParalelo);
                            //res.json(newParalelo);

                            const matriculaData = {
                                id_paralelo: newParalelo.id,
                            }
                            const newMatricula = await Matricula.create(matriculaData);
                            console.log('newMatricula: ', newMatricula);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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
                        console.log('newCurso: ', newCurso);
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

                return res.json({ message: 'Se ha generado el año lectivo y La oferta académica exitosamente', newAnioLectivo });
            } else {
                return res.json({ message: 'Error, revise bien la información' });
            }
        } else {
            return res.json({ message: 'Ya existe un Año lectivo con estado activo' });
        }
    },
    /**Fin funciones validadas */
}

module.exports = controller;
