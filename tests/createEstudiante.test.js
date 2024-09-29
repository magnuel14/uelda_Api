/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

describe('Prueba para el registro de estudiantes', () => {
  it('Registro de un nuevo estudiante', async () => {
    await request(app)
      .post('/uelda/estudiantes/registrar_estudiante')
      .send({
        externalId: '499aa695-2d5f-48d1-a597-0ce340642d3d',
        nombre: 'JOSE ANDRES',
        apellido: 'ACEVEDO PEREZ',
        correoPersonal: 'manuelvicente67@hotmail.com',
        tipoDocId: 'cedula',
        numeroId: '0706673530',
      })
      .expect(200);
  });
});
