'use strict';
const models = require('../models');
const { Op } = require("sequelize");

const Persona = models.persona;
const ListaVisibilidad = models.listaVisibilidad;
const ListaVisibilidad_persona = models.listaVisibilidad_persona;
const PostAcademico = models.postAcademico;

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
                    attributes: ['id', 'nombre', 'apellido', 'numeroId', 'external_id'],
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
    getListaVisibilidadByExternalId: async (req, res) => {
        const { externalId } = req.params;
        let lista_postAca_personas = [];
        const lista = await ListaVisibilidad.findOne({
            where: { external_id: externalId }
        });
        if (lista) {
            const id = lista.id;
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
                    attributes: ['id', 'nombre', 'apellido', 'numeroId', 'external_id'],
                    where: { external_id: external_id }
                });
                personas.push(info_personaLista);

            }
            lista_postAca_personas.push({
                info_lista, personas
            });
            return res.json(lista_postAca_personas);
        } else {
            return res.json({ message: 'Ocurrio un error' });
        }
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
        const { externalId, titulo_Grupo, ListaPersonas } = req.body;

        const infoLista = await ListaVisibilidad.findOne({
            include: [
                { model: ListaVisibilidad_persona, as: 'listaVisibilidad_personas' }
            ],
            where: { external_id: externalId }
        });

        const infoPersona = await Persona.findOne({ where: { id: infoLista.id_persona } });

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

        const data_newLista_persona = {
            external_id_persona: infoPersona.external_id,
            id_listaVisibilidad: infoLista.id
        };
        await ListaVisibilidad_persona.create(data_newLista_persona);

        for (let i = 0; i < ListaPersonas.length; i++) {
            const external_id_persona = ListaPersonas[i].externalId;

            if (external_id_persona != infoPersona.external_id) {
                const data_newLista_persona = {
                    external_id_persona: external_id_persona,
                    id_listaVisibilidad: infoLista.id
                };
                await ListaVisibilidad_persona.create(data_newLista_persona);
            }
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
        if (infoLista) {
            const infoPost = await PostAcademico.findAll({ where: { id_ListaVisibilidad: infoLista.id } });

            if (infoPost.length >= 1) {
                return res.json({ message: `La Lista ${infoLista.titulo_Grupo}, no se puede eliminar debido a que existe un post académico ligado.` });
            } else {
                const lista_personas = await infoLista.getListaVisibilidad_personas();

                for (let i = 0; i < lista_personas.length; i++) {
                    const { id } = lista_personas[i];
                    await ListaVisibilidad_persona.destroy({
                        where: { id: id }
                    });
                }
                await ListaVisibilidad.destroy({ where: { id: infoLista.id } });
                return res.json({ message: `Se ha eliminado el Grupo visibilidad titulado: ${infoLista.titulo_Grupo}` });
            }
        } else {
            return res.json({ message: `Ha ocurrido un error` });
        }
    },
    getPersonas: async (req, res) => {
        const { flag, personal } = req.body;
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