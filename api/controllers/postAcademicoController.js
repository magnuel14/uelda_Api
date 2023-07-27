'use strict';
const models = require('../models');
const cloudinaryC = require('../../cloudinary');
const { Op } = require('sequelize');

const Persona = models.persona;
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
        const all_postAcademicos = await PostAcademico.findAll();

        let lista_postAca_personas = [];

        for (let i = 0; i < all_postAcademicos.length; i++) {
            const visibilidad = all_postAcademicos[i].visibilidad;
            const id_ListaVisibilidad = all_postAcademicos[i].id_ListaVisibilidad;


            const estado = all_postAcademicos[i].estado;
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


                    lista_postAca_personas.push({
                        post, inforPersona, personas
                    });
                }
            }
            return res.json(lista_postAca_personas);

        }
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

            } else if (visibilidad === 2) {
                let post = [];
                let personas = [];

                const info_lista = await ListaVisibilidad.findOne({
                    include: [
                        { model: ListaVisibilidad_persona }
                    ],
                    where: { id: id_ListaVisibilidad }
                });
                infoPostAcademico.personas = info_lista.listaVisibilidad_personas;

                post.push(infoPostAcademico);

                for (let j = 0; j < info_lista.listaVisibilidad_personas.length; j++) {
                    const external_id = info_lista.listaVisibilidad_personas[j].external_id_persona;
                    personas.push({ external_id: external_id });


                    lista_postAca_personas.push(
                        post, inforPersona, personas
                    );
                }

                lista_postAca_personas.push({
                    post, inforPersona, personas
                });
            }
            return res.json(lista_postAca_personas);

        } else {
            return res.json({ message: 'Ocurrio un error' });

        }

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
            if (req.files?.foto && !req.files?.doc) {
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
                return res.json({ message: 'Se ha creado el post Académico', newPost });


            } else if (req.files?.doc && !req.files?.foto) {
                //const resultFoto = await cloudinaryC.uploadImagePost(req.files.foto.tempFilePath);
                const resultDoc = await cloudinaryC.uploadFilePost(req.files.doc.tempFilePath);

                const data_newPost = {
                    titulo: titulo,
                    tipoArchivo: tipoArchivo,
                    descripcion: descripcion,
                    visibilidad: visibilidad,

                    url_imagen: urlImagen,

                    url_archivo: resultDoc.secure_url,
                    public_id_archivo: resultDoc.public_id,

                    id_anioLectivo_actual: info_AnioLectivo_actual.id,

                    id_ListaVisibilidad: id_ListaVisibilidad,
                    id_persona: infoPersona.id,
                    estado: 0
                };

                const newPost = await PostAcademico.create(data_newPost);
                return res.json({ message: 'Se ha creado el post Académico', newPost });


            } else if (req.files?.foto && req.files?.doc) {
                const resultFoto = await cloudinaryC.uploadImagePost(req.files.foto.tempFilePath);
                const resultDoc = await cloudinaryC.uploadFilePost(req.files.doc.tempFilePath);

                const data_newPost = {
                    titulo: titulo,
                    tipoArchivo: tipoArchivo,
                    descripcion: descripcion,
                    visibilidad: visibilidad,

                    url_imagen: resultFoto.secure_url,
                    public_id_imagen: resultFoto.public_id,

                    url_archivo: resultDoc.secure_url,
                    public_id_archivo: resultDoc.public_id,

                    id_anioLectivo_actual: info_AnioLectivo_actual.id,

                    id_ListaVisibilidad: id_ListaVisibilidad,
                    id_persona: infoPersona.id,
                    estado: 0
                };

                const newPost = await PostAcademico.create(data_newPost);
                return res.json({ message: 'Se ha creado el post Académico', newPost });
            }
        } else {

            const data_newPost = {
                titulo: titulo,
                tipoArchivo: tipoArchivo,
                descripcion: descripcion,
                visibilidad: visibilidad,
                url_imagen: urlImagen,
                url_archivo: urlArchivo,

                id_anioLectivo_actual: info_AnioLectivo_actual.id,
                id_ListaVisibilidad: id_ListaVisibilidad,
                id_persona: infoPersona.id,
                estado: 0
            };

            const newPost = await PostAcademico.create(data_newPost);
            return res.json({ message: 'Se ha creado el post Académico', newPost });
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
            if (req.files?.foto && !req.files?.doc) {
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

                        url_imagen: urlImagen,
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

                        url_imagen: urlImagen,
                        url_archivo: urlArchivo,
                        id_ListaVisibilidad: id_ListaVisibilidad,
                    };

                    const updatePost = await PostAcademico.update(data_updatePost, { where: { id: info_PostAcademica.id } });
                    return res.json({ message: 'Se ha actualizado el post Académico', updatePost });
                }

            } else if (req.files?.doc && !req.files?.foto) {
                //const resultFoto = await cloudinaryC.uploadImagePost(req.files.foto.tempFilePath);
                if (info_PostAcademica.public_id_archivo != null) {
                    await cloudinaryC.deleteFile(info_PostAcademica.public_id_archivo);

                    const resultDoc = await cloudinaryC.uploadFilePost(req.files.doc.tempFilePath);

                    const data_updatePost = {
                        titulo: titulo,
                        tipoArchivo: tipoArchivo,
                        descripcion: descripcion,
                        visibilidad: visibilidad,

                        url_imagen: urlImagen,

                        url_archivo: resultDoc.secure_url,
                        public_id_archivo: resultDoc.public_id,

                        id_ListaVisibilidad: id_ListaVisibilidad,
                    };

                    const updatePost = await PostAcademico.update(data_updatePost, { where: { id: info_PostAcademica.id } });
                    return res.json({ message: 'Se ha actualizado el post Académico', updatePost });
                } else {
                    const resultDoc = await cloudinaryC.uploadFilePost(req.files.doc.tempFilePath);

                    const data_updatePost = {
                        titulo: titulo,
                        tipoArchivo: tipoArchivo,
                        descripcion: descripcion,
                        visibilidad: visibilidad,

                        url_imagen: urlImagen,

                        url_archivo: resultDoc.secure_url,
                        public_id_archivo: resultDoc.public_id,

                        id_ListaVisibilidad: id_ListaVisibilidad,
                    };

                    const updatePost = await PostAcademico.update(data_updatePost, { where: { id: info_PostAcademica.id } });
                    return res.json({ message: 'Se ha actualizado el post Académico', updatePost });
                }

            } else if (req.files?.foto && req.files?.doc) {
                if (info_PostAcademica.public_id_imagen != null && info_PostAcademica.public_id_archivo != null) {
                    await cloudinaryC.deleteFile(info_PostAcademica.public_id_imagen);
                    await cloudinaryC.deleteFile(info_PostAcademica.public_id_archivo);

                    const resultFoto = await cloudinaryC.uploadImagePost(req.files.foto.tempFilePath);
                    const resultDoc = await cloudinaryC.uploadFilePost(req.files.doc.tempFilePath);

                    const data_updatePost = {
                        titulo: titulo,
                        tipoArchivo: tipoArchivo,
                        descripcion: descripcion,
                        visibilidad: visibilidad,

                        url_imagen: resultFoto.secure_url,
                        public_id_imagen: resultFoto.public_id,

                        url_archivo: resultDoc.secure_url,
                        public_id_archivo: resultDoc.public_id,

                        id_ListaVisibilidad: id_ListaVisibilidad,
                    };

                    const updatePost = await PostAcademico.update(data_updatePost, { where: { id: info_PostAcademica.id } });
                    return res.json({ message: 'Se ha actualizado el post Académico', updatePost });
                } else {
                    const resultFoto = await cloudinaryC.uploadImagePost(req.files.foto.tempFilePath);
                    const resultDoc = await cloudinaryC.uploadFilePost(req.files.doc.tempFilePath);

                    const data_updatePost = {
                        titulo: titulo,
                        tipoArchivo: tipoArchivo,
                        descripcion: descripcion,
                        visibilidad: visibilidad,

                        url_imagen: resultFoto.secure_url,
                        public_id_imagen: resultFoto.public_id,

                        url_archivo: resultDoc.secure_url,
                        public_id_archivo: resultDoc.public_id,

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

        if (info_PostAcademica.public_id_imagen != null && info_PostAcademica.public_id_archivo != null) {
            await cloudinaryC.deleteFile(info_PostAcademica.public_id_imagen);
            await cloudinaryC.deleteFile(info_PostAcademica.public_id_archivo);

            const updatePost = await PostAcademico.destroy({ where: { id: info_PostAcademica.id } });
            return res.json({ message: 'Se ha eleminado el post Académico', updatePost });
        } else {
            const updatePost = await PostAcademico.destroy({ where: { id: info_PostAcademica.id } });
            return res.json({ message: 'Se ha eleminado el post Académico', updatePost });
        }
    }
    /** fin Implementado try cath*/
}
module.exports = controller;