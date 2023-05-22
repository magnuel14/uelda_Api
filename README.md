<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/mag-dev/image/upload/v1684731931/ueldaContainer/logo-UELDAWeb_ymadxe.png" width="320" alt="LOGO DE UELDAWeb" /></a>
</p>
  
  <p align="center">BackEnd para la aplicación de gestión acadamica de la <a href="#" target="_blank">Unidad Educativa Lauro Damerval Ayora</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/badge/npm-8.3.1-green" alt="NPM Version" /></a>


</p>

## Descripción

Este repositorio esta construido bajo [NodeJs](https://github.com/nodejs) framework de JavaScript. Como parte del proyecto de desarrollo para la Gestión Academica en la UELDA.  

## Pre-requisitos
### 1.-Instalar node version manager (NVM)
Se recomienda emplear <a href="https://github.com/nvm-sh/nvm">nvm</a>

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

### 2.-Instalar Node v16.15.0
```bash
nvm install 16.15.0
```

### 3.-Instalar dependencias
```bash
npm install
```


## Corriendo la app

```bash
# development
$ npm start
$ npm run serve 
```


## Base de Datos Local

### Pre-requisitos

### 1 Instalar postgreSQL 
* Linux
```bash
# ubuntu
$ sudo apt install postgresql postgresql-contrib
```
* windows

Ir a la página oficial y descargar <a href="https://www.postgresql.org/download/windows/">postgreSql</a>

### 2 Crear BD 

Genere una Base de datos con el nombre <span>ueldaWebBD</span> para crear la bd se accede a la terminal de postgres con su usuario, luego debes ingresar la contraseña.
```postgres
$ psql -U userName
```
Posteriormente en la terminal de mysql se crea la base de datos:
```postgres
postgres=# CREATE DATABASE ueldaWebBD;
```
### 3 Configurar archivo .env 
Para conectarse a la BD genere un archivo`.env` en la ruta principal del proyecto y copie la siguiente configuración. Debe remplazarla información donde pidan sus credenciales de usuario de postgres

```bash
# BD ev
DATABASE_HOST = localhost
DATABASE_DIALECT = postgres
DATABASE_PORT = 3306
DATABASE_USER = <my-bd-username>
DATABASE_PASS = <my-bd-password>
DATABASE_NAME = ueldaWebBD
```
<i>**NOTE**</i>.- Para sincronizar los modelos generados por Sequelize, debe decomentar el siguiente fragmento de [NodeJs](https://github.com/magnuel14/uelda_Api/blob/main/app.js). Luego descomente la el codigo para generar los roles para los usuarios.
```
/** 
//sincronizacion dde los modelos de la bd
try {
    // basede dtatos 
    models.sequelize.sync().then(() => {
        console.log('Base de Datos conectada');
    }).catch(err => {
        console.log(err, "No se conecto a la BD");
    });
} catch (error) {
    console.error('Unable to connect to the server ', error);
}
//rol de usuarios
require('./api/controllers/dataRol/insert_rol');
*/
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Documentación

Para generar la documentación del proyecto utilice 

```bash
$ npm run documentation
```

Para generar el informe del coverage del proyecto utilice 

```bash
$ npm run test:cov
```
