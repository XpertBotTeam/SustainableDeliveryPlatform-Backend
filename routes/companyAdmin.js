const express = require("express");
const router = express.Router();

//importing express validator
const { body } = require("express-validator");

const CompanyAdminController = require("../Controllers/CompanyAdmin");

//import middlewares
const isAuth = require("../Middlewares/isAuth");

//add product
router.post(
  "/addProduct",
  isAuth,
  [
    body("name", "You forgot to assign a name").trim().not().isEmpty(),
    body("imagePath", "You forgot to add an image").trim().not().isEmpty(),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("The price must be greater than 0"),
  ],
  CompanyAdminController.addNewProduct
);

//delete product
router.delete('/deleteProduct/:productId',isAuth,CompanyAdminController.deleteProduct)

//get orders
router.get('/orders',isAuth,CompanyAdminController.getOrders);

module.exports = router;
