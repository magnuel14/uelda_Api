/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

describe('Prueba para la creación de una matricula', () => {
  it('Crear una nueva matricula', async () => {
    await request(app)
      .post('/uelda/estudiantes/create_Matricula')
      .send({
        id_paralelo: '26',
        periodo_academicos_Programados_inicial: '900',
        periodo_academicos_Programados_preparatoria: '900',
        periodo_academicos_Programados_elemental: '792',
        periodo_academicos_Programados_media: '792',
        lista_externalid_estudiantes: [
          {
            external_id: '2a18f025-cb02-41c9-815b-ee072e02d9c4',
          },
        ],
      })
      .expect(200);
  });
});
