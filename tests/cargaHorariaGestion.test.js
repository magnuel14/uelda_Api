/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

let token;
// eslint-disable-next-line no-unused-vars
let externalId;

beforeAll(async () => {
  const response = await request(app)
    .post('/uelda/user/signin')
    .send({
      correo: 'manuelvicente912@gmail.com',
      clave: '1234',
      checkedT: '0',
    });

  token = response.body.token;
  externalId = response.body.persona.external_id;
});

describe('Prueba para la creación de una carga horaria', () => {
  it('Crear una nueva carga horaria', async () => {
    await request(app)
      .post('/uelda/docente/create_CargaHorariaV2')
      .set('Authorization', `Bearer ${token}`)
      .send({
        externalId: '61274b1d-1928-4224-b6dc-9962308fed04',
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

describe('Prueba para la creación de una carga horaria', () => {
  it('Crear una nueva carga horaria', async () => {
    await request(app)
      .post('/uelda/docente/create_CargaHorariaV2')
      .set('Authorization', `Bearer ${token}`)
      .send({
        externalId: '61274b1d-1928-4224-b6dc-9962308fed04',
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

describe('Prueba para la creación de una carga horaria', () => {
  it('Crear una nueva carga horaria', async () => {
    await request(app)
      .post('/uelda/docente/create_CargaHorariaV2')
      .set('Authorization', `Bearer ${token}`)
      .send({
        externalId: '61274b1d-1928-4224-b6dc-9962308fed04',
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
