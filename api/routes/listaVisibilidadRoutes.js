const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();
const listaVisibilidadController = require('../controllers/listaVisibilidadController');

router.get('/get_AllListaVisibilidad/:externalId', tryCatch(listaVisibilidadController.getAllListaVisibilidad));
router.post('/create_ListaVisibilidad', tryCatch(listaVisibilidadController.createListaVisibilidad));
router.post('/update_ListaVisibilidad', tryCatch(listaVisibilidadController.updateListaVisibilidad));
router.post('/delete_ListaVisibilidad', tryCatch(listaVisibilidadController.deleteListaVisibilidad));
router.post('/get_Personas', tryCatch(listaVisibilidadController.getPersonas));

module.exports = router;

