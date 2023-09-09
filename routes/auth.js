const express = require("express");
const router = express.Router();

//for google auth
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http:///auth/google"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

//importing express validator
const {body} = require('express-validator') 

//import Controllers
const authController = require("../Controllers/Auth");
const isAuth = require("../Middlewares/isAuth");

//login
router.post("/login", authController.Login);

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
  authController.Signup
);

//handle sending verification email
router.get('/verifyEmail',isAuth,authController.sendUserVerification)

//verify user
router.get('/verifyUser',isAuth,authController.verifyUser);

//verify user
router.get('/passEmail',authController.sendUserPass);

//forget password
router.post('/forgetPass',isAuth,[body(
  "password",
  "Please enter a valid password using at least 8 characters, 1 Capital letter, 1 small leter, 1 symbol"
)
  .trim()
  .isLength({ min: 8 }) //at least 8 characters
  .matches(/[A-Z]/) // At least 1 capital letter
  .matches(/[a-z]/) // At least 1 small letter
  .matches(/[!@#$%^&*(),.?":{}|<>]/), // At least 1 symbol
],authController.changePass);

//google login
router.get('/google',authController.googleLogin);

//place order
router.get('/placeOrder',isAuth,authController.placeOrder);

module.exports = router;
