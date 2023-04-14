const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();

const courierController = require('../controllers/courier');

router.get('/get-courier', tryCatch(courierController.getCourier));

router.post('/post-courier', tryCatch(courierController.postCourier));

router.get('/getCrcustumers', tryCatch(courierController.getCustomers));

router.get('/getCrcustumer/:id', tryCatch(courierController.getCustomerById));

router.get('/get-Cguide/:id', tryCatch(courierController.getCourierGuidesById));

module.exports = router;