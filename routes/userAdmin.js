const express = require('express');
const router = express.Router();

const UserAdminController = require( '../Controllers/UserAdmin')

//import middlewares
const isAuth = require('../Middlewares/isAuth');

//add to cart route
router.post('/addToCart',isAuth,UserAdminController.addToCart)

//remove from cart route
router.post('/removeFromCart',isAuth,UserAdminController.removeFromCart)

module.exports = router;