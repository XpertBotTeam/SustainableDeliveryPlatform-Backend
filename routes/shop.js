const express = require('express');
const router = express.Router();

//import auth middleware
const isAuth = require('../Middlewares/isAuth');

//import shop controller
const shopController = require('../Controllers/Shop');

router.get('/',shopController.getProducts);
router.get('/:id',shopController.getProductsByCompanyId);

module.exports = router;