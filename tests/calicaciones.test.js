/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

let token;

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

describe('Prueba para la edicioón de una calificacion', () => {
  it('Editar una calificacion', async () => {
    await request(app)
      .post('/uelda/docente/update_Calicaciones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        lista_externalsMateria_calificacion: [
          {
            externalId: '35d46176-f3bd-4e00-bfe8-5c50228470da',

            totalPrimerTriCuantity: 10,
            totalPrimerTriQuality: 0,
            totalSegundoTriCuantity: 9,
            totalSegundoTriQuality: 0,
            totalTercerTriCuantity: 7,
            totalTercerTriQuality: 0,
            proyectoFinalQuality: 0,
            proyectoFinalCuantity: 0,

            evaluacionNivelQuality: 0,
            evaluacionNivelCuantity: 0,

            total_Final: 0,
            comportamiento: '',

            aprobado: 1,
          },
        ],
      })
      .expect(200);
  });
});
