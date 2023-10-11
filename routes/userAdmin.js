const express = require('express');
const router = express.Router();

const UserAdminController = require( '../Controllers/UserAdmin')

//import middlewares
const isAuth = require('../Middlewares/isAuth');

//add to cart route
router.post('/addToCart',isAuth,UserAdminController.addToCart)

//add to cart route
router.get('/placeOrder',isAuth,UserAdminController.placeOrder)

//remove from cart route
router.post('/removeFromCart',isAuth,UserAdminController.removeFromCart)

//get orders
router.get('/myOrders',isAuth,UserAdminController.getOrders)

//get orders
router.get('/myCart',isAuth,UserAdminController.getCart)

//track order
router.post('/trackOrder/:orderId',isAuth,UserAdminController.trackOrder)

module.exports = router;