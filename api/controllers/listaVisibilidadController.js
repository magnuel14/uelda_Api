'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const cloudinaryC = require('../../cloudinary');
const fs = require('fs-extra');

const Persona = models.persona;
const Cuenta = models.cuenta;
const Rol = models.rol;
const ListaVisibilidad = models.listaVisibilidad;
const ListaVisibilidad_persona = models.listaVisibilidad_persona;



let controller = {
    /** Implementado try cath*/
    /**
    * 
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    getAllListaVisibilidad: async (req, res) => {
        const { externalId } = req.body;

        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });

        const all_listas = await ListaVisibilidad.findAll({
            include: [
                { model: ListaVisibilidad_persona, as: 'listaVisibilidad_persona' }
            ],
            where: { id_persona: infoPersona.id }
        });

        return res.json({all_listas});
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    createListaVisibilidad: async (req, res) => {
        const {
            externalId,
            titulo_Grupo, ListaPersonas } = req.body;

        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });

        const data_newLista = {
            id_persona: infoPersona.id,
            titulo_Grupo: titulo_Grupo
        };
        const newLista = await ListaVisibilidad.create(data_newLista);

        for (let i = 0; i < ListaPersonas.length; i++) {
            const id_persona = ListaPersonas[i].id_persona;

            const data_newLista_persona = {
                id_persona: id_persona,
                id_listaVisibilidad: newLista.id
            };
            await ListaVisibilidad_persona.create(data_newLista_persona);
        }
        return res.json({ message: `Se ha creado el Grupo visibilidad titulado: ${titulo_Grupo}` })
    },
    /**
    * 
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    updateListaVisibilidad: async (req, res) => {
        const {
            externalId,
            titulo_Grupo, ListaPersonas } = req.body;

        const infoLista = await ListaVisibilidad.findOne({
            include: [
                { model: ListaVisibilidad_persona, as: 'listaVisibilidad_persona' }
            ],
            where: { external_id: externalId }
        });


        const lista_personas = await infoLista.getListaVisibilidad_persona();


        for (let i = 0; i < lista_personas.length; i++) {
            const { id } = lista_personas[i];
            await ListaVisibilidad_persona.destroy({
                where: { id: id }
            });

        }


        const data_Lista = {
            titulo_Grupo: titulo_Grupo,
        };

        await ListaVisibilidad.update(data_Lista, { where: { id: infoLista.id } });
        for (let i = 0; i < ListaPersonas.length; i++) {
            const id_persona = ListaPersonas[i].id_persona;

            const data_newLista_persona = {
                id_persona: id_persona,
                id_listaVisibilidad: infoLista.id
            };
            await ListaVisibilidad_persona.create(data_newLista_persona);
        }

        return res.json({ message: `Se ha actualizado el Grupo visibilidad titulado: ${titulo_Grupo}` })
    },
    /**
    * 
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    deleteListaVisibilidad: async (req, res) => {
        const { externalId } = req.body;

        const infoLista = await ListaVisibilidad.findOne({
            include: [
                { model: ListaVisibilidad_persona, as: 'listaVisibilidad_persona' }
            ],
            where: { external_id: externalId }
        });

        const lista_personas = await infoLista.getListaVisibilidad_persona();

        for (let i = 0; i < lista_personas.length; i++) {
            const { id } = lista_personas[i];
            await ListaVisibilidad_persona.destroy({
                where: { id: id }
            });

        }

        await ListaVisibilidad.destroy({ where: { id: infoLista.id } });

        return res.json({ message: `Se ha actualizado el Grupo visibilidad titulado: ${infoLista.titulo_Grupo}` })
    }
}
/** fin Implementado try cath*/
module.exports = controller;