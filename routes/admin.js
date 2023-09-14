const express = require('express');
const router = express.Router();

const AdminController = require( '../Controllers/Admin')

//import middlewares
const isAuth = require('../Middlewares/isAuth');

//upload image util function
const ImageUpload = require('../Utils/ImageUpload');

//router.post('/addProduct',isAuth,CompanyAdminController.addProduct)

//handle edit user route
router.post('/editUser',isAuth,AdminController.editUserProfile)

//handle delete user route
router.delete('/deleteUser',isAuth,AdminController.deleteUser)

router.post('/editProfilePicture',isAuth,ImageUpload,AdminController.UpdateProfilePicture)

module.exports = router;