/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

describe('Prueba para la edicioón de una calificacion', () => {
  it('Editar una calificacion', async () => {
    await request(app)
      .post('/uelda/docente/update_Calicaciones')
      .send({
        lista_externalsMateria_calificacion: [
          {
            externalId: '44eb5f18-b287-42ba-b12d-a82c3e31cf39',

            totalPrimerTriCuantity: 10,
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
          },
        ],
      })
      .expect(200);
  });
});
