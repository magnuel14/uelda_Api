/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

let token;
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

describe('Prueba para registrar persona', () => {
  it('Registro de una nueva persona', async () => {
    await request(app)
      .post('/uelda/personal/registrar_persona')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'MANUEL VALENTINO',
        apellido: 'VICENTE PÉREZ',
        correoPersonal: 'manuelvicente912@gmail.com',
        tipoDocId: 'cedula',
        numeroId: '1105219248',
        id_rol: 4, // rol de administrador
      })
      .expect(200);
  });
});

describe('Prueba editar clave - avatar Ususario', () => {
  it('should update user avatar and password', async () => {
    try {
      const res = await request(app)
        .post('/uelda/user/update_infoCuenta')
        .set('Authorization', `Bearer ${token}`)
        .field('externalId', externalId)
        .field('clave', '1234')
        .attach('foto', 'avatar.png'); // Asegúrate de que esta ruta sea válida

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Se ha actualizado su información de usuario');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during test:', error); // Agrega esta línea para depurar
    }
  });
});

describe('Prueba para el registro de estudiantes', () => {
  it('Registro de un nuevo estudiante', async () => {
    await request(app)
      .post('/uelda/estudiantes/registrar_estudiante')
      .set('Authorization', `Bearer ${token}`)
      .send({
        externalId,
        nombre: 'JOSE ANDRES',
        apellido: 'ACEVEDO PEREZ',
        correoPersonal: 'manuelvicente67@hotmail.com',
        tipoDocId: 'cedula',
        numeroId: '0706673530',
      })
      .expect(200);
  });
});

describe('Pureba para editar información personal del usuario', () => {
  it('Edición de la información personal', async () => {
    try {
      const res = await request(app)
        .post('/uelda/personal/update_infoPersona')
        .set('Authorization', `Bearer ${token}`)
        .field('externalId', externalId)
        .field('nombre', 'Valentino')
        .field('apellido', 'Perez')
        .field('nacionalidad', 'Ecuador')
        .field('cuidadNaci', 'Loja')
        .field('tipoGenero', 'Masculino')
        .field('provincia', 'Loja')
        .field('tipoDocId', 'cedula')
        .field('numeroId', '1105219248')
        .field('fechaNaci', '1983-09-19')
        .field('edad', '40')
        .field('correoPersonal', 'manuelvicente912@gmail.com')
        .field('correroInstitucional', 'manuelvicente912@gmail.com');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Se ha actualizado su información de usuario');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during test:', error); // Agrega esta línea para depurar
    }
  });
});

describe('Pureba para editar información personal del usuario', () => {
  it('Edición de la información personal', async () => {
    try {
      const res = await request(app)
        .post('/uelda/personal/update_infoPersona')
        .set('Authorization', `Bearer ${token}`)
        .field('externalId', externalId)
        .field('nombre', 'Valentino')
        .field('apellido', 'Perez')
        .field('nacionalidad', 'Ecuador')
        .field('cuidadNaci', 'Loja')
        .field('tipoGenero', 'Masculino')
        .field('provincia', 'Loja')
        .field('tipoDocId', 'cedula')
        .field('numeroId', '1105219248')
        .field('fechaNaci', '1983-09-19')
        .field('edad', '40')
        .field('correoPersonal', 'manuelvicente912@gmail.com')
        .field('correroInstitucional', 'manuelvicente912@gmail.com');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Se ha actualizado su información de usuario');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during test:', error); // Agrega esta línea para depurar
    }
  });
});

describe('Pureba para editar información personal del usuario', () => {
  it('Edición de la información personal', async () => {
    try {
      const res = await request(app)
        .post('/uelda/personal/update_infoPersona')
        .set('Authorization', `Bearer ${token}`)
        .field('externalId', externalId)
        .field('nombre', 'Valentino')
        .field('apellido', 'Perez')
        .field('nacionalidad', 'Ecuador')
        .field('cuidadNaci', 'Loja')
        .field('tipoGenero', 'Masculino')
        .field('provincia', 'Loja')
        .field('tipoDocId', 'cedula')
        .field('numeroId', '1105219248')
        .field('fechaNaci', '1983-09-19')
        .field('edad', '40')
        .field('correoPersonal', 'manuelvicente912@gmail.com')
        .field('correroInstitucional', 'manuelvicente912@gmail.com');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Se ha actualizado su información de usuario');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during test:', error); // Agrega esta línea para depurar
    }
  });
});
