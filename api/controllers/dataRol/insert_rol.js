const models = require("../../models");
const Rol = models.rol;

let insert_rol = function () {
    Rol.findOrCreate({ where: { nombre: 'rector' }, defaults: { id: '1'} });
    Rol.findOrCreate({ where: { nombre: 'vicerrector' }, defaults: { id: '2'} });
    Rol.findOrCreate({ where: { nombre: 'inspector' }, defaults: { id: '3'} });
    Rol.findOrCreate({ where: { nombre: 'secretaria' }, defaults: { id: '4'} });
    Rol.findOrCreate({ where: { nombre: 'docente' }, defaults: { id: '5'} });
    Rol.findOrCreate({ where: { nombre: 'estudiante' }, defaults: { id: '6'} });
};
insert_rol();