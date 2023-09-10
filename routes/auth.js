const express = require("express");
const router = express.Router();


//jwt
const jwt = require("jsonwebtoken");
//import Models
const User = require("../Models/User");
const Company = require("../Models/Company");
const DeliveryGuy = require("../Models/DeliveryGuy");
const Order = require('../Models/Order');

//google auth
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

//google auth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
async function(accessToken, refreshToken, profile, cb) {
  try {
    let user = await User.findOne({ userName: profile.emails[0].value });

    if(user) {
      const token = jwt.sign(
        { user, userType: 'User' },
        "SuperSecret",
        { expiresIn: "1h" }
      );

      return cb(null, { user, token });
    } else {
      let deliveryGuy = await DeliveryGuy.findOne({ userName: profile.emails[0].value });

      if(deliveryGuy) {
        const token = jwt.sign(
          { user: deliveryGuy, userType: 'DeliveryGuy' },
          "SuperSecret",
          { expiresIn: "1h" }
        );

        return cb(null, { user: deliveryGuy, token });
      } else {
        let company = await Company.findOne({ userName: profile.emails[0].value });

        if(company) {
          const token = jwt.sign(
            { user: company, userType: 'Company' },
            "SuperSecret",
            { expiresIn: "1h" }
          );

          return cb(null, { user: company, token });
        } else {
          return cb(new Error('Please sign up first using your Google account credentials'));
        }
      }
    }
  } catch (err) {
    return cb(err);
  }
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

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
router.get('/google/callback',authController.googleCallback);


//place order
router.get('/placeOrder',isAuth,authController.placeOrder);

module.exports = router;
