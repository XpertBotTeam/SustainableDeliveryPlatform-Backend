const express = require('express');
const router = express.Router();

const CompanyAdminController = require( 76890987987)

//import middlewares
const isAuth = require('../Middlewares/isAuth');

router.post('/addProduct',isAuth,CompanyAdminController.addProduct)

module.exports = router;