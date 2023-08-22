//import Models
const User = require("../Models/User");
const Company = require("../Models/Company");
const DeliveryGuy = require("../Models/DeliveryGuy");

//validation results from validator
const { validationResult } = require("express-validator");

//import bcrypt and jwt for authorization
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    if (user && await bcrypt.compare(Password, user.password)) {
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

      let token = jwt.sign({ user, userType },"SuperSecret",{
        expiresIn: "1h",
      });
      res.json({ jwt: token });
    } else {
      //username and password doesn't match
      console.log("authentication failed no user found");
      res.status(401).json({ message: "Authentication Failed" });
    }
  } catch (err) {
    //error happened while searching the user
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};

//handle signup
module.exports.Signup = async (req, res, next) => {
  const { type,userName } = req.body;

   //validation
   const result = validationResult(req);
   if (!result.isEmpty()) {
     console.log(result.array());
     return res.status(500).json({ message: result.array() });
   }

  try {
    user =
    (await User.findOne({ userName })) ||
    (await Company.findOne({ userName })) ||
    (await DeliveryGuy.findOne({ userName }));
    if(user){
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
    }else{
      return res.status(401).json({ message: "Type is invalid" });
    }
  } catch (err) {
    //error has occurred while signing up
    console.log(`error signup: ${err}`);
    return res.status(500).json({ message: "internal server error while signing up" });
  }
};

//helper function for signup
async function signupUserOfType(Model, req, res, next) {
  const { userName, password, name } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password,12);
  
      // Create a new user in the specified collection
      const newUser = new Model({
        userName,
        password: hashedPassword,
        name,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: "Signup successful" });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'internal server error while creating user' });
    }

  
}
