'use strict';
const models = require('../models');
const { Op } = require("sequelize");

const Persona = models.persona;
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
        const { externalId } = req.params;

        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });

        let lista_postAca_personas = [];

        const all_listas = await ListaVisibilidad.findAll({
            where: { id_persona: infoPersona.id }
        });

        for (let i = 0; i < all_listas.length; i++) {
            const id = all_listas[i].id;
            let personas = [];

            const info_lista = await ListaVisibilidad.findOne({
                include: [
                    { model: ListaVisibilidad_persona }
                ],
                where: { id: id }
            });

            for (let j = 0; j < info_lista.listaVisibilidad_personas.length; j++) {
                const external_id = info_lista.listaVisibilidad_personas[j].external_id_persona;
                const info_personaLista = await Persona.findOne({
                    attributes: ['nombre', 'apellido', 'numeroId', 'external_id'],
                    where: { external_id: external_id }
                });

                personas.push(info_personaLista);

            }

            lista_postAca_personas.push({
                info_lista, infoPersona, personas
            });

        }

        return res.json(lista_postAca_personas);

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
        const data_newLista_persona = {
            external_id_persona: externalId,
            id_listaVisibilidad: newLista.id
        };
        await ListaVisibilidad_persona.create(data_newLista_persona);

        for (let i = 0; i < ListaPersonas.length; i++) {
            const external_id_persona = ListaPersonas[i].externalId;

            const data_newLista_persona = {
                external_id_persona: external_id_persona,
                id_listaVisibilidad: newLista.id
            };
            await ListaVisibilidad_persona.create(data_newLista_persona);
        }
        return res.json({ message: `Se ha creado el Grupo visibilidad titulado: ${titulo_Grupo}` });
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
                { model: ListaVisibilidad_persona, as: 'listaVisibilidad_personas' }
            ],
            where: { external_id: externalId }
        });


        const lista_personas = await infoLista.getListaVisibilidad_personas();


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
                { model: ListaVisibilidad_persona, as: 'listaVisibilidad_personas' }
            ],
            where: { external_id: externalId }
        });

        const lista_personas = await infoLista.getListaVisibilidad_personas();

        for (let i = 0; i < lista_personas.length; i++) {
            const { id } = lista_personas[i];
            await ListaVisibilidad_persona.destroy({
                where: { id: id }
            });

        }

        await ListaVisibilidad.destroy({ where: { id: infoLista.id } });

        return res.json({ message: `Se ha eliminado el Grupo visibilidad titulado: ${infoLista.titulo_Grupo}` })
    },
    getPersonas: async (req, res) => {
        const { flag, personal } = req.body;
        console.log(flag === '')
        if (flag === '') {
            res.json({ estatus: '1', message: 'Revise bien la información ingresada' });

        } else {
            if (personal === true) {
                const searchPerson = await Persona.findAll({
                    attributes: ['nombre', 'apellido', 'id', 'id_rol', 'external_id'],
                    where: {
                        [Op.or]: [
                            { numeroId: flag },
                            { nombre: { [Op.iLike]: `%${flag}%` } },
                            { apellido: { [Op.iLike]: `%${flag}%` } },
                        ],
                        [Op.not]: { id_rol: 6 }
                    }
                });
                if (searchPerson.length >= 1) {
                    res.json({ estatus: '0', searchPerson, length_lista: searchPerson.length });

                } else {
                    res.json({ estatus: '1', message: 'Revise bien la información ingresada' });
                }
            } else if (personal === false) {
                const searchPerson = await Persona.findAll({
                    attributes: ['nombre', 'apellido', 'id', 'id_rol', 'external_id'],
                    where: {
                        [Op.or]: [
                            { numeroId: flag },
                            { nombre: { [Op.iLike]: `%${flag}%` } },
                            { apellido: { [Op.iLike]: `%${flag}%` } }
                        ]
                    }
                });
                if (searchPerson.length >= 1) {
                    res.json({ estatus: '0', searchPerson, length_lista: searchPerson.length });

                } else {
                    res.json({ estatus: '1', message: 'Revise bien la información ingresada' });
                }
            }
        }
    }
    /** fin Implementado try cath*/
}
module.exports = controller;