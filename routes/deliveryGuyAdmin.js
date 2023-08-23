const express = require('express');
const router = express.Router();

//importing controllers
const DeliveryController = require('../Controllers/DeliveryGuyAdmin');

//importing middlewares
const isAuth = require('../Middlewares/isAuth');

router.get('/Orders',isAuth,DeliveryController.getOrders)

module.exports = router;