const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const listaVisibilidadController = require('../controllers/listaVisibilidadController');

router.get('/get_AllListaVisibilidad/:externalId', (listaVisibilidadController.getAllListaVisibilidad));
router.post('/create_ListaVisibilidad', (listaVisibilidadController.createListaVisibilidad));
router.post('/update_ListaVisibilidad', (listaVisibilidadController.updateListaVisibilidad));
router.post('/delete_ListaVisibilidad', (listaVisibilidadController.deleteListaVisibilidad));



module.exports = router;

