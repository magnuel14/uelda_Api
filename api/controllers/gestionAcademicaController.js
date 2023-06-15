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
        const aniosLectivos = await AnioLectivo.findAll();
        console.log(aniosLectivos)
        const cursos = await Curso.findAll(
            {
                include: [Cuenta],
                where: [{ id_anioLectivo: 4 }]
            });

        return res.json({ aniosLectivos, cursos });
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
        const newAnioLectivo = await AnioLectivo.create(anioLectivoData);
        //res.json(newAnioLectivo);

        console.log('newAnioLectivo: ', newAnioLectivo);
        //crear cursos
        const {
            boolInicial, boolPrimaria, boolSecundaria,
            bool1I, num_paralelo1I,
            bool2I, num_paralelo2I,
            bool1P, num_paralelo1P,
            bool2P, num_paralelo2P,
            bool3P, num_paralelo3P,
            bool4P, num_paralelo4P,
            bool5P, num_paralelo5P,
            bool6P, num_paralelo6P,
            bool7P, num_paralelo7P,
            bool8S, num_paralelo8S,
            bool9S, num_paralelo9S,
            bool10S, num_paralelo10S,
            bool1S, num_paralelo1S,
            bool2S, num_paralelo2S,
            bool3S, num_paralelo3S
        } = req.body;
        if (newAnioLectivo) {
            if (boolInicial == 0) {
                if (bool1I == 0) {
                    const cursoData = {
                        nivelAcademico: 'Inicial',
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
                        nivelAcademico: 'Inicial',
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
            if (boolPrimaria == 0) {
                if (bool1P == 0) {
                    const cursoData = {
                        nivelAcademico: 'Primaria',
                        gradoAcademico: '1',
                        id_anioLectivo: newAnioLectivo.id,
                    }
                    const newCurso = await Curso.create(cursoData);
                    console.log('newCurso: ', newCurso);
                    //res.json(newCurso);
                    const numeroParalelo = num_paralelo1P;
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

                if (bool2P == 0) {
                    const cursoData = {
                        nivelAcademico: 'Primaria',
                        gradoAcademico: '2',
                        id_anioLectivo: newAnioLectivo.id,
                    }
                    const newCurso = await Curso.create(cursoData);
                    console.log('newCurso: ', newCurso);
                    //res.json( newCurso);
                    const numeroParalelo = num_paralelo2P;
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

                if (bool3P == 0) {
                    const cursoData = {
                        nivelAcademico: 'Primaria',
                        gradoAcademico: '3',
                        id_anioLectivo: newAnioLectivo.id,
                    }
                    const newCurso = await Curso.create(cursoData);
                    console.log('newCurso: ', newCurso);
                    //res.json(newCurso);
                    const numeroParalelo = num_paralelo3P;
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

                if (bool4P == 0) {
                    const cursoData = {
                        nivelAcademico: 'Primaria',
                        gradoAcademico: '4',
                        id_anioLectivo: newAnioLectivo.id,
                    }
                    const newCurso = await Curso.create(cursoData);
                    console.log('newCurso: ', newCurso);
                    //res.json(newCurso);
                    const numeroParalelo = num_paralelo4P;
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

                if (bool5P == 0) {
                    const cursoData = {
                        nivelAcademico: 'Primaria',
                        gradoAcademico: '5',
                        id_anioLectivo: newAnioLectivo.id,
                    }
                    const newCurso = await Curso.create(cursoData);
                    console.log('newCurso: ', newCurso);
                    //res.json(newCurso);
                    const numeroParalelo = num_paralelo5P;
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

                if (bool6P == 0) {
                    const cursoData = {
                        nivelAcademico: 'Primaria',
                        gradoAcademico: '6',
                        id_anioLectivo: newAnioLectivo.id,
                    }
                    const newCurso = await Curso.create(cursoData);
                    console.log('newCurso: ', newCurso);
                    //res.json(newCurso);
                    const numeroParalelo = num_paralelo6P;
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

                if (bool7P == 0) {
                    const cursoData = {
                        nivelAcademico: 'Primaria',
                        gradoAcademico: '7',
                        id_anioLectivo: newAnioLectivo.id,
                    }
                    const newCurso = await Curso.create(cursoData);
                    console.log('newCurso: ', newCurso);
                    //res.json(newCurso);
                    const numeroParalelo = num_paralelo7P;
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
            if (boolSecundaria == 0) {
                if (bool8S == 0) {
                    const cursoData = {
                        nivelAcademico: 'Secundaria',
                        gradoAcademico: '8',
                        id_anioLectivo: newAnioLectivo.id,
                    }
                    const newCurso = await Curso.create(cursoData);
                    console.log('newCurso: ', newCurso);
                    //res.json(newCurso);
                    const numeroParalelo = num_paralelo8S;
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

                if (bool9S == 0) {
                    const cursoData = {
                        nivelAcademico: 'Secundaria',
                        gradoAcademico: '9',
                        id_anioLectivo: newAnioLectivo.id,
                    }
                    const newCurso = await Curso.create(cursoData);
                    console.log('newCurso: ', newCurso);
                    //res.json(newCurso);
                    const numeroParalelo = num_paralelo9S;
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

                if (bool10S == 0) {
                    const cursoData = {
                        nivelAcademico: 'Secundaria',
                        gradoAcademico: '10',
                        id_anioLectivo: newAnioLectivo.id,
                    }
                    const newCurso = await Curso.create(cursoData);
                    console.log('newCurso: ', newCurso);
                    //res.json(newCurso);
                    const numeroParalelo = num_paralelo10S;
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

                if (bool1S == 0) {
                    const cursoData = {
                        nivelAcademico: 'Secundaria',
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
                        nivelAcademico: 'Secundaria',
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
                        nivelAcademico: 'Secundaria',
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
            return res.json({ message: 'Se ha generado el Año Lectivo exitosamente' });
        } else {
            return res.json({ message: 'Revise bien su información' });

        }
    },
    /**Fin funciones validadas */
}

module.exports = controller;
