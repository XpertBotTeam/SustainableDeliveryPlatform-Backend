const express = require('express');
const router = express.Router();

const CompanyAdminController = require( '../Controllers/CompanyAdmin')

//import middlewares
const isAuth = require('../Middlewares/isAuth');

//router.post('/addProduct',isAuth,CompanyAdminController.addProduct)

module.exports = router;