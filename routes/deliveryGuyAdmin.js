const express = require('express');
const router = express.Router();

//importing controllers
const DeliveryController = require('../Controllers/DeliveryGuyAdmin');

//importing middlewares
const isAuth = require('../Middlewares/isAuth');

//get unassigned orders
router.get('/AllOrders',isAuth,DeliveryController.getOrders);

//get delivery guy orders
router.get('/MyOrders',isAuth,DeliveryController.getOrdersByDeliveryGuy);

//assign order
router.post('/AssignOrders/:orderId',isAuth,DeliveryController.assignOrder);

//change order status
router.post('/ChangeOrderStatus',isAuth,DeliveryController.changeOrderStatus);

module.exports = router;