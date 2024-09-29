/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

describe('Prueba para registrar persona', () => {
  it('Registro de una nueva persona', async () => {
    const token = 'tu_token_de_autenticacion';
    await request(app)
      .post('/uelda/personal/registrar_persona')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'MANUEL VALENTINO',
        apellido: 'VICENTE PÉREZ',
        correoPersonal: 'manuelvicente912@gmail.com',
        tipoDocId: 'cedula',
        numeroId: '1105219248',
        id_rol: 4,
      })
      .expect(200);
  });
});
