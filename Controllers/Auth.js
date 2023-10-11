const stripe = require("stripe")(process.env.STRIPE_KEY);

const passport = require('passport');


//import Models
const User = require("../Models/User");
const Company = require("../Models/Company");
const DeliveryGuy = require("../Models/DeliveryGuy");
const Order = require('../Models/Order');



//validation results from validator
const { validationResult } = require("express-validator");

//import bcrypt and jwt for authorization
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../Utils/Mailer");

//handle Login Middleware
module.exports.Login = async (req, res, next) => {
  //extract User Data
  const userName = req.body.userName;
  const Password = req.body.password;
  let user = null;

  try {
    //trying to find user
    user =
      (await User.findOne({ userName })) ||
      (await Company.findOne({ userName })) ||
      (await DeliveryGuy.findOne({ userName }));

    //check if user exists and comparing the login credentials
    if (user && (await bcrypt.compare(Password, user.password))) {
      //user found
      //assign userType
      let userType = "";
      if (user instanceof User) {
        userType = "User";
      } else if (user instanceof Company) {
        userType = "Company";
      } else if (user instanceof DeliveryGuy) {
        userType = "DeliveryGuy";
      }

      let token = jwt.sign({ user, userType }, "SuperSecret", {
        expiresIn: "1h",
      });
      return res.status(200).json({ jwt: token });
    } else {
      //username and password doesn't match
      console.log("authentication failed no user found");
      return res.status(401).json({ message: "Authentication Failed" });
    }
  } catch (err) {
    //error happened while searching the user
    console.log(err);
     return res.status(500).json({ message: "internal server error" });
  }
};

//handle signup
module.exports.Signup = async (req, res, next) => {
  const { type, userName } = req.body;

  //validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log(result.array());
    return res.status(401).json({ message: result.array() });
  }

  try {
    user =
      (await User.findOne({ userName })) ||
      (await Company.findOne({ userName })) ||
      (await DeliveryGuy.findOne({ userName }));
    if (user) {
      return res.status(401).json({ message: "user already found" });
    }

    if (type === "User") {
      //signup as a User
      signupUserOfType(User, req, res, next);
    } else if (type === "Company") {
      //signUp as Company
      signupUserOfType(Company, req, res, next);
    } else if (type === "DeliveryGuy") {
      //signUp as deliveryGuy
      signupUserOfType(DeliveryGuy, req, res, next);
    } else {
      return res.status(401).json({ message: "Type is invalid" });
    }
  } catch (err) {
    //error has occurred while signing up
    console.log(`error signup: ${err}`);
    return res
      .status(500)
      .json({ message: "internal server error while signing up" });
  }
};

//helper function for signup
async function signupUserOfType(Model, req, res, next) {
  const { userName, password, name } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user in the specified collection
    const newUser = new Model({
      userName,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error while creating user" });
  }
}

//send verification mail
module.exports.sendUserVerification = async (req, res, next) => {
  if (req.user.verified === true) {
    return res.status(401).json({ message: "user already verified" });
  }
  const token = jwt.sign(
    { user: req.user, userType: req.userType, tokenType: "verificationToken" },
    "SuperSecret",
    {
      expiresIn: "5m",
    }
  );
  const message = `
    <h1><b>Please click the link to verify</b></h1>
    <a href='http://localhost:3000/auth/verifyUser?jwt=${token}'>Verify User</a>
    try{

    }
  `;
  try {
    const mail = await sendMail(
      req.user.userName,
      "User Verification",
      "User Verification",
      message
    );
    if (!mail) {
      return res.status(401).json({ message: "Could not send verification" });
    }
    return res
      .status(200)
      .json({ message: "please check out your email for verification" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error sending email" });
  }
};

//verifying user
module.exports.verifyUser = async (req, res, next) => {
  if (req.tokenType !== "verificationToken") {
    return res.status(401).json({ message: "jwt token is invalid" });
  }
  if (req.user.verified) {
    return res.status(401).json({ message: "user already verified" });
  }
  try {
    //verifying user
    req.user.verified = true;
    const result = await req.user.save();

    if (!result) {
      //verification failed
      return res.status(401).json({ message: "could not verify user" });
    }
    // verification was  done succesfully
    return res.status(200).json({ message: "user verified succesfully" });
  } catch (err) {
    //error handling
    console.log(err);
    return res.status(500).json({ message: "error verifying user" });
  }
};

//send forget pass email
module.exports.sendUserPass = async (req, res, next) => {
  const { userName } = req.body;
  //finding user and type
  let userType = null;

  const user = await User.findOne({ userName });
  if (user) {
    userType = "User";
  } else {
    const company = await Company.findOne({ userName });
    if (company) {
      userType = "Company";
    } else {
      const deliveryGuy = await DeliveryGuy.findOne({ userName });
      if (deliveryGuy) {
        userType = "DeliveryGuy";
      }
    }
  }

  if (!user) {
    //user not found
    return res.status(401).json({ message: "no user found" });
  }
  const token = jwt.sign(
    { user, userType, tokenType: "forgetPassToken" },
    "SuperSecret",
    {
      expiresIn: "5m",
    }
  );
  const message = `
    <h1 className='text-[green]'><b>Please click the link to change pass</b></h1>
    <a href='http://localhost:3000/auth/forgetPass?jwt=${token}'>Verify User</a>
  `;
  try {
    const mail = await sendMail(
      user.userName,
      "forget pass",
      "forget Pass",
      message
    );
    if (!mail) {
      //mail wasnt sent
      return res.status(401).json({ message: "Could not send verification" });
    }
    //mail sent
    return res
      .status(200)
      .json({ message: "please check out your email for verification" });
  } catch (err) {
    //error handling
    console.log(err);
    res.status(500).json({ message: "error sending email" });
  }
};

//changing pass
module.exports.changePass = async (req, res, next) => {
  if (req.tokenType !== "forgetPassToken") {
    return res.status(401).json({ message: "jwt token is invalid" });
  }
  try {
    //changing pass
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    req.user.password = hashedPassword;
    console.log(req.user);
    const result = await req.user.save();

    if (!result) {
      //pass change failed
      return res.status(401).json({ message: "could not change pass" });
    }
    // pass was changed succesfully
    return res.status(200).json({ message: "pass changed succesfully" });
  } catch (err) {
    //error handling
    console.log(err);
    return res.status(500).json({ message: "error changing pass" });
  }
};



//user validity
module.exports.returnUserValidity = (req,res,next) => {
  if(req.user && req.userType){
    //authorized
    return res.status(200).json({authorized:true,userType:req.userType,user:req.user})
  }

  //not authorized
  return res.staus(401).json({authorized:false,userType:null});
}

//google auth
module.exports.googleLogin =   passport.authenticate('google', {
  scope: ['profile', 'email'],
  failureRedirect: '/'
});

module.exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }

    const token = jwt.sign(
      { user, userType: 'User' },
      "SuperSecret",
      { expiresIn: "1h" }
    );

    return res.json({ jwt: token, user });
  })(req, res, next);
};