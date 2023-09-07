const express = require('express');
const router = express.Router();

//import auth middleware
const isAuth = require('../Middlewares/isAuth');

//import shop controller
const shopController = require('../Controllers/Shop');


//get companies associated with products
router.get('/getCompanyProducts',shopController.getCompaniesProducts)

//get all products
router.get('/getProducts',shopController.getProducts);

//get products by companyId for users
router.get('/getProductsByCompany/:companyid',shopController.getProductsByCompanyId);

//get products by companyId for companies (for edit later)
router.get('/getProductsByCompany',isAuth,shopController.getProductsByCompanyId);


module.exports = router;