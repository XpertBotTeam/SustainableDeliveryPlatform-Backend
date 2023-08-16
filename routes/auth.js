const express = require("express");
const router = express.Router();

//importing express validator
const {body} = require('express-validator') 

//import Controllers
const { Login, Signup } = require("../Controllers/Auth");

//login
router.post("/login", Login);

//signup
router.post(
  "/signup",
  [
    //signup validation
    body("userName", "Please enter a valid email").isEmail(),
    body(
      "password",
      "Please enter a valid password using at least 8 characters, 1 Capital letter, 1 small leter, 1 symbol"
    )
      .trim()
      .isLength({ min: 8 }) //at least 8 characters
      .matches(/[A-Z]/) // At least 1 capital letter
      .matches(/[a-z]/) // At least 1 small letter
      .matches(/[!@#$%^&*(),.?":{}|<>]/), // At least 1 symbol
    body("name", "Please enter a valid name").trim().not().isEmpty(),
    body("type", "You forgot to assign a type").trim().not().isEmpty(),
  ],
  Signup
);

module.exports = router;
