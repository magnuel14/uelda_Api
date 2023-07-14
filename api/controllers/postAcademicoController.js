'use strict';
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const cloudinaryC = require('../../cloudinary');
const fs = require('fs-extra');

const Persona = models.persona;
const Cuenta = models.cuenta;
const Rol = models.rol;
const PostAcademico = models.postAcademico;


let controller = {
    /** Implementado try cath*/
    createpostAcademico: async (req, res) => {

        const {
            externalId,
            titulo, tipoArchivo, descripcion,
            urlImagen, urlArchivo,
            visibilidad, id_ListaVisibilidad } = req.body;

        const infoPersona = await Persona.findOne({ where: { external_id: externalId } })

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

                    id_ListaVisibilidad: id_ListaVisibilidad,
                    id_persona: infoPersona.id,
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

                    id_ListaVisibilidad: id_ListaVisibilidad,
                    id_persona: infoPersona.id,
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

                    id_ListaVisibilidad: id_ListaVisibilidad,
                    id_persona: infoPersona.id,
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
                id_ListaVisibilidad: id_ListaVisibilidad,
                id_persona: infoPersona.id
            };

            const newPost = await PostAcademico.create(data_newPost);
            return res.json({ message: 'Se ha creado el post Académico', newPost });
        }

    },
    /**
     * Funcion para ingresar al sistema
     * @param {*} req 
     * @param {*} res 
     * Recibe el correro, clave del usuario
     * checkedT esta es la comporbacion del usuario si desa ser recordado.
     * @returns Un token de sesión e información del usuario
     */
    singnin: async (req, res) => {
        const { correo, clave, checkedT } = req.body;
        //busca que el correro sea valido
        const userCuenta = await Cuenta.findOne({ where: { correo: correo } });
        if (!userCuenta) return res.json({ message: 'No existe una cuenta ligada a ese correro', flag: 1 });
        if (userCuenta.estado != 0) return res.json(
            { message: 'La cuenta esta inactiva, comuniquese con la UELDA', flag: 1 });
        //console.log(userCuenta);
        let passwordEncript = userCuenta.clave;
        //console.log(passwordEncript);
        const passwordValide = await bcrypt.compare(clave, passwordEncript);
        //console.log(passwordValide)
        if (!passwordValide) return res.json({ message: 'Contraseña equivocada', flag: 1 });
        const persona = await Persona.findOne({ where: { id: userCuenta.id_persona } })
        const rol = await Rol.findOne({ where: { id: persona.id_rol } })
        if (!checkedT) {
            const token = jwt.sign({ id: userCuenta.id }, process.env.Secret_key, { expiresIn: '8h' });
            res.json({ token, persona, rol });
            //console.log('8 horas')
        } else {
            const token = jwt.sign({ id: userCuenta.id }, process.env.Secret_key, { expiresIn: '30d' });
            res.json({ token, persona, rol });
            //console.log('30 dias')
        }
    },
    /**
    * updateCuenta: Esta funcion sirve para actualizar los datos de cuenta
    * @param {*} req 
    * @param {*} res 
    * Esta lista se compone externalId, correo y clave.
    * Se hace una busqueda en cuenta por id
    * Se carga el id de cuenta el cual se usa en la condicion "where" (sql)
    * Y la dataCuenta que es la información nueva de cuenta
    * Esta clave es encriptada para enviarla a la BD
    * @returns Un mensaje de comprobación de estado de la tarea
    */
    updateCuenta: async (req, res) => {
        const { externalId, clave } = req.body
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const updateDataCuenta = await Cuenta.findOne({ where: { id_persona: infoPersona.id } });
        //console.log(req.files)
        if (!req.files) {
            var salt = bcrypt.genSaltSync(10);
            let password = bcrypt.hashSync(clave, salt);
            const dataCuenta = {
                clave: password,
            };
            if (!updateDataCuenta) return res.json({ message: 'Ocurrio un error' })
            await Cuenta.update(dataCuenta, { where: { id: updateDataCuenta.id } });
            return res.json({ message: 'Se ha actualizado su contraseña' });
        } else {
            if (infoPersona.public_id != null) {
                await cloudinaryC.deleteFile(infoPersona.public_id);
                if (req.files?.foto) {
                    const result = await cloudinaryC.uploadImage(req.files.foto.tempFilePath);
                    const dataFoto = {
                        foto: result.secure_url,
                        public_id: result.public_id
                    }
                    if (clave != 'null') {
                        var salt = bcrypt.genSaltSync(10);
                        let password = bcrypt.hashSync(clave, salt);
                        const dataCuenta = {
                            clave: password,
                        };
                        await fs.unlink(req.files.foto.tempFilePath)
                        if (!updateDataCuenta) return res.json({ message: 'Ocurrio un error' })
                        await Cuenta.update(dataCuenta, { where: { id: updateDataCuenta.id } });
                        await Persona.update(dataFoto, { where: { id: infoPersona.id } });
                        return res.json({ message: 'Se ha actualizado su información de usuario', dataFoto });
                    } else {
                        await Persona.update(dataFoto, { where: { id: infoPersona.id } });
                        return res.json({ message: 'Se ha actualizado su información de usuario', dataFoto });
                    }
                }
            } else {
                if (req.files?.foto) {
                    const result = await cloudinaryC.uploadImage(req.files.foto.tempFilePath);
                    const dataFoto = {
                        foto: result.secure_url,
                        public_id: result.public_id
                    }
                    if (clave != 'null') {
                        var salt = bcrypt.genSaltSync(10);
                        let password = bcrypt.hashSync(clave, salt);
                        const dataCuenta = {
                            clave: password,
                        };
                        await fs.unlink(req.files.foto.tempFilePath)
                        if (!updateDataCuenta) return res.json({ message: 'Ocurrio un error' })
                        await Cuenta.update(dataCuenta, { where: { id: updateDataCuenta.id } });
                        await Persona.update(dataFoto, { where: { id: infoPersona.id } });
                        return res.json({ message: 'Se ha actualizado su información de usuario', dataFoto });
                    } else {
                        await Persona.update(dataFoto, { where: { id: infoPersona.id } });
                        return res.json({ message: 'Se ha actualizado su información de usuario', dataFoto });
                    }
                }
            }
        }
    },
    /**
    * updateEstadoCuenta: Esta funcion sirve para actualizar el estado de una cuenta
    * @param {*} req 
    * @param {*} res 
    * Esta lista se compone idP y estado.
    * Se hace una busqueda en cuenta por id de persona
    * Se carga el id de cuenta el cual se usa en la condicion "where" (sql)
    * Y la dataCuenta que es la información nueva de cuenta
    * @returns Un mensaje de comprobación de estado de la tarea
    */
    updateEstadoCuenta: async (req, res) => {
        const { externalId, estado } = req.body
        const dataCuenta = {
            estado: estado
        };
        const infoPersona = await Persona.findOne({ where: { external_id: externalId } });
        const updateDataCuenta = await Cuenta.findOne({ where: { id_persona: infoPersona.id } });
        if (!updateDataCuenta) return res.json({ message: 'Ocurrio un error' })
        await Cuenta.update(dataCuenta, { where: { id: updateDataCuenta.id } });
        return res.json({
            message: 'Se ha actualizado el estado de la cuenta de: ',
            apellido: infoPersona.apellido, nombre: infoPersona.nombre
        });
    }
}
/** fin Implementado try cath*/
module.exports = controller;