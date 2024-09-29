/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

describe('Prueba para la generación de un certificado de matricula', () => {
  it('Generar un certificado de matricula', async () => {
    await request(app)
      .post('/uelda/gestion_academica/matriculaPDF')
      .send({
        external_id: '3b866426-cb12-45f7-8abd-9ac5cc20dfa4',
      })
      .expect(200);
  });
});
