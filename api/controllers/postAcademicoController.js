'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const cloudinaryC = require('../../cloudinary');
const { Op } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const mailing = require('../../helpers/emailTemplates');

const Persona = models.persona;
const Cuenta = models.cuenta;
const PostAcademico = models.postAcademico;
const AnioLectivo = models.anioLectivo;
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
    getAllpostAcademico: async (req, res) => {
        let all_postAcademicos = await PostAcademico.findAll();

        let lista_postAca_personas = [];

        for (let i = 0; i < all_postAcademicos.length; i++) {
            const visibilidad = all_postAcademicos[i].visibilidad;
            const id_ListaVisibilidad = all_postAcademicos[i].id_ListaVisibilidad;
            const idPersona = all_postAcademicos[i].id_persona;
            const inforPersona = await Persona.findOne({
                attributes: ['nombre', 'apellido', 'foto', 'external_id'],
                where: { id: idPersona }
            });

            if (visibilidad === 0) {
                let post = [];
                const personas = await Persona.findAll({
                    attributes: ['external_id'],
                });
                post.push(all_postAcademicos[i]);
                lista_postAca_personas.push({
                    post, inforPersona, personas
                });

            } else if (visibilidad === 1) {
                let post = [];
                const personas = await Persona.findAll({
                    attributes: ['external_id'],
                    where: {
                        [Op.or]: [
                            { id_rol: 1 },
                            { id_rol: 2 },
                            { id_rol: 3 },
                            { id_rol: 4 },
                            { id_rol: 5 }
                        ]
                    }
                });
                all_postAcademicos[i].personas = personas;
                post.push(all_postAcademicos[i]);
                lista_postAca_personas.push({
                    post, inforPersona, personas
                });


            } else if (visibilidad === 2) {
                let post = [];
                let personas = [];

                const info_lista = await ListaVisibilidad.findOne({
                    include: [
                        { model: ListaVisibilidad_persona }
                    ],
                    where: { id: id_ListaVisibilidad }
                });
                all_postAcademicos[i].personas = info_lista.listaVisibilidad_personas;

                post.push(all_postAcademicos[i]);

                for (let j = 0; j < info_lista.listaVisibilidad_personas.length; j++) {
                    const external_id = info_lista.listaVisibilidad_personas[j].external_id_persona;
                    personas.push({ external_id: external_id });
                }
                lista_postAca_personas.push({
                    post, inforPersona, personas
                });

            }

        }
        return res.json(lista_postAca_personas);

    },
    /** Implementado try cath*/
    /**
    * s
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    getAllpostAcademicoByExternalId: async (req, res) => {
        const { externalId } = req.params;
        const infoPostAcademico = await PostAcademico.findOne({ where: { external_id: externalId } });
        let lista_postAca_personas = [];


        if (infoPostAcademico) {
            const visibilidad = infoPostAcademico.visibilidad;
            const id_ListaVisibilidad = infoPostAcademico.id_ListaVisibilidad;
            const id_persona = infoPostAcademico.id_persona;
            const inforPersona = await Persona.findOne({ where: { id: id_persona } });

            if (visibilidad === 0) {
                let post = [];
                const personas = await Persona.findAll({
                    attributes: ['external_id'],
                });
                post.push(infoPostAcademico);
                lista_postAca_personas.push({
                    post, inforPersona, personas
                });
                return res.json(lista_postAca_personas);


            } else if (visibilidad === 1) {
                let post = [];
                const personas = await Persona.findAll({
                    attributes: ['external_id'],
                    where: {
                        [Op.or]: [
                            { id_rol: 1 },
                            { id_rol: 2 },
                            { id_rol: 3 },
                            { id_rol: 4 },
                            { id_rol: 5 }
                        ]
                    }
                });
                infoPostAcademico.personas = personas;
                post.push(infoPostAcademico);
                lista_postAca_personas.push({
                    post, inforPersona, personas
                });
                return res.json(lista_postAca_personas);


            } else if (visibilidad === 2) {
                let post = [];
                let personas = [];

                const info_lista = await ListaVisibilidad.findOne({
                    include: [
                        { model: ListaVisibilidad_persona }
                    ],
                    where: { id: id_ListaVisibilidad }
                });

                for (let j = 0; j < info_lista.listaVisibilidad_personas.length; j++) {
                    const external_id = info_lista.listaVisibilidad_personas[j].external_id_persona;
                    personas.push({ external_id: external_id });
                }
                post.push(infoPostAcademico);

                lista_postAca_personas.push({
                    post, inforPersona, personas
                });
                return res.json(lista_postAca_personas);
            }
        } else {
            return res.json({ message: 'Ocurrio un error' });
        }
    },
    /**
    * s
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    getAllpostAcademicoByExternalId2: async (req, res) => {
        const { externalId } = req.params;
        const infoPostAcademico = await PostAcademico.findOne({ where: { external_id: externalId } });
        let lista_postAca_personas = [];
        return res.json(infoPostAcademico);
    },
    /** Implementado try cath*/
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    createpostAcademico: async (req, res) => {
        const {
            externalId,
            titulo, tipoArchivo, descripcion,
            urlImagen, urlArchivo,
            visibilidad, id_ListaVisibilidad } = req.body;

        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const info_AnioLectivo_actual = await AnioLectivo.findOne({ where: { estadoAniolectivo: 0 } });

        if (req.files) {
            if (req.files?.foto) {
                const resultFoto = await cloudinaryC.uploadImagePost(req.files.foto.tempFilePath);
                //const resultDoc = await cloudinaryC.uploadFilePost(req.files.doc.tempFilePath);

                const data_newPost = {
                    titulo: titulo,
                    tipoArchivo: tipoArchivo,
                    descripcion: descripcion,
                    visibilidad: visibilidad,

                    url_imagen: resultFoto.secure_url,
                    public_id_imagen: resultFoto.public_id,

                    url_archivo: urlArchivo,
                    id_anioLectivo_actual: info_AnioLectivo_actual.id,
                    id_ListaVisibilidad: id_ListaVisibilidad,
                    id_persona: infoPersona.id,
                    estado: 0
                };

                const newPost = await PostAcademico.create(data_newPost);

                if (newPost.visibilidad === 0) {
                    const personas = await Persona.findAll({
                        include: [
                            {
                                model: Cuenta,
                                where: {
                                    estado: 0
                                }
                            }
                        ],
                    });

                    for (let i = 0; i < personas.length; i++) {

                        const dataPost = {
                            nombre: personas[i].nombre,
                            apellido: personas[i].apellido,
                            correoUsuario: personas[i].correoPersonal,
                            nombreAutor: infoPersona.nombre,
                            apellidoAutor: infoPersona.apellido,
                            titulo: newPost.titulo,
                            tipoArchivo: newPost.tipoArchivo,
                            url_imagen: newPost.url_imagen,
                            url_archivo: newPost.url_archivo,
                        };
                        await mailing.sendNewPostEmail(dataPost);
                    }
                    return res.json({ message: 'Se ha creado el post Académico', newPost });

                } else if (newPost.visibilidad === 1) {
                    const personas = await Persona.findAll({
                        where: {
                            [Op.or]: [
                                { id_rol: 1 },
                                { id_rol: 2 },
                                { id_rol: 3 },
                                { id_rol: 4 },
                                { id_rol: 5 }
                            ]
                        },
                        include: [
                            {
                                model: Cuenta,
                                where: {
                                    estado: 0
                                }
                            }
                        ],
                    });

                    for (let i = 0; i < personas.length; i++) {

                        const dataPost = {
                            nombre: personas[i].nombre,
                            apellido: personas[i].apellido,
                            correoUsuario: personas[i].correoPersonal,
                            nombreAutor: infoPersona.nombre,
                            apellidoAutor: infoPersona.apellido,
                            titulo: newPost.titulo,
                            tipoArchivo: newPost.tipoArchivo,
                            url_imagen: newPost.url_imagen,
                            url_archivo: newPost.url_archivo,
                        };
                        await mailing.sendNewPostEmail(dataPost);

                    }
                    return res.json({ message: 'Se ha creado el post Académico', newPost });

                } else if (newPost.visibilidad === 2) {

                    const id = newPost.id_ListaVisibilidad;
                    const info_lista = await ListaVisibilidad.findOne({
                        include: [
                            { model: ListaVisibilidad_persona }
                        ],
                        where: { id: id }
                    });
                    for (let j = 0; j < info_lista.listaVisibilidad_personas.length; j++) {
                        const external_id = info_lista.listaVisibilidad_personas[j].external_id_persona;
                        const personas = await Persona.findOne({
                            attributes: ['id', 'nombre', 'apellido', 'correoPersonal', 'external_id'],
                            where: { external_id: external_id }
                        });
                        const dataPost = {
                            nombre: personas.nombre,
                            apellido: personas.apellido,
                            correoUsuario: personas.correoPersonal,
                            nombreAutor: infoPersona.nombre,
                            apellidoAutor: infoPersona.apellido,
                            titulo: newPost.titulo,
                            tipoArchivo: newPost.tipoArchivo,
                            visibilidad: newPost.visibilidad,
                            url_imagen: newPost.url_imagen,
                            url_archivo: newPost.url_archivo,
                        };
                        await mailing.sendNewPostEmail(dataPost);
                    }
                    return res.json({ message: 'Se ha creado el post Académico', newPost });

                }

            }
        } else {

            const data_newPost = {
                titulo: titulo,
                tipoArchivo: tipoArchivo,
                descripcion: descripcion,
                visibilidad: visibilidad,
                url_imagen: urlImagen,
                url_archivo: urlArchivo,
                nombreAutor: infoPersona.nombre,
                apellidoAutor: infoPersona.apellido,
                id_anioLectivo_actual: info_AnioLectivo_actual.id,
                id_ListaVisibilidad: id_ListaVisibilidad,
                id_persona: infoPersona.id,
                estado: 0
            };
            const newPost = await PostAcademico.create(data_newPost);

            if (newPost.visibilidad === 0) {
                const personas = await Persona.findAll({
                    include: [
                        {
                            model: Cuenta,
                            where: {
                                estado: 0
                            }
                        }
                    ],
                });

                for (let i = 0; i < personas.length; i++) {

                    const dataPost = {
                        nombre: personas[i].nombre,
                        apellido: personas[i].apellido,
                        correoUsuario: personas[i].correoPersonal,
                        nombreAutor: infoPersona.nombre,
                        apellidoAutor: infoPersona.apellido,
                        titulo: newPost.titulo,
                        tipoArchivo: newPost.tipoArchivo,
                        url_imagen: newPost.url_imagen,
                        url_archivo: newPost.url_archivo,
                    };
                    await mailing.sendNewPostEmail(dataPost);
                }
                return res.json({ message: 'Se ha creado el post Académico', newPost });

            } else if (newPost.visibilidad === 1) {
                const personas = await Persona.findAll({
                    where: {
                        [Op.or]: [
                            { id_rol: 1 },
                            { id_rol: 2 },
                            { id_rol: 3 },
                            { id_rol: 4 },
                            { id_rol: 5 }
                        ]
                    },
                    include: [
                        {
                            model: Cuenta,
                            where: {
                                estado: 0
                            }
                        }
                    ],
                });

                for (let i = 0; i < personas.length; i++) {

                    const dataPost = {
                        nombre: personas[i].nombre,
                        apellido: personas[i].apellido,
                        correoUsuario: personas[i].correoPersonal,
                        nombreAutor: infoPersona.nombre,
                        apellidoAutor: infoPersona.apellido,
                        titulo: newPost.titulo,
                        tipoArchivo: newPost.tipoArchivo,
                        url_imagen: newPost.url_imagen,
                        url_archivo: newPost.url_archivo,
                    };
                    await mailing.sendNewPostEmail(dataPost);

                }
                return res.json({ message: 'Se ha creado el post Académico', newPost });

            } else if (newPost.visibilidad === 2) {

                const id = newPost.id_ListaVisibilidad;
                const info_lista = await ListaVisibilidad.findOne({
                    include: [
                        { model: ListaVisibilidad_persona }
                    ],
                    where: { id: id }
                });
                for (let j = 0; j < info_lista.listaVisibilidad_personas.length; j++) {
                    const external_id = info_lista.listaVisibilidad_personas[j].external_id_persona;
                    const personas = await Persona.findOne({
                        attributes: ['id', 'nombre', 'apellido', 'correoPersonal', 'external_id'],
                        where: { external_id: external_id }
                    });
                    const dataPost = {
                        nombre: personas.nombre,
                        apellido: personas.apellido,
                        correoUsuario: personas.correoPersonal,
                        nombreAutor: infoPersona.nombre,
                        apellidoAutor: infoPersona.apellido,
                        titulo: newPost.titulo,
                        tipoArchivo: newPost.tipoArchivo,
                        visibilidad: newPost.visibilidad,
                        url_imagen: newPost.url_imagen,
                        url_archivo: newPost.url_archivo,
                    };
                    await mailing.sendNewPostEmail(dataPost);
                }
                return res.json({ message: 'Se ha creado el post Académico', newPost });

            }

        }

    },
    /**
     * 
     */
    sendMailnewPost: async (newPost) => {

        if (newPost.visibilidad === 0) {
            const personas = await Persona.findAll({
                include: [
                    {
                        model: Cuenta,
                        where: {
                            estado: 0
                        }
                    }
                ],
            });

            for (let i = 0; i < personas.length; i++) {

                const dataPost = {
                    nombre: personas[i].nombre,
                    apellido: personas[i].apellido,
                    correoUsuario: personas[i].correoPersonal,
                    titulo: newPost.titulo,
                    tipoArchivo: newPost.tipoArchivo,
                    descripcion: newPost.descripcion,
                    visibilidad: newPost.visibilidad,
                    url_imagen: newPost.urlImagen,
                    url_archivo: newPost.urlArchivo,
                };
                await mailing.sendNewPostEmail(dataPost);
            }

        } else if (newPost.visibilidad === 1) {
            const personas = await Persona.findAll({
                where: {
                    [Op.or]: [
                        { id_rol: 1 },
                        { id_rol: 2 },
                        { id_rol: 3 },
                        { id_rol: 4 },
                        { id_rol: 5 }
                    ]
                },
                include: [
                    {
                        model: Cuenta,
                        where: {
                            estado: 0
                        }
                    }
                ],
            });

            for (let i = 0; i < personas.length; i++) {

                const dataPost = {
                    nombre: personas[i].nombre,
                    apellido: personas[i].apellido,
                    correoUsuario: personas[i].correoPersonal,
                    titulo: newPost.titulo,
                    tipoArchivo: newPost.tipoArchivo,
                    descripcion: newPost.descripcion,
                    visibilidad: newPost.visibilidad,
                    url_imagen: newPost.urlImagen,
                    url_archivo: newPost.urlArchivo,
                };
                await mailing.sendNewPostEmail(dataPost);

            }

        } else if (newPost.visibilidad === 2) {

            const id = newPost.id_ListaVisibilidad;
            const info_lista = await ListaVisibilidad.findOne({
                include: [
                    { model: ListaVisibilidad_persona }
                ],
                where: { id: id }
            });
            for (let j = 0; j < info_lista.listaVisibilidad_personas.length; j++) {
                const external_id = info_lista.listaVisibilidad_personas[j].external_id_persona;
                const personas = await Persona.findOne({
                    attributes: ['id', 'nombre', 'apellido', 'correoPersonal', 'external_id'],
                    where: { external_id: external_id }
                });
                const dataPost = {
                    nombre: personas[i].nombre,
                    apellido: personas[i].apellido,
                    correoUsuario: personas[i].correoPersonal,
                    titulo: newPost.titulo,
                    tipoArchivo: newPost.tipoArchivo,
                    descripcion: newPost.descripcion,
                    visibilidad: newPost.visibilidad,
                    url_imagen: newPost.urlImagen,
                    url_archivo: newPost.urlArchivo,
                };
                await mailing.sendNewPostEmail(dataPost);
            }
        }
    },
    /**
      * 
      * @param {*} req 
      * @param {*} res 
      * @returns 
      */
    updatepostAcademico: async (req, res) => {
        const {
            externalId,
            titulo, tipoArchivo, descripcion,
            urlImagen, urlArchivo,
            visibilidad, id_ListaVisibilidad } = req.body;

        const info_PostAcademica = await PostAcademico.findOne({ where: { external_id: externalId } });

        if (req.files) {
            if (req.files?.foto) {
                if (info_PostAcademica.public_id_imagen != null) {

                    await cloudinaryC.deleteFile(info_PostAcademica.public_id_imagen);

                    const resultFoto = await cloudinaryC.uploadImagePost(req.files.foto.tempFilePath);
                    //const resultDoc = await cloudinaryC.uploadFilePost(req.files.doc.tempFilePath);

                    const data_updatePost = {
                        titulo: titulo,
                        tipoArchivo: tipoArchivo,
                        descripcion: descripcion,
                        visibilidad: visibilidad,

                        url_imagen: resultFoto.secure_url,
                        public_id_imagen: resultFoto.public_id,

                        url_archivo: urlArchivo,
                        id_ListaVisibilidad: id_ListaVisibilidad,
                    };

                    const updatePost = await PostAcademico.update(data_updatePost, { where: { id: info_PostAcademica.id } });
                    return res.json({ message: 'Se ha actualizado el post Académico', updatePost });
                } else {

                    const resultFoto = await cloudinaryC.uploadImagePost(req.files.foto.tempFilePath);
                    //const resultDoc = await cloudinaryC.uploadFilePost(req.files.doc.tempFilePath);

                    const data_updatePost = {
                        titulo: titulo,
                        tipoArchivo: tipoArchivo,
                        descripcion: descripcion,
                        visibilidad: visibilidad,

                        url_imagen: resultFoto.secure_url,
                        public_id_imagen: resultFoto.public_id,

                        url_archivo: urlArchivo,
                        id_ListaVisibilidad: id_ListaVisibilidad,
                    };

                    const updatePost = await PostAcademico.update(data_updatePost, { where: { id: info_PostAcademica.id } });
                    return res.json({ message: 'Se ha actualizado el post Académico', updatePost });
                }

            }
        } else {

            const data_updatePost = {
                titulo: titulo,
                tipoArchivo: tipoArchivo,
                descripcion: descripcion,
                visibilidad: visibilidad,
                url_imagen: urlImagen,
                url_archivo: urlArchivo,

                id_ListaVisibilidad: id_ListaVisibilidad,
            };

            const updatePost = await PostAcademico.update(data_updatePost, { where: { id: info_PostAcademica.id } });
            return res.json({ message: 'Se ha actualizado el post Académico', updatePost });
        }

    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    update_Estado_postAcademico: async (req, res) => {
        const {
            externalId, estado } = req.body;

        const info_PostAcademica = await PostAcademico.findOne({ where: { external_id: externalId } });


        const data_updatePost = {
            estado: estado
        };

        const updatePost = await PostAcademico.update(data_updatePost, { where: { id: info_PostAcademica.id } });
        return res.json({ message: 'Se ha actualizado el estado del post Académico', updatePost });
    },
    /**
    * 
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    deletepostAcademico: async (req, res) => {
        const { externalId } = req.body;

        const info_PostAcademica = await PostAcademico.findOne({ where: { external_id: externalId } });

        if (info_PostAcademica) {
            if (info_PostAcademica.public_id_imagen != null && info_PostAcademica.public_id_archivo != null) {
                await cloudinaryC.deleteFile(info_PostAcademica.public_id_imagen);
                await cloudinaryC.deleteFile(info_PostAcademica.public_id_archivo);

                await PostAcademico.destroy({ where: { id: info_PostAcademica.id } });
                return res.json({ message: 'Se ha eleminado el post Académico' });
            } else {
                await PostAcademico.destroy({ where: { id: info_PostAcademica.id } });
                return res.json({
                    message: 'Se ha eleminado el post Académico'
                });
            }
        } else {
            return res.json({
                message: 'Se ha producido un error'
            });
        }
    },
    /** fin Implementado try cath*/
    verifyToken: async (req, res, next) => {
        try {
            if (!req.headers.authorization) {
                return res.status(401).send('Unauhtorized Request 1');
            }
            let token = req.headers.authorization.split(' ')[1];
            if (token === 'null') {
                return res.status(401).send('Unauhtorized Request 2');
            }

            const payload = await jwt.verify(token, process.env.Secret_key);
            if (!payload) {
                return res.status(401).send('Unauhtorized Request 3');
            }
            req.userId = payload._id;
            next();
        } catch (e) {
            console.log(e)
            return res.status(401).send('Unauhtorized Request 4');
        }
    }
}
module.exports = controller;