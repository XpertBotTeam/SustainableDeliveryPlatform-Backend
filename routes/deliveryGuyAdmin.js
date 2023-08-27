const express = require('express');
const router = express.Router();

//importing controllers
const DeliveryController = require('../Controllers/DeliveryGuyAdmin');

//importing middlewares
const isAuth = require('../Middlewares/isAuth');

router.get('/AllOrders',isAuth,DeliveryController.getOrders);

router.get('/MyOrders',isAuth,DeliveryController.getOrdersByDeliveryGuy);

router.post('/AssignOrders/:orderId',isAuth,DeliveryController.assignOrder);



module.exports = router;