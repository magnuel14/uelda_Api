/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

let token;
// eslint-disable-next-line prefer-const
let externalId = 'b88bc284-bb19-47cf-af9b-1c8710558c36';

beforeAll(async () => {
  const response = await request(app)
    .post('/uelda/user/signin')
    .send({
      correo: 'manuelvicente912@gmail.com',
      clave: '1234',
      checkedT: '0',
    });

  token = response.body.token;
});

describe('Prueba para la creación de una matricula', () => {
  it('Crear una nueva matricula', async () => {
    await request(app)
      .post('/uelda/gestion_academica/matricular_Estudiante')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_paralelo: '26',
        periodo_academicos_Programados_inicial: '900',
        periodo_academicos_Programados_preparatoria: '900',
        periodo_academicos_Programados_elemental: '792',
        periodo_academicos_Programados_media: '792',
        lista_externalid_estudiantes: [
          {
            external_id: '44eb5f18-b287-42ba-b12d-a82c3e31cf39',
          },
        ],
      })
      .expect(200);
  });
});

describe('Prueba para la actualización de una matricula', () => {
  it('Actualizar una matricula', async () => {
    await request(app)
      .post('/uelda/gestion_academica/update_matricula_Estudiante')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_paralelo: '27',
        periodo_academicos_Programados_inicial: '900',
        periodo_academicos_Programados_preparatoria: '900',
        periodo_academicos_Programados_elemental: '792',
        periodo_academicos_Programados_media: '792',
        externalId,
      })
      .expect(200);
  });
});

describe('Prueba para la actualización de una matricula', () => {
  it('Actualizar una matricula', async () => {
    await request(app)
      .post('/uelda/gestion_academica/update_matricula_Estudiante')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_paralelo: '27',
        periodo_academicos_Programados_inicial: '900',
        periodo_academicos_Programados_preparatoria: '900',
        periodo_academicos_Programados_elemental: '792',
        periodo_academicos_Programados_media: '792',
        externalId,
      })
      .expect(200);
  });
});

describe('Prueba para la actualización de una matricula', () => {
  it('Actualizar una matricula', async () => {
    await request(app)
      .post('/uelda/gestion_academica/update_matricula_Estudiante')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_paralelo: '27',
        periodo_academicos_Programados_inicial: '900',
        periodo_academicos_Programados_preparatoria: '900',
        periodo_academicos_Programados_elemental: '792',
        periodo_academicos_Programados_media: '792',
        externalId,
      })
      .expect(200);
  });
});
