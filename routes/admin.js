const express = require('express');
const router = express.Router();

const AdminController = require( '../Controllers/Admin')

//import middlewares
const isAuth = require('../Middlewares/isAuth');

//router.post('/addProduct',isAuth,CompanyAdminController.addProduct)

router.post('/editUser',isAuth,AdminController.editUserProfile)

module.exports = router;