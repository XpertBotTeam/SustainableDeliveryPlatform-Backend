const User = require("../Models/User");
const Company = require("../Models/Company");
const DeliveryGuy = require("../Models/DeliveryGuy");

//import bcrypt and jwt for authorization
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//handle Login Middleware
module.exports.Login = async (req, res, next) => {
  //extract User Data
  const userName = req.body.Username;
  const Password = req.body.Password;
  let user = null;

  try {
    user =
      (await User.findOne({ userName })) ||
      (await Company.findOne({ userName })) ||
      (await DeliveryGuy.findOne({ userName }));

    if (user && bcrypt.compare(Password, user.password)) {
      let token = jwt.sign(user);
      res.json({ jwt: token });
    } else {
      console.log("authentication failed no user found");
      res.status(401).json({ error: "Authentication Failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports.Signup = (req,res,next) => {
    
}

//helper function for signup
async function signupUserOfType(Model, req, res, next) {
    const { username, password, /* other fields */ } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, /* saltRounds */);

        // Create a new user in the specified collection
        const newUser = new Model({
            username,
            password: hashedPassword,
            // other fields...
        });

        await newUser.save();

        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        next(error);
    }
}
