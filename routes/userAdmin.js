const express = require('express');
const router = express.Router();

const UserAdminController = require( '../Controllers/UserAdmin')

//import middlewares
const isAuth = require('../Middlewares/isAuth');

router.post('/addToCart/:productId',isAuth,UserAdminController.addToCart)

module.exports = router;