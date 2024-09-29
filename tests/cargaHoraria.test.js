/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

describe('Prueba para la creación de una carga horaria', () => {
  it('Crear una nueva carga horaria', async () => {
    await request(app)
      .post('/uelda/carga_horaria/create_CargaHoraria')
      .send({
        externalId: 'bea40377-42ff-4981-8689-9b49b3671577',
        id_paralelo_tutor: '13',
        horas_asignadas: '30',
        cargaHoraria: [
          {
            listaIdParalelo: '13',
            listaIdMateria: '41,42,43,44,45,48,49',
          },
          {
            listaIdParalelo: '13,14,15',
            listaIdMateria: '50',
          },
          {
            listaIdParalelo: '14',
            listaIdMateria: '51',
          },
        ],
      })
      .expect(200);
  });
});
