const express = require("express");
const router = express.Router();

//importing express validator
const { body } = require("express-validator");

const CompanyAdminController = require("../Controllers/CompanyAdmin");

//import middlewares
const isAuth = require("../Middlewares/isAuth");
const ImageUpload = require('../Utils/ImageUpload');

//add product

router.post(
  "/addProduct",
  isAuth,
  ImageUpload,
  [
  body("name", "You forgot to assign a name").trim().not().isEmpty(),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("The price must be greater than 0"),
  ],
  CompanyAdminController.addNewProduct
);


//edit product
router.post(
  "/editProduct",
  isAuth,
  ImageUpload,
  [
    body("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("The price must be greater than 0"),
  ],
  CompanyAdminController.editProduct
);

//delete product
router.delete('/deleteProduct/:productId',isAuth,CompanyAdminController.deleteProduct)

//get orders
router.get('/orders',isAuth,CompanyAdminController.getOrders);

//update bbannerImage
router.post('/updateBanner',isAuth,ImageUpload,CompanyAdminController.editBannerImage)

module.exports = router;
