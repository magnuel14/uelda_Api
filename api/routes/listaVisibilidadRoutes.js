const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const listaVisibilidadController = require('../controllers/listaVisibilidadController');

router.get('/get_AllListaVisibilidad/:externalId', listaVisibilidadController.verifyToken, tryCatch(listaVisibilidadController.getAllListaVisibilidad));
router.get('/getListaVisibilidadByExternalId/:externalId', listaVisibilidadController.verifyToken, tryCatch(listaVisibilidadController.getListaVisibilidadByExternalId));
router.post('/create_ListaVisibilidad', listaVisibilidadController.verifyToken, tryCatch(listaVisibilidadController.createListaVisibilidad));
router.post('/update_ListaVisibilidad', listaVisibilidadController.verifyToken, tryCatch(listaVisibilidadController.updateListaVisibilidad));
router.post('/delete_ListaVisibilidad', listaVisibilidadController.verifyToken, tryCatch(listaVisibilidadController.deleteListaVisibilidad));
router.post('/get_Personas', listaVisibilidadController.verifyToken, tryCatch(listaVisibilidadController.getPersonas));

module.exports = router;

