const express = require('express');
const router = express.Router();

//import Controllers
const {Login} = require('../Controllers/Auth');

//login
router.get('/login',Login)

//signup
//router.get('/signup',authController.Signup)

module.exports = router