const express = require('express');
const router = express.Router();

//import auth middleware
const isAuth = require('../Middlewares/isAuth');

router.get('/',isAuth)

module.exports = router;