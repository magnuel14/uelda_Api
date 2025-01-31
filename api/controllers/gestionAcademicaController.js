"use strict";
const jwt = require("jsonwebtoken");
const models = require("../models");
const dotenv = require("dotenv");
dotenv.config();
const pdfGenerator = require("../../helpers/pdf-generator");
const fs = require("fs");

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
    const infoAnioLectivo = await AnioLectivo.findOne({
      where: {
        estadoAniolectivo: 0,
      },
    });
    const curso = await Curso.findAll({
      include: [Paralelo, Materia],
      where: { id_anioLectivo: infoAnioLectivo.id },
    });
    return res.json({ curso });
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  getCurso_byId: async (req, res) => {
    const { id_curso } = req.params;
    const curso = await Curso.findOne({
      where: { id: id_curso },
    });
    return res.json({ curso });
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  getParalelo_byId: async (req, res) => {
    const { id_paralelo } = req.params;
    const paralelo = await Paralelo.findOne({
      where: { id: id_paralelo },
    });
    return res.json({ paralelo });
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  getMateria_byId: async (req, res) => {
    const { id_materia } = req.params;
    const materia = await Materia.findAll({
      where: { id: id_materia },
    });
    return res.json({ materia });
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  matricularEstudiantes: async (req, res) => {

    console.log(req.body);
    let {
      lista_externalid_estudiantes,
      id_paralelo,
      periodo_academicos_Programados_inicial,
      periodo_academicos_Programados_preparatoria,
      periodo_academicos_Programados_elemental,
      periodo_academicos_Programados_media,
    } = req.body;
    const info_AnioLectivo = await AnioLectivo.findOne({
      where: { estadoAniolectivo: 0 },
    });
    console.log(info_AnioLectivo)

    const infoParalelo = await Paralelo.findOne({
      where: { id: id_paralelo },
    });
    console.log(infoParalelo)

    const infoCurso = await Curso.findOne({
      include: [Materia],
      where: { id: infoParalelo.id_curso },
    });
    console.log(infoCurso)

    for (let i = 0; i < lista_externalid_estudiantes.length; i++) {
      const { external_id } = lista_externalid_estudiantes[i];
      const infoEstudiante = await Persona.findOne({
        where: { external_id: external_id },
      });

      if (infoEstudiante.estadoAc !== "0" || infoEstudiante.estadoAc === null) {
        const data_newMatriculaEstudiante = {
          id_paralelo: id_paralelo,
          id_persona: infoEstudiante.id,
          id_anioLectivo_actual: info_AnioLectivo.id,
        };
        const dataEstadoAcademico = {
          estadoAc: "0",
        };

        await Persona.update(dataEstadoAcademico, {
          where: { id: infoEstudiante.id },
        });

        const newMatricula_estudiante = await Matricula.create(
          data_newMatriculaEstudiante
        );

        if (newMatricula_estudiante) {
          if (infoCurso.nivelAcademico == "Inicial 3 años") {
            const asistenciaXDia = {
              horasClase_programadas: periodo_academicos_Programados_inicial,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_matricula: newMatricula_estudiante.id,
            };
            await AsistenciaXDia.create(asistenciaXDia);
          }
          if (infoCurso.nivelAcademico == "Inicial 4 años") {
            const asistenciaXDia = {
              horasClase_programadas: periodo_academicos_Programados_inicial,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_matricula: newMatricula_estudiante.id,
            };
            await AsistenciaXDia.create(asistenciaXDia);
          }
          if (infoCurso.nivelAcademico == "Básica Preparatoria") {
            const asistenciaXDia = {
              horasClase_programadas:
                periodo_academicos_Programados_preparatoria,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_matricula: newMatricula_estudiante.id,
            };
            await AsistenciaXDia.create(asistenciaXDia);

            const info_materia_EF = await Materia.findOne({
              where: {
                nombre: "Educación Física",
                id_curso: infoCurso.id,
              },
            });
            const asistenciasXMateria_EF = {
              horasClase_programadas: info_materia_EF.horasClase_programadas,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_materia: info_materia_EF.id,
              id_matricula: newMatricula_estudiante.id,
            };

            await AsistenciaXMate.create(asistenciasXMateria_EF);
          }
          if (infoCurso.nivelAcademico == "Básica Elemental") {
            const asistenciaXDia = {
              horasClase_programadas: periodo_academicos_Programados_elemental,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_matricula: newMatricula_estudiante.id,
            };
            await AsistenciaXDia.create(asistenciaXDia);

            const info_materia_EF = await Materia.findOne({
              where: {
                nombre: "Educación Física",
                id_curso: infoCurso.id,
              },
            });
            const asistenciasXMateria_EF = {
              horasClase_programadas: info_materia_EF.horasClase_programadas,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_materia: info_materia_EF.id,
              id_matricula: newMatricula_estudiante.id,
            };

            await AsistenciaXMate.create(asistenciasXMateria_EF);

            const info_materia_EN = await Materia.findOne({
              where: {
                nombre: "Inglés",
                id_curso: infoCurso.id,
              },
            });
            const asistenciasXMateria_EN = {
              horasClase_programadas: info_materia_EN.horasClase_programadas,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_materia: info_materia_EN.id,
              id_matricula: newMatricula_estudiante.id,
            };

            await AsistenciaXMate.create(asistenciasXMateria_EN);
          }
          if (infoCurso.nivelAcademico == "Básica Media") {
            const asistenciaXDia = {
              horasClase_programadas: periodo_academicos_Programados_media,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_matricula: newMatricula_estudiante.id,
            };
            await AsistenciaXDia.create(asistenciaXDia);

            const info_materia_EF = await Materia.findOne({
              where: {
                nombre: "Educación Física",
                id_curso: infoCurso.id,
              },
            });
            const asistenciasXMateria_EF = {
              horasClase_programadas: info_materia_EF.horasClase_programadas,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_materia: info_materia_EF.id,
              id_matricula: newMatricula_estudiante.id,
            };

            await AsistenciaXMate.create(asistenciasXMateria_EF);

            const info_materia_EN = await Materia.findOne({
              where: {
                nombre: "Inglés",
                id_curso: infoCurso.id,
              },
            });
            const asistenciasXMateria_EN = {
              horasClase_programadas: info_materia_EN.horasClase_programadas,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_materia: info_materia_EN.id,
              id_matricula: newMatricula_estudiante.id,
            };

            await AsistenciaXMate.create(asistenciasXMateria_EN);
          } else if (
            infoCurso.nivelAcademico == "Básica Superior" ||
            infoCurso.nivelAcademico == "Bachillerato"
          ) {
            for (let i = 0; i < infoCurso.materia.length; i++) {
              const id_materia = infoCurso.materia[i].id;
              const infoMateria = await Materia.findOne({
                where: { id: id_materia },
              });

              const asistenciasXMateria = {
                horasClase_programadas: infoMateria.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: id_materia,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria);
            }
          }
          for (let i = 0; i < infoCurso.materia.length; i++) {
            const { tipoCalificacion } = infoCurso.materia[i];
            const id_materia = infoCurso.materia[i].id;
            if (tipoCalificacion == 0) {

              const dataCalificacionQ = {
                firstParcialPQ: 0,
                secondParcialPQ: 0,
                subTotalPQ: 0,
                testPQ: 0,
                totalPQ: 0,
                firstParcialSQ: 0,
                secondParcialSQ: 0,
                subTota2PQ: 0,
                testSQ: 0,
                totalSQ: 0,
                notaFinal: 0,
                aprobado: 1,
                id_materia: id_materia,
                id_matricula: newMatricula_estudiante.id,
              };
              await CalificacionQ.create(dataCalificacionQ);
            } else {
              if (
                (infoCurso.nivelAcademico == "Bachillerato" &&
                  infoCurso.gradoAcademico == 3) ||
                infoCurso.gradoAcademico == 10 ||
                infoCurso.gradoAcademico == 7
              ) {

                const dataCalificacionT = {

                  totalPrimerTriCuantity: 0,
                  totalPrimerTriQuality: 0,
                  totalSegundoTriCuantity: 0,
                  totalSegundoTriQuality: 0,
                  totalTercerTriCuantity: 0,
                  totalTercerTriQuality: 0,
                  proyectoFinalQuality: 0,
                  proyectoFinalCuantity: 0,

                  evaluacionNivelQuality: 0,
                  evaluacionNivelCuantity: 0,

                  total_Final: 0,
                  comportamiento: '',

                  aprobado: 1,
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };
                await CalificacionT.create(dataCalificacionT);
              } else {
                const dataCalificacionT = {
                  totalPrimerTriCuantity: 0,
                  totalPrimerTriQuality: 0,
                  totalSegundoTriCuantity: 0,
                  totalSegundoTriQuality: 0,
                  totalTercerTriCuantity: 0,
                  totalTercerTriQuality: 0,
                  proyectoFinalQuality: 0,
                  proyectoFinalCuantity: 0,

                  evaluacionNivelQuality: '-1',
                  evaluacionNivelCuantity: '-1',

                  total_Final: 0,
                  comportamiento: '',
                  aprobado: 1,
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };
                await CalificacionT.create(dataCalificacionT);
              }
            }
          }
        } else {
          return res.json({ message: "Ocurrio un problema" });
        }
      }
    }
    return res.json({ message: "Se matriculo el o los estudiante/s" });
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  updateMatriculaEstudiante: async (req, res) => {
    let {
      externalId,
      id_paralelo,
      periodo_academicos_Programados_inicial,
      periodo_academicos_Programados_preparatoria,
      periodo_academicos_Programados_elemental,
      periodo_academicos_Programados_media,
    } = req.body;
    const infoAnioActual = await AnioLectivo.findOne({
      where: { estadoAniolectivo: 0 },
    });
    const infoEstudianteUpdate = await Persona.findOne({
      where: {
        external_id: externalId,
        estadoAc: 0,
      },
    });

    if (infoEstudianteUpdate) {
      const infoMatricula = await Matricula.findOne({
        where: {
          id_persona: infoEstudianteUpdate.id,
          id_anioLectivo_actual: infoAnioActual.id,
        },
        include: [
          {
            model: AsistenciaXDia,
            attributes: ["id"],
          },
          {
            model: AsistenciaXMate,
            attributes: ["id"],
          },
          {
            model: CalificacionQ,
            attributes: ["id"],
          },
          {
            model: CalificacionT,
            attributes: ["id"],
          },
        ],
      });
      if (infoMatricula) {
        const asistenciaXMates = infoMatricula.dataValues.asistenciaXMates;
        const calificacionTs = infoMatricula.dataValues.calificacionTs;
        const calificacionQs = infoMatricula.dataValues.calificacionQs;

        if (asistenciaXMates) {
          for (let i = 0; i < asistenciaXMates.length; i++) {
            const { id } = asistenciaXMates[i];
            await AsistenciaXMate.destroy({
              where: { id: id },
            });
          }
        }

        if (infoMatricula.asistenciaXDia) {
          await AsistenciaXDia.destroy({
            where: {
              id: infoMatricula.asistenciaXDia[0].dataValues.id,
            },
          });
        }

        if (calificacionTs) {
          for (let i = 0; i < calificacionTs.length; i++) {
            const { id } = calificacionTs[i];
            await CalificacionT.destroy({
              where: { id: id },
            });
          }
        }

        if (calificacionQs) {
          for (let i = 0; i < calificacionQs.length; i++) {
            const { id } = calificacionQs[i];
            await CalificacionQ.destroy({
              where: { id: id },
            });
          }
        }

        if (infoMatricula) {
          await Matricula.destroy({
            where: {
              id: infoMatricula.id,
            },
          });
        }
        const dataPersona = {
          estadoAc: 4,
        };
        await Persona.update(dataPersona, {
          where: { external_id: externalId },
        });

        const infoParalelo = await Paralelo.findOne({
          where: { id: id_paralelo },
        });

        const infoCurso = await Curso.findOne({
          include: [Materia],
          where: { id: infoParalelo.id_curso },
        });

        if (
          infoEstudianteUpdate.estadoAc !== "0" ||
          infoEstudianteUpdate.estadoAc === null
        ) {
          const data_newMatriculaEstudiante = {
            id_paralelo: id_paralelo,
            id_persona: infoEstudianteUpdate.id,
            id_anioLectivo_actual: infoAnioActual.id,
          };
          const dataEstadoAcademico = {
            estadoAc: "0",
          };

          await Persona.update(dataEstadoAcademico, {
            where: { id: infoEstudianteUpdate.id },
          });

          const newMatricula_estudiante = await Matricula.create(
            data_newMatriculaEstudiante
          );

          if (newMatricula_estudiante) {
            if (infoCurso.nivelAcademico == "Inicial 3 años") {
              const asistenciaXDia = {
                horasClase_programadas: periodo_academicos_Programados_inicial,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);
            }
            if (infoCurso.nivelAcademico == "Inicial 4 años") {
              const asistenciaXDia = {
                horasClase_programadas: periodo_academicos_Programados_inicial,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);
            }
            if (infoCurso.nivelAcademico == "Básica Preparatoria") {
              const asistenciaXDia = {
                horasClase_programadas:
                  periodo_academicos_Programados_preparatoria,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);

              const info_materia_EF = await Materia.findOne({
                where: {
                  nombre: "Educación Física",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EF = {
                horasClase_programadas: info_materia_EF.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EF.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EF);
            }
            if (infoCurso.nivelAcademico == "Básica Elemental") {
              const asistenciaXDia = {
                horasClase_programadas:
                  periodo_academicos_Programados_elemental,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);

              const info_materia_EF = await Materia.findOne({
                where: {
                  nombre: "Educación Física",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EF = {
                horasClase_programadas: info_materia_EF.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EF.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EF);

              const info_materia_EN = await Materia.findOne({
                where: {
                  nombre: "Inglés",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EN = {
                horasClase_programadas: info_materia_EN.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EN.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EN);
            }
            if (infoCurso.nivelAcademico == "Básica Media") {
              const asistenciaXDia = {
                horasClase_programadas: periodo_academicos_Programados_media,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);

              const info_materia_EF = await Materia.findOne({
                where: {
                  nombre: "Educación Física",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EF = {
                horasClase_programadas: info_materia_EF.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EF.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EF);

              const info_materia_EN = await Materia.findOne({
                where: {
                  nombre: "Inglés",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EN = {
                horasClase_programadas: info_materia_EN.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EN.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EN);
            } else if (
              infoCurso.nivelAcademico == "Básica Superior" ||
              infoCurso.nivelAcademico == "Bachillerato"
            ) {
              for (let i = 0; i < infoCurso.materia.length; i++) {
                const id_materia = infoCurso.materia[i].id;
                const infoMateria = await Materia.findOne({
                  where: { id: id_materia },
                });

                const asistenciasXMateria = {
                  horasClase_programadas: infoMateria.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria);
              }
            }
            for (let i = 0; i < infoCurso.materia.length; i++) {
              const { tipoCalificacion } = infoCurso.materia[i];
              const id_materia = infoCurso.materia[i].id;
              if (tipoCalificacion == 0) {
                const dataCalificacionQ = {
                  firstParcialPQ: 0,
                  secondParcialPQ: 0,
                  subTotalPQ: 0,
                  testPQ: 0,
                  totalPQ: 0,
                  firstParcialSQ: 0,
                  secondParcialSQ: 0,
                  subTota2PQ: 0,
                  testSQ: 0,
                  totalSQ: 0,
                  notaFinal: 0,
                  aprobado: 1,
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };
                await CalificacionQ.create(dataCalificacionQ);
              } else {
                if (
                  (infoCurso.nivelAcademico == "Bachillerato" &&
                    infoCurso.gradoAcademico == 3) ||
                  infoCurso.gradoAcademico == 10 ||
                  infoCurso.gradoAcademico == 7
                ) {
                  const dataCalificacionT = {
                    aportesPrimerTimestre: 0,
                    proIntegradorFase_1: 0,
                    evaluacion_estructurada_1: 0,
                    aportesSegundoTimestre: 0,
                    proIntegradorFase_2: 0,
                    evaluacion_estructurada_2: 0,
                    aportesTercerTimestre: 0,
                    proIntegradorFase_3: 0,
                    evaluacion_estructurada_3: 0,
                    proyecto_Final: 0,
                    evaluacion_nivel: 0,
                    total_Final: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionT.create(dataCalificacionT);
                } else {
                  const dataCalificacionT = {
                    aportesPrimerTimestre: 0,
                    proIntegradorFase_1: 0,
                    evaluacion_estructurada_1: 0,
                    aportesSegundoTimestre: 0,
                    proIntegradorFase_2: 0,
                    evaluacion_estructurada_2: 0,
                    aportesTercerTimestre: 0,
                    proIntegradorFase_3: 0,
                    evaluacion_estructurada_3: 0,
                    proyecto_Final: 0,
                    evaluacion_nivel: 0,
                    total_Final: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionT.create(dataCalificacionT);
                }
              }
            }
          } else {
            return res.json({ message: "Ocurrio un problema" });
          }
        }

        const cursoNivel = infoCurso.nivelAcademico;
        const cursoGrado = infoCurso.gradoAcademico;
        const paraleloTitulo = infoParalelo.titulo;
        const estudianteName = infoEstudianteUpdate.nombre;
        const estudianteLastName = infoEstudianteUpdate.apellido;

        return res.json({
          message: `Se cambio al estudiante: ${estudianteLastName} ${estudianteName}, al curso: ${cursoGrado} de ${cursoNivel}, paralelo: ${paraleloTitulo}.`,
        });
      } else {
        return res.json({
          message:
            "Ha ocurrido un error, el estudiante no tiene una matricula actual.",
        });
      }
    } else {
      return res.json({
        message: "Ha ocurrido un error, no existe el estudiante.",
      });
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  promoverEstudiantes: async (req, res) => {
    //let { lista_externalid_estudiantes, horasClase_programadas } = req.body
    const { externalId_anioLectivo } = req.body;

    const info_anioLectivo_anterior = await AnioLectivo.findOne({
      include: [Curso],
      where: {
        external_id: externalId_anioLectivo,
      },
    });
    const list_Estudiantes = await Persona.findAll({ where: { id_rol: "6" } });
    const infoAnioActual = await AnioLectivo.findOne({
      where: { estadoAniolectivo: 0 },
    });

    for (let i = 0; i < list_Estudiantes.length; i++) {
      const estadoAc = list_Estudiantes[i].estadoAc;
      const id_persona = list_Estudiantes[i].id;

      //estudiante promovido
      if (estadoAc == "1") {
        const list_matricula = await Matricula.findOne({
          where: {
            id_persona: id_persona,
            id_anioLectivo_actual: info_anioLectivo_anterior.id,
          },
        });

        const id_paralelo = list_matricula.id_paralelo;
        const info_paralelo = await Paralelo.findOne({
          where: { id: id_paralelo },
        });
        const info_curso = await Curso.findOne({
          where: { id: info_paralelo.id_curso },
        });

        if (info_curso.id_anioLectivo == info_anioLectivo_anterior.id) {
          const info_newAnioLectivo = await AnioLectivo.findOne({
            where: { estadoAniolectivo: "0" },
          });

          if (info_curso.nivelAcademico == "Inicial 3 años") {
            const info_curso_matricula = await Curso.findOne({
              where: {
                nivelAcademico: "Inicial 4 años",
                id_anioLectivo: info_newAnioLectivo.id,
              },
            });

            const info_paralelo_matricula = await Paralelo.findOne({
              where: {
                titulo: info_paralelo.titulo,
                id_curso: info_curso_matricula.id,
              },
            });

            const data_newMatriculaEstudiante = {
              id_paralelo: info_paralelo_matricula.id,
              id_persona: id_persona,
              id_anioLectivo_actual: info_AnioLectivo.id,
            };

            const dataEstadoAcademico = {
              estadoAc: "0",
            };

            await Persona.update(dataEstadoAcademico, {
              where: { id: id_persona },
            });

            const newMatricula_estudiante = await Matricula.create(
              data_newMatriculaEstudiante
            );

            const infoCurso = await Curso.findOne({
              include: [Materia],
              where: { id: info_paralelo_matricula.id_curso },
            });

            const asistenciaXDia = {
              horasClase_programadas: "900",
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_matricula: newMatricula_estudiante.id,
            };
            await AsistenciaXDia.create(asistenciaXDia);

            for (let i = 0; i < infoCurso.materia.length; i++) {
              const id_materia = infoCurso.materia[i].id;
              const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

              await Materia.findOne({ where: { id: id_materia } });

              if (tipoCalificacion == 0) {
                const dataCalificacionQ = {
                  firstParcialPQ: 0,
                  secondParcialPQ: 0,
                  subTotalPQ: 0,
                  testPQ: 0,
                  totalPQ: 0,
                  firstParcialSQ: 0,
                  secondParcialSQ: 0,
                  subTota2PQ: 0,
                  testSQ: 0,
                  totalSQ: 0,
                  notaFinal: 0,
                  aprobado: 1,
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };
                await CalificacionQ.create(dataCalificacionQ);
              } else {
                const dataCalificacionT = {
                  aportesPrimerTimestre: 0,
                  proIntegradorFase_1: 0,
                  evaluacion_estructurada_1: 0,
                  aportesSegundoTimestre: 0,
                  proIntegradorFase_2: 0,
                  evaluacion_estructurada_2: 0,
                  aportesTercerTimestre: 0,
                  proIntegradorFase_3: 0,
                  evaluacion_estructurada_3: 0,
                  proyecto_Final: 0,
                  total_Final: 0,
                  aprobado: 1,
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };
                await CalificacionT.create(dataCalificacionT);
              }
            }
          }
          if (info_curso.nivelAcademico == "Inicial 4 años") {
            const info_curso_matricula = await Curso.findOne({
              where: {
                nivelAcademico: "Básica Preparatoria",
                id_anioLectivo: info_newAnioLectivo.id,
              },
            });

            const info_paralelo_matricula = await Paralelo.findOne({
              where: {
                titulo: info_paralelo.titulo,
                id_curso: info_curso_matricula.id,
              },
            });

            const data_newMatriculaEstudiante = {
              id_paralelo: info_paralelo_matricula.id,
              id_persona: id_persona,
              id_anioLectivo_actual: info_AnioLectivo.id,
            };

            const dataEstadoAcademico = {
              estadoAc: "0",
            };

            await Persona.update(dataEstadoAcademico, {
              where: { id: id_persona },
            });

            const newMatricula_estudiante = await Matricula.create(
              data_newMatriculaEstudiante
            );

            const infoCurso = await Curso.findOne({
              include: [Materia],
              where: { id: info_paralelo_matricula.id_curso },
            });

            const asistenciaXDia = {
              periodo_academicos_Programados: "972",
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_matricula: newMatricula_estudiante.id,
            };
            await AsistenciaXDia.create(asistenciaXDia);

            const info_materia_EF = await Materia.findOne({
              where: {
                nombre: "Educación Física",
                id_curso: infoCurso.id,
              },
            });
            const asistenciasXMateria_EF = {
              horasClase_programadas: info_materia_EF.horasClase_programadas,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_materia: info_materia_EF.id,
              id_matricula: newMatricula_estudiante.id,
            };

            await AsistenciaXMate.create(asistenciasXMateria_EF);

            for (let i = 0; i < infoCurso.materia.length; i++) {
              const id_materia = infoCurso.materia[i].id;
              const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

              await Materia.findOne({ where: { id: id_materia } });

              if (tipoCalificacion == 0) {
                const dataCalificacionQ = {
                  firstParcialPQ: 0,
                  secondParcialPQ: 0,
                  subTotalPQ: 0,
                  testPQ: 0,
                  totalPQ: 0,
                  firstParcialSQ: 0,
                  secondParcialSQ: 0,
                  subTota2PQ: 0,
                  testSQ: 0,
                  totalSQ: 0,
                  notaFinal: 0,
                  aprobado: 1,
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };
                await CalificacionQ.create(dataCalificacionQ);
              } else {
                const dataCalificacionT = {
                  aportesPrimerTimestre: 0,
                  proIntegradorFase_1: 0,
                  evaluacion_estructurada_1: 0,
                  aportesSegundoTimestre: 0,
                  proIntegradorFase_2: 0,
                  evaluacion_estructurada_2: 0,
                  aportesTercerTimestre: 0,
                  proIntegradorFase_3: 0,
                  evaluacion_estructurada_3: 0,
                  proyecto_Final: 0,
                  total_Final: 0,
                  aprobado: 1,
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };
                await CalificacionT.create(dataCalificacionT);
              }
            }
          }
          if (info_curso.nivelAcademico == "Básica Preparatoria") {
            const info_curso_matricula = await Curso.findOne({
              where: {
                nivelAcademico: "Básica Elemental",
                gradoAcademico: "2",
                id_anioLectivo: info_newAnioLectivo.id,
              },
            });

            const info_paralelo_matricula = await Paralelo.findOne({
              where: {
                titulo: info_paralelo.titulo,
                id_curso: info_curso_matricula.id,
              },
            });

            const data_newMatriculaEstudiante = {
              id_paralelo: info_paralelo_matricula.id,
              id_persona: id_persona,
              id_anioLectivo_actual: info_AnioLectivo.id,
            };

            const dataEstadoAcademico = {
              estadoAc: "0",
            };

            await Persona.update(dataEstadoAcademico, {
              where: { id: id_persona },
            });

            const newMatricula_estudiante = await Matricula.create(
              data_newMatriculaEstudiante
            );

            const infoCurso = await Curso.findOne({
              include: [Materia],
              where: { id: info_paralelo_matricula.id_curso },
            });

            const asistenciaXDia = {
              horasClase_programadas: "864",
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_matricula: newMatricula_estudiante.id,
            };
            await AsistenciaXDia.create(asistenciaXDia);

            const info_materia_EF = await Materia.findOne({
              where: {
                nombre: "Educación Física",
                id_curso: infoCurso.id,
              },
            });
            const asistenciasXMateria_EF = {
              horasClase_programadas: info_materia_EF.horasClase_programadas,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_materia: info_materia_EF.id,
              id_matricula: newMatricula_estudiante.id,
            };

            await AsistenciaXMate.create(asistenciasXMateria_EF);

            const info_materia_EN = await Materia.findOne({
              where: {
                nombre: "Inglés",
                id_curso: infoCurso.id,
              },
            });
            const asistenciasXMateria_EN = {
              horasClase_programadas: info_materia_EN.horasClase_programadas,
              horasClase_dictadas: "0",
              horasClase_asistidas: "0",
              id_materia: info_materia_EN.id,
              id_matricula: newMatricula_estudiante.id,
            };

            await AsistenciaXMate.create(asistenciasXMateria_EN);

            for (let i = 0; i < infoCurso.materia.length; i++) {
              const id_materia = infoCurso.materia[i].id;
              const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

              await Materia.findOne({ where: { id: id_materia } });

              if (tipoCalificacion == 0) {
                const dataCalificacionQ = {
                  firstParcialPQ: 0,
                  secondParcialPQ: 0,
                  subTotalPQ: 0,
                  testPQ: 0,
                  totalPQ: 0,
                  firstParcialSQ: 0,
                  secondParcialSQ: 0,
                  subTota2PQ: 0,
                  testSQ: 0,
                  totalSQ: 0,
                  notaFinal: 0,
                  aprobado: 1,
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };
                await CalificacionQ.create(dataCalificacionQ);
              } else {
                const dataCalificacionT = {
                  aportesPrimerTimestre: 0,
                  proIntegradorFase_1: 0,
                  evaluacion_estructurada_1: 0,
                  aportesSegundoTimestre: 0,
                  proIntegradorFase_2: 0,
                  evaluacion_estructurada_2: 0,
                  aportesTercerTimestre: 0,
                  proIntegradorFase_3: 0,
                  evaluacion_estructurada_3: 0,
                  proyecto_Final: 0,
                  total_Final: 0,
                  aprobado: 1,
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };
                await CalificacionT.create(dataCalificacionT);
              }
            }
          }
          if (info_curso.nivelAcademico == "Básica Elemental") {
            if (info_curso.gradoAcademico == 2) {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Básica Elemental",
                  gradoAcademico: "3",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              const asistenciaXDia = {
                horasClase_programadas: "864",
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);

              const info_materia_EF = await Materia.findOne({
                where: {
                  nombre: "Educación Física",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EF = {
                horasClase_programadas: info_materia_EF.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EF.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EF);

              const info_materia_EN = await Materia.findOne({
                where: {
                  nombre: "Inglés",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EN = {
                horasClase_programadas: info_materia_EN.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EN.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EN);

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const id_materia = infoCurso.materia[i].id;
                const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                await Materia.findOne({ where: { id: id_materia } });

                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  const dataCalificacionT = {
                    aportesPrimerTimestre: 0,
                    proIntegradorFase_1: 0,
                    evaluacion_estructurada_1: 0,
                    aportesSegundoTimestre: 0,
                    proIntegradorFase_2: 0,
                    evaluacion_estructurada_2: 0,
                    aportesTercerTimestre: 0,
                    proIntegradorFase_3: 0,
                    evaluacion_estructurada_3: 0,
                    proyecto_Final: 0,
                    total_Final: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionT.create(dataCalificacionT);
                }
              }
            }
            if (info_curso.gradoAcademico == 3) {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Básica Elemental",
                  gradoAcademico: "4",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              const asistenciaXDia = {
                horasClase_programadas: "864",
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);

              const info_materia_EF = await Materia.findOne({
                where: {
                  nombre: "Educación Física",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EF = {
                horasClase_programadas: info_materia_EF.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EF.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EF);

              const info_materia_EN = await Materia.findOne({
                where: {
                  nombre: "Inglés",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EN = {
                horasClase_programadas: info_materia_EN.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EN.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EN);

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const id_materia = infoCurso.materia[i].id;
                const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                await Materia.findOne({ where: { id: id_materia } });

                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  const dataCalificacionT = {
                    aportesPrimerTimestre: 0,
                    proIntegradorFase_1: 0,
                    evaluacion_estructurada_1: 0,
                    aportesSegundoTimestre: 0,
                    proIntegradorFase_2: 0,
                    evaluacion_estructurada_2: 0,
                    aportesTercerTimestre: 0,
                    proIntegradorFase_3: 0,
                    evaluacion_estructurada_3: 0,
                    proyecto_Final: 0,
                    total_Final: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionT.create(dataCalificacionT);
                }
              }
            }
            if (info_curso.gradoAcademico == 4) {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Básica Media",
                  gradoAcademico: "5",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              const asistenciaXDia = {
                horasClase_programadas: "864",
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);

              const info_materia_EF = await Materia.findOne({
                where: {
                  nombre: "Educación Física",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EF = {
                horasClase_programadas: info_materia_EF.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EF.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EF);

              const info_materia_EN = await Materia.findOne({
                where: {
                  nombre: "Inglés",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EN = {
                horasClase_programadas: info_materia_EN.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EN.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EN);

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const id_materia = infoCurso.materia[i].id;
                const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                await Materia.findOne({ where: { id: id_materia } });

                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  const dataCalificacionT = {
                    aportesPrimerTimestre: 0,
                    proIntegradorFase_1: 0,
                    evaluacion_estructurada_1: 0,
                    aportesSegundoTimestre: 0,
                    proIntegradorFase_2: 0,
                    evaluacion_estructurada_2: 0,
                    aportesTercerTimestre: 0,
                    proIntegradorFase_3: 0,
                    evaluacion_estructurada_3: 0,
                    proyecto_Final: 0,
                    total_Final: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionT.create(dataCalificacionT);
                }
              }
            }
          }
          if (info_curso.nivelAcademico == "Básica Media") {
            if (info_curso.gradoAcademico == 5) {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Básica Media",
                  gradoAcademico: "6",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              const asistenciaXDia = {
                horasClase_programadas: "864",
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);

              const info_materia_EF = await Materia.findOne({
                where: {
                  nombre: "Educación Física",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EF = {
                horasClase_programadas: info_materia_EF.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EF.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EF);

              const info_materia_EN = await Materia.findOne({
                where: {
                  nombre: "Inglés",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EN = {
                horasClase_programadas: info_materia_EN.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EN.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EN);

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const id_materia = infoCurso.materia[i].id;
                const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                await Materia.findOne({ where: { id: id_materia } });

                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  const dataCalificacionT = {
                    aportesPrimerTimestre: 0,
                    proIntegradorFase_1: 0,
                    evaluacion_estructurada_1: 0,
                    aportesSegundoTimestre: 0,
                    proIntegradorFase_2: 0,
                    evaluacion_estructurada_2: 0,
                    aportesTercerTimestre: 0,
                    proIntegradorFase_3: 0,
                    evaluacion_estructurada_3: 0,
                    proyecto_Final: 0,
                    total_Final: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionT.create(dataCalificacionT);
                }
              }
            }
            if (info_curso.gradoAcademico == 6) {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Básica Media",
                  gradoAcademico: "7",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const dataEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
              };
              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                dataEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              const asistenciaXDia = {
                horasClase_programadas: "864",
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);

              const info_materia_EF = await Materia.findOne({
                where: {
                  nombre: "Educación Física",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EF = {
                horasClase_programadas: info_materia_EF.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EF.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EF);

              const info_materia_EN = await Materia.findOne({
                where: {
                  nombre: "Inglés",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EN = {
                horasClase_programadas: info_materia_EN.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EN.id,
                id_matricula: newMatricula_estudiante.id,
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
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  const dataCalificacionT = {
                    aportesPrimerTimestre: 0,
                    proIntegradorFase_1: 0,
                    evaluacion_estructurada_1: 0,
                    aportesSegundoTimestre: 0,
                    proIntegradorFase_2: 0,
                    evaluacion_estructurada_2: 0,
                    aportesTercerTimestre: 0,
                    proIntegradorFase_3: 0,
                    evaluacion_estructurada_3: 0,
                    proyecto_Final: 0,
                    total_Final: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionT.create(dataCalificacionT);
                }
              }
            }
            if (info_curso.gradoAcademico == 7) {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Básica Superior",
                  gradoAcademico: "8",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const dataEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
              };
              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                dataEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const { tipoCalificacion } = infoCurso.materia[i];
                const id_materia = infoCurso.materia[i].id;
                const infoMateria = await Materia.findOne({
                  where: { id: id_materia },
                });

                const asistenciasXMateria = {
                  horasClase_programadas: infoMateria.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria);

                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  if (
                    (infoCurso.nivelAcademico == "Bachillerato" &&
                      infoCurso.gradoAcademico == 3) ||
                    infoCurso.gradoAcademico == 10 ||
                    infoCurso.gradoAcademico == 7
                  ) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
            }
          }
          if (info_curso.nivelAcademico == "Básica Superior") {
            if (info_curso.gradoAcademico == 8) {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Básica Superior",
                  gradoAcademico: "9",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const { tipoCalificacion } = infoCurso.materia[i];
                const id_materia = infoCurso.materia[i].id;
                const infoMateria = await Materia.findOne({
                  where: { id: id_materia },
                });

                const asistenciasXMateria = {
                  horasClase_programadas: infoMateria.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria);

                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  if (
                    (infoCurso.nivelAcademico == "Bachillerato" &&
                      infoCurso.gradoAcademico == 3) ||
                    infoCurso.gradoAcademico == 10 ||
                    infoCurso.gradoAcademico == 7
                  ) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
            }
            if (info_curso.gradoAcademico == 9) {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Básica Superior",
                  gradoAcademico: "10",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const id_materia = infoCurso.materia[i].id;
                const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                const infoMateria = await Materia.findOne({
                  where: { id: id_materia },
                });

                if (infoCurso.nivelAcademico == "Básica Superior") {
                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await AsistenciaXMate.create(asistenciasXMateria);
                }
                if (infoCurso.nivelAcademico == "Bachillerato") {
                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await AsistenciaXMate.create(asistenciasXMateria);
                }
                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  if (infoCurso.gradoAcademico == 3) {
                    //console.log('2: ', infoCurso.nivelAcademico == 'Bachillerato')
                    if (infoCurso.nivelAcademico == "Bachillerato") {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    }
                  }
                  if (infoCurso.gradoAcademico == 10) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                  if (infoCurso.gradoAcademico == 7) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
            }
            if (info_curso.gradoAcademico == 10) {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Bachillerato",
                  gradoAcademico: "1",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const id_materia = infoCurso.materia[i].id;
                const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                const infoMateria = await Materia.findOne({
                  where: { id: id_materia },
                });

                if (infoCurso.nivelAcademico == "Básica Superior") {
                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await AsistenciaXMate.create(asistenciasXMateria);
                }
                if (infoCurso.nivelAcademico == "Bachillerato") {
                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await AsistenciaXMate.create(asistenciasXMateria);
                }
                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  if (infoCurso.gradoAcademico == 3) {
                    //console.log('2: ', infoCurso.nivelAcademico == 'Bachillerato')
                    if (infoCurso.nivelAcademico == "Bachillerato") {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    }
                  }
                  if (infoCurso.gradoAcademico == 10) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                  if (infoCurso.gradoAcademico == 7) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
            }
          }
          if (info_curso.nivelAcademico == "Bachillerato") {
            if (info_curso.gradoAcademico == 1) {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Bachillerato",
                  gradoAcademico: "2",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const { tipoCalificacion } = infoCurso.materia[i];
                const id_materia = infoCurso.materia[i].id;
                const infoMateria = await Materia.findOne({
                  where: { id: id_materia },
                });

                const asistenciasXMateria = {
                  horasClase_programadas: infoMateria.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria);

                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  if (
                    (infoCurso.nivelAcademico == "Bachillerato" &&
                      infoCurso.gradoAcademico == 3) ||
                    infoCurso.gradoAcademico == 10 ||
                    infoCurso.gradoAcademico == 7
                  ) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
            }
            if (info_curso.gradoAcademico == 2) {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Bachillerato",
                  gradoAcademico: "3",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const { tipoCalificacion } = infoCurso.materia[i];
                const id_materia = infoCurso.materia[i].id;
                const infoMateria = await Materia.findOne({
                  where: { id: id_materia },
                });

                const asistenciasXMateria = {
                  horasClase_programadas: infoMateria.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: id_materia,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria);

                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  if (
                    (infoCurso.nivelAcademico == "Bachillerato" &&
                      infoCurso.gradoAcademico == 3) ||
                    infoCurso.gradoAcademico == 10 ||
                    infoCurso.gradoAcademico == 7
                  ) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
            }
          }
        }
      }
      //estudiante no promovido
      else if (estadoAc == "2") {
        const list_matricula = await Matricula.findAll({
          where: { id_persona: id_persona },
        });
        for (let j = 0; j < list_matricula.length; j++) {
          const id_paralelo = list_matricula[j].id_paralelo;
          const info_paralelo = await Paralelo.findOne({
            where: { id: id_paralelo },
          });
          const info_curso = await Curso.findOne({
            where: { id: info_paralelo.id_curso },
          });

          if (info_curso.id_anioLectivo == info_anioLectivo.id) {
            const info_newAnioLectivo = await AnioLectivo.findOne({
              where: { estadoAniolectivo: "0" },
            });

            if (info_curso.nivelAcademico == "Inicial 3 años") {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Inicial 3 años",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              const asistenciaXDia = {
                horasClase_programadas: "900",
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const id_materia = infoCurso.materia[i].id;
                const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                const infoMateria = await Materia.findOne({
                  where: { id: id_materia },
                });

                if (infoCurso.nivelAcademico == "Básica Superior") {
                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await AsistenciaXMate.create(asistenciasXMateria);
                }
                if (infoCurso.nivelAcademico == "Bachillerato") {
                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await AsistenciaXMate.create(asistenciasXMateria);
                }
                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  if (infoCurso.gradoAcademico == 3) {
                    //console.log('2: ', infoCurso.nivelAcademico == 'Bachillerato')
                    if (infoCurso.nivelAcademico == "Bachillerato") {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    }
                  }
                  if (infoCurso.gradoAcademico == 10) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                  if (infoCurso.gradoAcademico == 7) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
            }
            if (info_curso.nivelAcademico == "Inicial 4 años") {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Inicial 4 años",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              const asistenciaXDia = {
                horasClase_programadas: "900",
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const id_materia = infoCurso.materia[i].id;
                const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                const infoMateria = await Materia.findOne({
                  where: { id: id_materia },
                });

                if (infoCurso.nivelAcademico == "Básica Superior") {
                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await AsistenciaXMate.create(asistenciasXMateria);
                }
                if (infoCurso.nivelAcademico == "Bachillerato") {
                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await AsistenciaXMate.create(asistenciasXMateria);
                }
                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  if (infoCurso.gradoAcademico == 3) {
                    //console.log('2: ', infoCurso.nivelAcademico == 'Bachillerato')
                    if (infoCurso.nivelAcademico == "Bachillerato") {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    }
                  }
                  if (infoCurso.gradoAcademico == 10) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                  if (infoCurso.gradoAcademico == 7) {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      evaluacion_nivel: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
            }
            if (info_curso.nivelAcademico == "Básica Preparatoria") {
              const info_curso_matricula = await Curso.findOne({
                where: {
                  nivelAcademico: "Básica Preparatoria",
                  id_anioLectivo: info_newAnioLectivo.id,
                },
              });

              const info_paralelo_matricula = await Paralelo.findOne({
                where: {
                  titulo: info_paralelo.titulo,
                  id_curso: info_curso_matricula.id,
                },
              });

              const data_newMatriculaEstudiante = {
                id_paralelo: info_paralelo_matricula.id,
                id_persona: id_persona,
                id_anioLectivo_actual: info_AnioLectivo.id,
              };

              const dataEstadoAcademico = {
                estadoAc: "0",
              };

              await Persona.update(dataEstadoAcademico, {
                where: { id: id_persona },
              });

              const newMatricula_estudiante = await Matricula.create(
                data_newMatriculaEstudiante
              );

              const infoCurso = await Curso.findOne({
                include: [Materia],
                where: { id: info_paralelo_matricula.id_curso },
              });

              const asistenciaXDia = {
                periodo_academicos_Programados: "972",
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_matricula: newMatricula_estudiante.id,
              };
              await AsistenciaXDia.create(asistenciaXDia);

              const info_materia_EF = await Materia.findOne({
                where: {
                  nombre: "Educación Física",
                  id_curso: infoCurso.id,
                },
              });
              const asistenciasXMateria_EF = {
                horasClase_programadas: info_materia_EF.horasClase_programadas,
                horasClase_dictadas: "0",
                horasClase_asistidas: "0",
                id_materia: info_materia_EF.id,
                id_matricula: newMatricula_estudiante.id,
              };

              await AsistenciaXMate.create(asistenciasXMateria_EF);

              for (let i = 0; i < infoCurso.materia.length; i++) {
                const id_materia = infoCurso.materia[i].id;
                const tipoCalificacion = infoCurso.materia[i].tipoCalificacion;

                await Materia.findOne({ where: { id: id_materia } });

                if (tipoCalificacion == 0) {
                  const dataCalificacionQ = {
                    firstParcialPQ: 0,
                    secondParcialPQ: 0,
                    subTotalPQ: 0,
                    testPQ: 0,
                    totalPQ: 0,
                    firstParcialSQ: 0,
                    secondParcialSQ: 0,
                    subTota2PQ: 0,
                    testSQ: 0,
                    totalSQ: 0,
                    notaFinal: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionQ.create(dataCalificacionQ);
                } else {
                  const dataCalificacionT = {
                    aportesPrimerTimestre: 0,
                    proIntegradorFase_1: 0,
                    evaluacion_estructurada_1: 0,
                    aportesSegundoTimestre: 0,
                    proIntegradorFase_2: 0,
                    evaluacion_estructurada_2: 0,
                    aportesTercerTimestre: 0,
                    proIntegradorFase_3: 0,
                    evaluacion_estructurada_3: 0,
                    proyecto_Final: 0,
                    total_Final: 0,
                    aprobado: 1,
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };
                  await CalificacionT.create(dataCalificacionT);
                }
              }
            }
            if (info_curso.nivelAcademico == "Básica Elemental") {
              if (info_curso.gradoAcademico == 2) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Básica Elemental",
                    gradoAcademico: "2",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                const asistenciaXDia = {
                  horasClase_programadas: "864",
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_matricula: newMatricula_estudiante.id,
                };
                await AsistenciaXDia.create(asistenciaXDia);

                const info_materia_EF = await Materia.findOne({
                  where: {
                    nombre: "Educación Física",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EF = {
                  horasClase_programadas:
                    info_materia_EF.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EF.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EF);

                const info_materia_EN = await Materia.findOne({
                  where: {
                    nombre: "Inglés",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EN = {
                  horasClase_programadas:
                    info_materia_EN.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EN.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EN);

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const id_materia = infoCurso.materia[i].id;
                  const tipoCalificacion =
                    infoCurso.materia[i].tipoCalificacion;

                  await Materia.findOne({ where: { id: id_materia } });

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
              if (info_curso.gradoAcademico == 3) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Básica Elemental",
                    gradoAcademico: "3",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                const asistenciaXDia = {
                  horasClase_programadas: "864",
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_matricula: newMatricula_estudiante.id,
                };
                await AsistenciaXDia.create(asistenciaXDia);

                const info_materia_EF = await Materia.findOne({
                  where: {
                    nombre: "Educación Física",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EF = {
                  horasClase_programadas:
                    info_materia_EF.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EF.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EF);

                const info_materia_EN = await Materia.findOne({
                  where: {
                    nombre: "Inglés",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EN = {
                  horasClase_programadas:
                    info_materia_EN.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EN.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EN);

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const id_materia = infoCurso.materia[i].id;
                  const tipoCalificacion =
                    infoCurso.materia[i].tipoCalificacion;

                  await Materia.findOne({ where: { id: id_materia } });

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
              if (info_curso.gradoAcademico == 4) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Básica Media",
                    gradoAcademico: "4",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                const asistenciaXDia = {
                  horasClase_programadas: "864",
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_matricula: newMatricula_estudiante.id,
                };
                await AsistenciaXDia.create(asistenciaXDia);

                const info_materia_EF = await Materia.findOne({
                  where: {
                    nombre: "Educación Física",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EF = {
                  horasClase_programadas:
                    info_materia_EF.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EF.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EF);

                const info_materia_EN = await Materia.findOne({
                  where: {
                    nombre: "Inglés",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EN = {
                  horasClase_programadas:
                    info_materia_EN.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EN.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EN);

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const id_materia = infoCurso.materia[i].id;
                  const tipoCalificacion =
                    infoCurso.materia[i].tipoCalificacion;

                  await Materia.findOne({ where: { id: id_materia } });

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
            }
            if (info_curso.nivelAcademico == "Básica Media") {
              if (info_curso.gradoAcademico == 5) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Básica Media",
                    gradoAcademico: "5",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                const asistenciaXDia = {
                  horasClase_programadas: "864",
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_matricula: newMatricula_estudiante.id,
                };
                await AsistenciaXDia.create(asistenciaXDia);

                const info_materia_EF = await Materia.findOne({
                  where: {
                    nombre: "Educación Física",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EF = {
                  horasClase_programadas:
                    info_materia_EF.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EF.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EF);

                const info_materia_EN = await Materia.findOne({
                  where: {
                    nombre: "Inglés",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EN = {
                  horasClase_programadas:
                    info_materia_EN.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EN.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EN);

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const id_materia = infoCurso.materia[i].id;
                  const tipoCalificacion =
                    infoCurso.materia[i].tipoCalificacion;

                  await Materia.findOne({ where: { id: id_materia } });

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
              if (info_curso.gradoAcademico == 6) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Básica Media",
                    gradoAcademico: "6",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                const asistenciaXDia = {
                  horasClase_programadas: "864",
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_matricula: newMatricula_estudiante.id,
                };
                await AsistenciaXDia.create(asistenciaXDia);

                const info_materia_EF = await Materia.findOne({
                  where: {
                    nombre: "Educación Física",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EF = {
                  horasClase_programadas:
                    info_materia_EF.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EF.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EF);

                const info_materia_EN = await Materia.findOne({
                  where: {
                    nombre: "Inglés",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EN = {
                  horasClase_programadas:
                    info_materia_EN.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EN.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EN);

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const id_materia = infoCurso.materia[i].id;
                  const tipoCalificacion =
                    infoCurso.materia[i].tipoCalificacion;

                  await Materia.findOne({ where: { id: id_materia } });

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
              if (info_curso.gradoAcademico == 7) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Básica Media",
                    gradoAcademico: "7",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                const asistenciaXDia = {
                  horasClase_programadas: "864",
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_matricula: newMatricula_estudiante.id,
                };
                await AsistenciaXDia.create(asistenciaXDia);

                const info_materia_EF = await Materia.findOne({
                  where: {
                    nombre: "Educación Física",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EF = {
                  horasClase_programadas:
                    info_materia_EF.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EF.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EF);

                const info_materia_EN = await Materia.findOne({
                  where: {
                    nombre: "Inglés",
                    id_curso: infoCurso.id,
                  },
                });
                const asistenciasXMateria_EN = {
                  horasClase_programadas:
                    info_materia_EN.horasClase_programadas,
                  horasClase_dictadas: "0",
                  horasClase_asistidas: "0",
                  id_materia: info_materia_EN.id,
                  id_matricula: newMatricula_estudiante.id,
                };

                await AsistenciaXMate.create(asistenciasXMateria_EN);

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const id_materia = infoCurso.materia[i].id;
                  const tipoCalificacion =
                    infoCurso.materia[i].tipoCalificacion;

                  await Materia.findOne({ where: { id: id_materia } });

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    const dataCalificacionT = {
                      aportesPrimerTimestre: 0,
                      proIntegradorFase_1: 0,
                      evaluacion_estructurada_1: 0,
                      aportesSegundoTimestre: 0,
                      proIntegradorFase_2: 0,
                      evaluacion_estructurada_2: 0,
                      aportesTercerTimestre: 0,
                      proIntegradorFase_3: 0,
                      evaluacion_estructurada_3: 0,
                      proyecto_Final: 0,
                      total_Final: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionT.create(dataCalificacionT);
                  }
                }
              }
            }
            if (info_curso.nivelAcademico == "Básica Superior") {
              if (info_curso.gradoAcademico == 8) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Básica Superior",
                    gradoAcademico: "8",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const tipoCalificacion = infoCurso.materia[i];
                  const id_materia = infoCurso.materia[i].id;
                  const infoMateria = await Materia.findOne({
                    where: { id: id_materia },
                  });

                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };

                  await AsistenciaXMate.create(asistenciasXMateria);

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    if (
                      (infoCurso.nivelAcademico == "Bachillerato" &&
                        infoCurso.gradoAcademico == 3) ||
                      infoCurso.gradoAcademico == 10 ||
                      infoCurso.gradoAcademico == 7
                    ) {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    } else {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    }
                  }
                }
              }
              if (info_curso.gradoAcademico == 9) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Básica Superior",
                    gradoAcademico: "9",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const tipoCalificacion = infoCurso.materia[i];
                  const id_materia = infoCurso.materia[i].id;
                  const infoMateria = await Materia.findOne({
                    where: { id: id_materia },
                  });

                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };

                  await AsistenciaXMate.create(asistenciasXMateria);

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    if (
                      (infoCurso.nivelAcademico == "Bachillerato" &&
                        infoCurso.gradoAcademico == 3) ||
                      infoCurso.gradoAcademico == 10 ||
                      infoCurso.gradoAcademico == 7
                    ) {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    } else {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    }
                  }
                }
              }
              if (info_curso.gradoAcademico == 10) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Básica Superior",
                    gradoAcademico: "10",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const tipoCalificacion = infoCurso.materia[i];
                  const id_materia = infoCurso.materia[i].id;
                  const infoMateria = await Materia.findOne({
                    where: { id: id_materia },
                  });

                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };

                  await AsistenciaXMate.create(asistenciasXMateria);

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    if (
                      (infoCurso.nivelAcademico == "Bachillerato" &&
                        infoCurso.gradoAcademico == 3) ||
                      infoCurso.gradoAcademico == 10 ||
                      infoCurso.gradoAcademico == 7
                    ) {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    } else {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    }
                  }
                }
              }
            }
            if (info_curso.nivelAcademico == "Bachillerato") {
              if (info_curso.gradoAcademico == 1) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Bachillerato",
                    gradoAcademico: "1",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const tipoCalificacion = infoCurso.materia[i];
                  const id_materia = infoCurso.materia[i].id;
                  const infoMateria = await Materia.findOne({
                    where: { id: id_materia },
                  });

                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };

                  await AsistenciaXMate.create(asistenciasXMateria);

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    if (
                      (infoCurso.nivelAcademico == "Bachillerato" &&
                        infoCurso.gradoAcademico == 3) ||
                      infoCurso.gradoAcademico == 10 ||
                      infoCurso.gradoAcademico == 7
                    ) {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    } else {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    }
                  }
                }
              }
              if (info_curso.gradoAcademico == 2) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Bachillerato",
                    gradoAcademico: "2",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const { tipoCalificacion } = infoCurso.materia[i];
                  const id_materia = infoCurso.materia[i].id;
                  const infoMateria = await Materia.findOne({
                    where: { id: id_materia },
                  });

                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };

                  await AsistenciaXMate.create(asistenciasXMateria);

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    if (
                      (infoCurso.nivelAcademico == "Bachillerato" &&
                        infoCurso.gradoAcademico == 3) ||
                      infoCurso.gradoAcademico == 10 ||
                      infoCurso.gradoAcademico == 7
                    ) {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    } else {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    }
                  }
                }
              }
              if (info_curso.gradoAcademico == 3) {
                const info_curso_matricula = await Curso.findOne({
                  where: {
                    nivelAcademico: "Bachillerato",
                    gradoAcademico: "3",
                    id_anioLectivo: info_newAnioLectivo.id,
                  },
                });

                const info_paralelo_matricula = await Paralelo.findOne({
                  where: {
                    titulo: info_paralelo.titulo,
                    id_curso: info_curso_matricula.id,
                  },
                });

                const data_newMatriculaEstudiante = {
                  id_paralelo: info_paralelo_matricula.id,
                  id_persona: id_persona,
                  id_anioLectivo_actual: info_AnioLectivo.id,
                };

                const dataEstadoAcademico = {
                  estadoAc: "0",
                };

                await Persona.update(dataEstadoAcademico, {
                  where: { id: id_persona },
                });

                const newMatricula_estudiante = await Matricula.create(
                  data_newMatriculaEstudiante
                );

                const infoCurso = await Curso.findOne({
                  include: [Materia],
                  where: { id: info_paralelo_matricula.id_curso },
                });

                for (let i = 0; i < infoCurso.materia.length; i++) {
                  const { tipoCalificacion } = infoCurso.materia[i];
                  const id_materia = infoCurso.materia[i].id;
                  const infoMateria = await Materia.findOne({
                    where: { id: id_materia },
                  });

                  const asistenciasXMateria = {
                    horasClase_programadas: infoMateria.horasClase_programadas,
                    horasClase_dictadas: "0",
                    horasClase_asistidas: "0",
                    id_materia: id_materia,
                    id_matricula: newMatricula_estudiante.id,
                  };

                  await AsistenciaXMate.create(asistenciasXMateria);

                  if (tipoCalificacion == 0) {
                    const dataCalificacionQ = {
                      firstParcialPQ: 0,
                      secondParcialPQ: 0,
                      subTotalPQ: 0,
                      testPQ: 0,
                      totalPQ: 0,
                      firstParcialSQ: 0,
                      secondParcialSQ: 0,
                      subTota2PQ: 0,
                      testSQ: 0,
                      totalSQ: 0,
                      notaFinal: 0,
                      aprobado: 1,
                      id_materia: id_materia,
                      id_matricula: newMatricula_estudiante.id,
                    };
                    await CalificacionQ.create(dataCalificacionQ);
                  } else {
                    if (
                      (infoCurso.nivelAcademico == "Bachillerato" &&
                        infoCurso.gradoAcademico == 3) ||
                      infoCurso.gradoAcademico == 10 ||
                      infoCurso.gradoAcademico == 7
                    ) {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
                      };
                      await CalificacionT.create(dataCalificacionT);
                    } else {
                      const dataCalificacionT = {
                        aportesPrimerTimestre: 0,
                        proIntegradorFase_1: 0,
                        evaluacion_estructurada_1: 0,
                        aportesSegundoTimestre: 0,
                        proIntegradorFase_2: 0,
                        evaluacion_estructurada_2: 0,
                        aportesTercerTimestre: 0,
                        proIntegradorFase_3: 0,
                        evaluacion_estructurada_3: 0,
                        proyecto_Final: 0,
                        evaluacion_nivel: 0,
                        total_Final: 0,
                        aprobado: 1,
                        id_materia: id_materia,
                        id_matricula: newMatricula_estudiante.id,
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
    return res.json({
      message:
        "Se han promovido a los estudiantes con estado académico promovido",
    });
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
      jornada,
      periodo,
      fechaInicio,
      fechaFin,
      modalidad,
      tipoCalificacion,
      inicial,
      preparatoria,
      elemental,
      media,
      superior,
      bachillerato,
      bachillerato_3ro,
    } = req.body;

    const anioLectivoData = {
      jornada: jornada,
      periodo: periodo,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      modalidad: modalidad,
      tipoCalificacion: tipoCalificacion,
      estadoAniolectivo: "0",
    };
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
        boolInicial,
        boolBasica,
        boolBachillerato,
        bool1I,
        num_paralelo1I,
        bool2I,
        num_paralelo2I,
        bool1B,
        num_paralelo1B,
        bool2B,
        num_paralelo2B,
        bool3B,
        num_paralelo3B,
        bool4B,
        num_paralelo4B,
        bool5B,
        num_paralelo5B,
        bool6B,
        num_paralelo6B,
        bool7B,
        num_paralelo7B,
        bool8B,
        num_paralelo8B,
        bool9B,
        num_paralelo9B,
        bool10B,
        num_paralelo10B,
        bool1S,
        num_paralelo1S,
        bool2S,
        num_paralelo2S,
        bool3S,
        num_paralelo3S,
      } = req.body;
      if (newAnioLectivo) {
        if (boolInicial == true) {
          if (bool1I == true) {
            const cursoData = {
              nivelAcademico: "Inicial 3 años",
              gradoAcademico: "1",
              id_anioLectivo: newAnioLectivo.id,
            };
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
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo1I;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const parareloData = {
                  titulo: letra,
                  id_curso: id_curso,
                };
                await Paralelo.create(parareloData);
              }
            }
          }
          if (bool2I == true) {
            const cursoData = {
              nivelAcademico: "Inicial 4 años",
              gradoAcademico: "2",
              id_anioLectivo: newAnioLectivo.id,
            };
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
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo2I;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const paraleloData = {
                  titulo: letra,
                  id_curso: id_curso,
                };
                await Paralelo.create(paraleloData);
              }
            }
          }
        }

        if (boolBasica == true) {
          if (bool1B == true) {
            const cursoData = {
              nivelAcademico: "Básica Preparatoria",
              gradoAcademico: "1",
              id_anioLectivo: newAnioLectivo.id,
            };
            const newCurso = await Curso.create(cursoData);
            const id_curso = newCurso.id;
            if (newCurso) {
              for (let i = 0; i < preparatoria.length; i++) {
                const { area, nombre, horasClase_programadas } =
                  preparatoria[i];
                const dataMateria = {
                  area: area,
                  nombre: nombre,
                  horasClase_programadas: horasClase_programadas,
                  tipoCalificacion: tipoCalificacion,
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }
              const numeroParalelo = num_paralelo1B;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }

          if (bool2B == true) {
            const cursoData = {
              nivelAcademico: "Básica Elemental",
              gradoAcademico: "2",
              id_anioLectivo: newAnioLectivo.id,
            };
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
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo2B;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }

          if (bool3B == true) {
            const cursoData = {
              nivelAcademico: "Básica Elemental",
              gradoAcademico: "3",
              id_anioLectivo: newAnioLectivo.id,
            };
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
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo3B;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }

          if (bool4B == true) {
            const cursoData = {
              nivelAcademico: "Básica Elemental",
              gradoAcademico: "4",
              id_anioLectivo: newAnioLectivo.id,
            };
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
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo4B;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }

          if (bool5B == true) {
            const cursoData = {
              nivelAcademico: "Básica Media",
              gradoAcademico: "5",
              id_anioLectivo: newAnioLectivo.id,
            };
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
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo5B;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }

          if (bool6B == true) {
            const cursoData = {
              nivelAcademico: "Básica Media",
              gradoAcademico: "6",
              id_anioLectivo: newAnioLectivo.id,
            };
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
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo6B;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }

          if (bool7B == true) {
            const cursoData = {
              nivelAcademico: "Básica Media",
              gradoAcademico: "7",
              id_anioLectivo: newAnioLectivo.id,
            };
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
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo7B;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }

          if (bool8B == true) {
            const cursoData = {
              nivelAcademico: "Básica Superior",
              gradoAcademico: "8",
              id_anioLectivo: newAnioLectivo.id,
            };
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
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo8B;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }

          if (bool9B == true) {
            const cursoData = {
              nivelAcademico: "Básica Superior",
              gradoAcademico: "9",
              id_anioLectivo: newAnioLectivo.id,
            };
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
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo9B;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }

          if (bool10B == true) {
            const cursoData = {
              nivelAcademico: "Básica Superior",
              gradoAcademico: "10",
              id_anioLectivo: newAnioLectivo.id,
            };
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
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo10B;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }
        }

        if (boolBachillerato == true) {
          if (bool1S == true) {
            const cursoData = {
              nivelAcademico: "Bachillerato",
              gradoAcademico: "1",
              id_anioLectivo: newAnioLectivo.id,
            };
            const newCurso = await Curso.create(cursoData);
            const id_curso = newCurso.id;
            if (newCurso) {
              for (let i = 0; i < bachillerato.length; i++) {
                const { area, nombre, horasClase_programadas } =
                  bachillerato[i];
                const dataMateria = {
                  area: area,
                  nombre: nombre,
                  horasClase_programadas: horasClase_programadas,
                  tipoCalificacion: tipoCalificacion,
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo1S;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }

          if (bool2S == true) {
            const cursoData = {
              nivelAcademico: "Bachillerato",
              gradoAcademico: "2",
              id_anioLectivo: newAnioLectivo.id,
            };
            const newCurso = await Curso.create(cursoData);
            const id_curso = newCurso.id;
            if (newCurso) {
              for (let i = 0; i < bachillerato.length; i++) {
                const { area, nombre, horasClase_programadas } =
                  bachillerato[i];
                const dataMateria = {
                  area: area,
                  nombre: nombre,
                  horasClase_programadas: horasClase_programadas,
                  tipoCalificacion: tipoCalificacion,
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo2S;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }

          if (bool3S == true) {
            const cursoData = {
              nivelAcademico: "Bachillerato",
              gradoAcademico: "3",
              id_anioLectivo: newAnioLectivo.id,
            };
            const newCurso = await Curso.create(cursoData);
            const id_curso = newCurso.id;
            if (newCurso) {
              for (let i = 0; i < bachillerato_3ro.length; i++) {
                const { area, nombre, horasClase_programadas } =
                  bachillerato_3ro[i];
                const dataMateria = {
                  area: area,
                  nombre: nombre,
                  horasClase_programadas: horasClase_programadas,
                  tipoCalificacion: tipoCalificacion,
                  id_curso: id_curso,
                };
                await Materia.create(dataMateria);
              }

              const numeroParalelo = num_paralelo3S;
              const startCharCode = 65; // Código ASCII de la letra 'A'
              for (let i = 0; i < numeroParalelo; i++) {
                const letra = String.fromCharCode(startCharCode + i);
                const cursoData = {
                  titulo: letra,
                  id_curso: newCurso.id,
                };
                await Paralelo.create(cursoData);
              }
            }
          }
        }

        return res.json({
          message:
            "Se ha generado el año lectivo y la oferta académica exitosamente",
          newAnioLectivo,
        });
      } else {
        return res.json({ message: "Error, revise bien la información" });
      }
    } else {
      return res.json({
        message: "Ya existe un Año lectivo con estado activo",
      });
    }
  },
  /**updateAnioLectivo: Funcion para actualizar ciertos campos de un año lectivo
   * @param {*} req
   * @param {*} res
   * @returns
   */
  updateAnioLectivo: async (req, res) => {
    const {
      external_id,
      jornada,
      periodo,
      fechaFin,
      modalidad,
      tipoCalificacion,
    } = req.body;
    const info_AnioLectivo = await AnioLectivo.findOne({
      where: { externalId: external_id },
    });
    const info_matricula = await Matricula.findAll({
      where: { id_anioLectivo_actual: info_AnioLectivo.id },
    });
    if (!info_matricula) {
      const dataAnioLectivo = {
        jornada: jornada,
        periodo: periodo,
        fechaFin: fechaFin,
        modalidad: modalidad,
        tipoCalificacion: tipoCalificacion,
      };
      const updateAnioLectivo = await AnioLectivo.update(dataAnioLectivo, {
        where: { external_id: external_id },
      });
      return res.json({
        message: "Se ha actulizado el Año lectivo corecctemente",
        updateAnioLectivo,
      });
    } else {
      return res.json({
        message:
          "No se puede actualizar el tipo de califiacion del año lectivo, debido que ya existen estudiantes matriculados",
      });
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
      estadoAniolectivo: estadoAniolectivo,
    };
    const updateAnioLectivo = await AnioLectivo.update(dataAnioLectivo, {
      where: { external_id: external_id },
    });
    return res.json({
      message: "El año lectivo actual ha finalizado",
      updateAnioLectivo,
    });
  },
  /**
   * @param {*} req
   * @param {*} res
   * @returns
   */
  comprobarPromocionEstudiante: async (req, res) => {
    const estudiantes = await Persona.findAll({
      where: { id_rol: 6, estadoAc: 0 },
    });
    const info_anioLectivo = await AnioLectivo.findOne({
      where: { estadoAniolectivo: "0" },
    });

    for (let i = 0; i < estudiantes.length; i++) {
      const id_persona = estudiantes[i].id;

      const info_matricula_actual = await Matricula.findOne({
        where: {
          id_persona: id_persona,
          id_anioLectivo_actual: info_anioLectivo.id,
        },
      });

      var contador_materias = 0;
      var contador_AsistenciaxMateria = 0;
      var boolAsistenciaxDia = false;

      const info_AsistenciaXDia = await AsistenciaXDia.findOne({
        where: { id_matricula: info_matricula_actual.id },
      });
      const info_AsistenciaXMate = await AsistenciaXMate.findAll({
        where: { id_matricula: info_matricula_actual.id },
      });
      const info_calificacionT = await CalificacionT.findAll({
        where: { id_matricula: info_matricula_actual.id },
      });
      const info_CalificacionQ = await CalificacionQ.findAll({
        where: { id_matricula: info_matricula_actual.id },
      });

      if (info_AsistenciaXDia) {
        const horasClase_programadas =
          info_AsistenciaXDia.horasClase_programadas;
        const horasClase_programadasEntero = parseInt(
          horasClase_programadas,
          10
        );
        const horasClase_programadas90porciento = Math.floor(
          horasClase_programadasEntero * 0.9
        );

        const horasClase_asistidas = info_AsistenciaXDia.horasClase_asistidas;
        const horasClase_asistidasEntero = parseInt(horasClase_asistidas, 10);
        if (horasClase_asistidasEntero >= horasClase_programadas90porciento) {
          boolAsistenciaxDia = true;
        }

        for (let i = 0; i < info_AsistenciaXMate.length; i++) {
          const id_materia = info_AsistenciaXMate[i].id_materia;
          const materia = await Materia.findOne({ where: { id: id_materia } });
          const horasClase_programadas = materia.horasClase_programadas;
          const horasClase_programadasEntero = parseInt(
            horasClase_programadas,
            10
          );
          const horasClase_programadas90porciento = Math.floor(
            horasClase_programadasEntero * 0.9
          );

          const horasClase_asistidas =
            info_AsistenciaXMate[i].horasClase_asistidas;
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

        if (
          contador_materias === 0 &&
          contador_AsistenciaxMateria === 0 &&
          boolAsistenciaxDia === true
        ) {
          const data_promocion = {
            estadoAc: 1,
          };
          await Persona.update(data_promocion, { where: { id: id_persona } });
        } else {
          const data_promocion = {
            estadoAc: 2,
          };
          await Persona.update(data_promocion, { where: { id: id_persona } });
        }
      } else {
        for (let i = 0; i < info_AsistenciaXMate.length; i++) {
          const id_materia = info_AsistenciaXMate[i].id_materia;
          const materia = await Materia.findOne({ where: { id: id_materia } });
          const horasClase_programadas = materia.horasClase_programadas;
          const horasClase_programadasEntero = parseInt(
            horasClase_programadas,
            10
          );
          const horasClase_programadas90porciento = Math.floor(
            horasClase_programadasEntero * 0.9
          );

          const horasClase_asistidas =
            info_AsistenciaXMate[i].horasClase_asistidas;
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

        if (contador_materias === 0 && contador_AsistenciaxMateria === 0) {
          const data_promocion = {
            estadoAc: 1,
          };
          await Persona.update(data_promocion, { where: { id: id_persona } });
        } else {
          const data_promocion = {
            estadoAc: 2,
          };
          await Persona.update(data_promocion, { where: { id: id_persona } });
        }
      }
    }
    return res.json({
      message:
        "Se han promovido a los estudiantes que cumplen con los requisitos",
    });
  },
  matriculaPDF: async (req, res) => {
    const { external_id } = req.body;
    const inforPerson = await Persona.findOne({
      attributes: ["id", "nombre", "apellido", "numeroId"],

      where: { external_id: external_id },
    });

    const infoMatricula = await Matricula.findOne({
      where: { id_persona: inforPerson.id },
    });
    const infoParalelo = await Paralelo.findOne({
      where: { id: infoMatricula.id_paralelo },
    });
    const infoCurso = await Curso.findOne({
      where: { id: infoParalelo.id_curso },
    });

    const anioLectivo = await AnioLectivo.findOne({
      where: { estadoAniolectivo: 0 },
    });

    const infoSecretaria = await Persona.findOne({
      attributes: ["id", "nombre", "apellido", "numeroId"],
      where: { id_rol: 4 },
    });
    const infoRector = await Persona.findOne({
      attributes: ["id", "nombre", "apellido", "numeroId"],
      where: { id_rol: 1 },
    });
    await pdfGenerator.matriculaReport(
      inforPerson,
      infoMatricula,
      infoParalelo,
      infoCurso,
      anioLectivo,
      infoSecretaria,
      infoRector
    );
    let filePath = "reporte.pdf";
    let docName = "reporte.pdf";
    if (fs.existsSync(filePath)) {
      // Send the file as a response
      res.download(filePath, docName + ".pdf", (err) => {
        if (err) {
          console.log("Error sending file:", err);
        } else {
          console.log("Se envió el archivo");
          // Delete the file after the download is completed
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.log("Error deleting file:", unlinkErr);
              return;
            } else {
              console.log("File deleted successfully");
            }
          });
        }
      });
    } else {
      return res.status(200).send({
        status: "error",
        data: "No se encontro el archivo",
      });
    }
  },

  getAllEstudiantesNoMatriculados: async (req, res) => {
    try {
      const info_anioLectivo = await AnioLectivo.findOne({
        where: { estadoAniolectivo: "0" },
        attributes: ["id"],
      });

      const allMatriculas = await Matricula.findAll({
        where: { id_anioLectivo_actual: info_anioLectivo.id },
        attributes: ["id_persona"], // Obtener solo los IDs de personas matriculadas
      });

      const matriculadosIds = allMatriculas.map(
        (matricula) => matricula.id_persona
      );

      const allEstudiantes = await Persona.findAll({
        where: { id_rol: 6 },
        attributes: ["id", "nombre", "apellido", "numeroId", "external_id"],
      });

      const estudiantesNoMatriculados = allEstudiantes.filter(
        (estudiante) => !matriculadosIds.includes(estudiante.id)
      );

      return res.json({
        estudiantes_no_matriculados: estudiantesNoMatriculados,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error:
          "Un error ocurrió al intentar obtener estudiantes no matriculados.",
      });
    }
  },

  getAllMatriculas: async (req, res) => {
    try {
      const info_anioLectivo = await AnioLectivo.findOne({
        where: { estadoAniolectivo: "0" },
        attributes: ["id"],
      });

      const allMatriculas = await Matricula.findAll({
        where: { id_anioLectivo_actual: info_anioLectivo.id },
        include: [
          {
            model: Persona,
            attributes: ["id", "nombre", "apellido", "numeroId", "external_id"],
          },
          {
            model: Paralelo,
            attributes: ["id", "titulo", "id_curso"],
            include: {
              model: Curso,
              attributes: ["id", "nivelAcademico", "gradoAcademico"],
            },
          },
        ],
      });

      return res.json({ all_matriculas: allMatriculas });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Un errror ocurrio al intentar obtener matriculas." });
    }
  },

  /**Fin funciones validadas */
  verifyToken: async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).send("Unauhtorized Request");
      }
      let token = req.headers.authorization.split(" ")[1];
      if (token === "null") {
        return res.status(401).send("Unauhtorized Request");
      }

      const payload = await jwt.verify(token, process.env.Secret_key);
      if (!payload) {
        return res.status(401).send("Unauhtorized Request");
      }
      req.userId = payload._id;
      next();
    } catch (e) {
      return res.status(401).send("Unauhtorized Request");
    }
  },
};

module.exports = controller;
