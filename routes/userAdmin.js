const express = require('express');
const router = express.Router();

const UserAdminController = require( '../Controllers/UserAdmin')

//import middlewares
const isAuth = require('../Middlewares/isAuth');


module.exports = router;