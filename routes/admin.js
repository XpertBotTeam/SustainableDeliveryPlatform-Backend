const express = require('express');
const router = express.Router();

const AdminController = require( '../Controllers/Admin')

//import middlewares
const isAuth = require('../Middlewares/isAuth');

//router.post('/addProduct',isAuth,CompanyAdminController.addProduct)

//handle edit user route
router.post('/editUser',isAuth,AdminController.editUserProfile)

//handle delete user route
router.delete('/deleteUser',isAuth,AdminController.deleteUser)

module.exports = router;