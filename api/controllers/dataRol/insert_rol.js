const models = require("../../models");
const Rol = models.rol;

let insert_rol = function () {
    Rol.findOrCreate({ where: { nombre: 'Rector/a' }, defaults: { id: '1' } });
    Rol.findOrCreate({ where: { nombre: 'Vicerrector/a' }, defaults: { id: '2' } });
    Rol.findOrCreate({ where: { nombre: 'Inspector/a' }, defaults: { id: '3' } });
    Rol.findOrCreate({ where: { nombre: 'Secretario/a' }, defaults: { id: '4' } });
    Rol.findOrCreate({ where: { nombre: 'Docente' }, defaults: { id: '5' } });
    Rol.findOrCreate({ where: { nombre: 'Estudiante' }, defaults: { id: '6' } });
};
insert_rol();