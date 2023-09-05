/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./bin/www":
/*!*****************!*\
  !*** ./bin/www ***!
  \*****************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("//#!/usr/bin/env node\n\n/**\n * Module dependencies.\n */\n\n(__webpack_require__(/*! dotenv */ \"dotenv\").config)();\n\nvar app = __webpack_require__(/*! ../app */ \"./app.js\");\nvar debug = __webpack_require__(/*! debug */ \"debug\")('bobproject:server');\nvar http = __webpack_require__(/*! http */ \"http\");\n\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n/**\n * Get port from environment and store in Express.\n */\n\nvar port = normalizePort(process.env.PORT || '3000');\napp.set('port', port);\n\n/**\n * Create HTTP server.\n */\n\nvar server = http.createServer(app);\n\n/**\n * Listen on provided port, on all network interfaces.\n */\n\nmongoose.connect(process.env.MONGODB_URL).then(result => {\n    server.listen(port);\n    server.on('error', onError);\n    server.on('listening', onListening);\n}).catch(err => {\n  console.log('Could not connect to database');\n})\n\n/**\n * Normalize a port into a number, string, or false.\n */\n\nfunction normalizePort(val) {\n  var port = parseInt(val, 10);\n\n  if (isNaN(port)) {\n    // named pipe\n    return val;\n  }\n\n  if (port >= 0) {\n    // port number\n    return port;\n  }\n\n  return false;\n}\n\n/**\n * Event listener for HTTP server \"error\" event.\n */\n\nfunction onError(error) {\n  if (error.syscall !== 'listen') {\n    throw error;\n  }\n\n  var bind = typeof port === 'string'\n    ? 'Pipe ' + port\n    : 'Port ' + port;\n\n  // handle specific listen errors with friendly messages\n  switch (error.code) {\n    case 'EACCES':\n      console.error(bind + ' requires elevated privileges');\n      process.exit(1);\n      break;\n    case 'EADDRINUSE':\n      console.error(bind + ' is already in use');\n      process.exit(1);\n      break;\n    default:\n      throw error;\n  }\n}\n\n/**\n * Event listener for HTTP server \"listening\" event.\n */\n\nfunction onListening() {\n  var addr = server.address();\n  var bind = typeof addr === 'string'\n    ? 'pipe ' + addr\n    : 'port ' + addr.port;\n  debug('Listening on ' + bind);\n}\n\n\n//# sourceURL=webpack://bobproject/./bin/www?");

/***/ }),

/***/ "./Controllers/Admin.js":
/*!******************************!*\
  !*** ./Controllers/Admin.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("//import utils method\nconst Company = __webpack_require__(/*! ../Models/Company */ \"./Models/Company.js\");\nconst DeliveryGuy = __webpack_require__(/*! ../Models/DeliveryGuy */ \"./Models/DeliveryGuy.js\");\nconst Order = __webpack_require__(/*! ../Models/Order */ \"./Models/Order.js\");\nconst User = __webpack_require__(/*! ../Models/User */ \"./Models/User.js\");\nconst SearchByUserType = __webpack_require__(/*! ../Utils/SearchByUserType */ \"./Utils/SearchByUserType.js\");\n\n//update User Profile\nmodule.exports.editUserProfile = async (req, res, next) => {\n  const {\n    name,\n    profileImage,\n    phoneNumber,\n    city,\n    state,\n    country\n  } = req.body;\n  console.log(req.userType);\n  try {\n    //find user to update\n    const user = await SearchByUserType(req.userType, req.user._id);\n    if (!user) {\n      return res.status(401).json({\n        message: 'not authorized'\n      });\n    }\n\n    //replace the data\n    name ? user.name = name : \"\";\n    profileImage ? user.profileImage = profileImage : \"\";\n    phoneNumber ? user.phoneNumber = phoneNumber : \"\";\n    city ? user.address.city = city : \"\";\n    state ? user.address.state = state : \"\";\n    country ? user.address.country = country : \"\";\n\n    //save data\n    const result = await user.save();\n    if (!result) {\n      return res.status(401).json({\n        message: \"Could not update user!\"\n      });\n    }\n    //updated succesfully\n    return res.status(200).json({\n      message: 'user updated succesfully'\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json({\n      message: \"Error updating user\"\n    });\n  }\n};\n\n//delete User\nmodule.exports.deleteUser = async (req, res, next) => {\n  //extract userType and userId from the request\n  const userType = req.userType;\n  const userId = req.user._id;\n  try {\n    //initialize the result\n    let result;\n\n    //delete by id\n    if (userType === 'Company') {\n      result = await Company.findByIdAndDelete(userId);\n    } else if (userType === 'DeliveryGuy') {\n      result = await DeliveryGuy.findByIdAndDelete(userId);\n    } else if (userType === 'User') {\n      result = await User.findByIdAndDelete(userId);\n    }\n    console.log(result);\n    //results confirmatoin and send response\n    if (!result) {\n      return res.status(401).json({\n        message: \"Could not delete user\"\n      });\n    }\n    return res.status(200).json({\n      message: 'user Deleted Succesfully'\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json({\n      message: \"Sorry could not delete user\"\n    });\n  }\n};\n\n//# sourceURL=webpack://bobproject/./Controllers/Admin.js?");

/***/ }),

/***/ "./Controllers/Auth.js":
/*!*****************************!*\
  !*** ./Controllers/Auth.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const stripe = __webpack_require__(/*! stripe */ \"stripe\")(\"your_stripe_secret_key\");\n\n//import Models\nconst User = __webpack_require__(/*! ../Models/User */ \"./Models/User.js\");\nconst Company = __webpack_require__(/*! ../Models/Company */ \"./Models/Company.js\");\nconst DeliveryGuy = __webpack_require__(/*! ../Models/DeliveryGuy */ \"./Models/DeliveryGuy.js\");\nconst Order = __webpack_require__(/*! ../Models/Order */ \"./Models/Order.js\");\n\n//validation results from validator\nconst {\n  validationResult\n} = __webpack_require__(/*! express-validator */ \"express-validator\");\n\n//import bcrypt and jwt for authorization\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst {\n  sendMail\n} = __webpack_require__(/*! ../Utils/Mailer */ \"./Utils/Mailer.js\");\n\n//handle Login Middleware\nmodule.exports.Login = async (req, res, next) => {\n  //extract User Data\n  const userName = req.body.userName;\n  const Password = req.body.password;\n  let user = null;\n  try {\n    //trying to find user\n    user = (await User.findOne({\n      userName\n    })) || (await Company.findOne({\n      userName\n    })) || (await DeliveryGuy.findOne({\n      userName\n    }));\n\n    //check if user exists and comparing the login credentials\n    if (user && (await bcrypt.compare(Password, user.password))) {\n      //user found\n      //assign userType\n      let userType = \"\";\n      if (user instanceof User) {\n        userType = \"User\";\n      } else if (user instanceof Company) {\n        userType = \"Company\";\n      } else if (user instanceof DeliveryGuy) {\n        userType = \"DeliveryGuy\";\n      }\n      let token = jwt.sign({\n        user,\n        userType\n      }, \"SuperSecret\", {\n        expiresIn: \"1h\"\n      });\n      res.json({\n        jwt: token\n      });\n    } else {\n      //username and password doesn't match\n      console.log(\"authentication failed no user found\");\n      res.status(401).json({\n        message: \"Authentication Failed\"\n      });\n    }\n  } catch (err) {\n    //error happened while searching the user\n    console.log(err);\n    res.status(500).json({\n      message: \"internal server error\"\n    });\n  }\n};\n\n//handle signup\nmodule.exports.Signup = async (req, res, next) => {\n  const {\n    type,\n    userName\n  } = req.body;\n\n  //validation\n  const result = validationResult(req);\n  if (!result.isEmpty()) {\n    console.log(result.array());\n    return res.status(500).json({\n      message: result.array()\n    });\n  }\n  try {\n    user = (await User.findOne({\n      userName\n    })) || (await Company.findOne({\n      userName\n    })) || (await DeliveryGuy.findOne({\n      userName\n    }));\n    if (user) {\n      return res.status(401).json({\n        message: \"user already found\"\n      });\n    }\n    if (type === \"User\") {\n      //signup as a User\n      signupUserOfType(User, req, res, next);\n    } else if (type === \"Company\") {\n      //signUp as Company\n      signupUserOfType(Company, req, res, next);\n    } else if (type === \"DeliveryGuy\") {\n      //signUp as deliveryGuy\n      signupUserOfType(DeliveryGuy, req, res, next);\n    } else {\n      return res.status(401).json({\n        message: \"Type is invalid\"\n      });\n    }\n  } catch (err) {\n    //error has occurred while signing up\n    console.log(`error signup: ${err}`);\n    return res.status(500).json({\n      message: \"internal server error while signing up\"\n    });\n  }\n};\n\n//helper function for signup\nasync function signupUserOfType(Model, req, res, next) {\n  const {\n    userName,\n    password,\n    name\n  } = req.body;\n  try {\n    // Hash the password\n    const hashedPassword = await bcrypt.hash(password, 12);\n\n    // Create a new user in the specified collection\n    const newUser = new Model({\n      userName,\n      password: hashedPassword,\n      name\n    });\n    await newUser.save();\n    res.status(201).json({\n      message: \"Signup successful\"\n    });\n  } catch (error) {\n    console.log(error);\n    return res.status(500).json({\n      message: \"internal server error while creating user\"\n    });\n  }\n}\n\n//send verification mail\nmodule.exports.sendUserVerification = async (req, res, next) => {\n  if (req.user.verified === true) {\n    return res.status(401).json({\n      message: \"user already verified\"\n    });\n  }\n  const token = jwt.sign({\n    user: req.user,\n    userType: req.userType,\n    tokenType: \"verificationToken\"\n  }, \"SuperSecret\", {\n    expiresIn: \"5m\"\n  });\n  const message = `\n    <h1><b>Please click the link to verify</b></h1>\n    <a href='http://localhost:3000/auth/verifyUser?jwt=${token}'>Verify User</a>\n    try{\n\n    }\n  `;\n  try {\n    const mail = await sendMail(req.user.userName, \"User Verification\", \"User Verification\", message);\n    if (!mail) {\n      return res.status(401).json({\n        message: \"Could not send verification\"\n      });\n    }\n    return res.status(200).json({\n      message: \"please check out your email for verification\"\n    });\n  } catch (err) {\n    console.log(err);\n    res.status(500).json({\n      message: \"error sending email\"\n    });\n  }\n};\n\n//verifying user\nmodule.exports.verifyUser = async (req, res, next) => {\n  if (req.tokenType !== \"verificationToken\") {\n    return res.status(401).json({\n      message: \"jwt token is invalid\"\n    });\n  }\n  if (req.user.verified) {\n    return res.status(401).json({\n      message: \"user already verified\"\n    });\n  }\n  try {\n    //verifying user\n    req.user.verified = true;\n    const result = await req.user.save();\n    if (!result) {\n      //verification failed\n      return res.status(401).json({\n        message: \"could not verify user\"\n      });\n    }\n    // verification was  done succesfully\n    return res.status(200).json({\n      message: \"user verified succesfully\"\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json({\n      message: \"error verifying user\"\n    });\n  }\n};\n\n//send forget pass email\nmodule.exports.sendUserPass = async (req, res, next) => {\n  const {\n    userName\n  } = req.body;\n  //finding user and type\n  let userType = null;\n  const user = await User.findOne({\n    userName\n  });\n  if (user) {\n    userType = \"User\";\n  } else {\n    const company = await Company.findOne({\n      userName\n    });\n    if (company) {\n      userType = \"Company\";\n    } else {\n      const deliveryGuy = await DeliveryGuy.findOne({\n        userName\n      });\n      if (deliveryGuy) {\n        userType = \"DeliveryGuy\";\n      }\n    }\n  }\n  if (!user) {\n    //user not found\n    return res.status(401).json({\n      message: \"no user found\"\n    });\n  }\n  const token = jwt.sign({\n    user,\n    userType,\n    tokenType: \"forgetPassToken\"\n  }, \"SuperSecret\", {\n    expiresIn: \"5m\"\n  });\n  const message = `\n    <h1 className='text-[green]'><b>Please click the link to change pass</b></h1>\n    <a href='http://localhost:3000/auth/forgetPass?jwt=${token}'>Verify User</a>\n  `;\n  try {\n    const mail = await sendMail(user.userName, \"forget pass\", \"forget Pass\", message);\n    if (!mail) {\n      //mail wasnt sent\n      return res.status(401).json({\n        message: \"Could not send verification\"\n      });\n    }\n    //mail sent\n    return res.status(200).json({\n      message: \"please check out your email for verification\"\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    res.status(500).json({\n      message: \"error sending email\"\n    });\n  }\n};\n\n//changing pass\nmodule.exports.changePass = async (req, res, next) => {\n  if (req.tokenType !== \"forgetPassToken\") {\n    return res.status(401).json({\n      message: \"jwt token is invalid\"\n    });\n  }\n  try {\n    //changing pass\n    const hashedPassword = await bcrypt.hash(req.body.password, 12);\n    req.user.password = hashedPassword;\n    console.log(req.user);\n    const result = await req.user.save();\n    if (!result) {\n      //pass change failed\n      return res.status(401).json({\n        message: \"could not change pass\"\n      });\n    }\n    // pass was changed succesfully\n    return res.status(200).json({\n      message: \"pass changed succesfully\"\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json({\n      message: \"error changing pass\"\n    });\n  }\n};\n\n//place order\nmodule.exports.placeOrder = async (req, res, next) => {\n  //the owner shall be a user and only a user\n  if (req.userType !== \"User\") {\n    return res.status(401).json({\n      message: \"not authorized user\"\n    });\n  }\n  try {\n    //search usert and add the cart with the related products\n    const user = await User.findById(req.user._id).populate(\"cart.items.productId\");\n    if (!user.cart.items.length) {\n      //cart is empty\n      return res.status(401).json({\n        message: \"cart is empty could not place order\"\n      });\n    }\n\n    // Calculate the total amount for the order and return products\n    let totalAmount = 0;\n    const productsForOrder = user.cart.items.map(cartItem => {\n      const product = cartItem.productId;\n      const quantity = cartItem.quantity;\n      totalAmount += product.price * quantity;\n      return {\n        product,\n        quantity\n      };\n    });\n\n    // Create a new order instance\n    const order = new Order({\n      userId: req.user._id,\n      items: productsForOrder,\n      total: totalAmount\n    });\n    const result = await order.save();\n    if (!result) {\n      return res.status(401).json({\n        message: \"could not place your order\"\n      });\n    }\n    //order saved succesfully\n    user.cart.items = [];\n    await user.save();\n    return res.status(200).json({\n      message: \"order is placed succesfully\"\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json({\n      message: \"error placing order\"\n    });\n  }\n};\n\n//# sourceURL=webpack://bobproject/./Controllers/Auth.js?");

/***/ }),

/***/ "./Controllers/CompanyAdmin.js":
/*!*************************************!*\
  !*** ./Controllers/CompanyAdmin.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("//importing mongoose\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\n//import Models\nconst Company = __webpack_require__(/*! ../Models/Company */ \"./Models/Company.js\");\nconst Product = __webpack_require__(/*! ../Models/Product */ \"./Models/Product.js\");\n\n//validation results from validator\nconst {\n  validationResult\n} = __webpack_require__(/*! express-validator */ \"express-validator\");\n\n//add new product\nmodule.exports.addNewProduct = async (req, res, next) => {\n  //validation\n  const result = validationResult(req);\n  if (!result.isEmpty()) {\n    console.log(result.array());\n    return res.status(500).json({\n      message: result.array()\n    });\n  }\n  const company = req.user;\n  if (req.userType != \"Company\") {\n    return res.status(401).json({\n      message: \"Unauthorized could not add product\"\n    });\n  }\n  try {\n    const {\n      name,\n      price,\n      imagePath,\n      tags,\n      description\n    } = req.body;\n    let newProduct = await new Product({\n      name,\n      price,\n      imagePath,\n      description: description ? description : null,\n      tags: tags ? tags : null,\n      ownerId: company._id\n    });\n    if (!newProduct) {\n      //adding product failed\n      return res.status(401).json({\n        message: \"Could not add product\"\n      });\n    }\n    const result = await newProduct.save();\n    if (!result) {\n      //adding product failed\n      return res.status(401).json({\n        message: \"Could not add product\"\n      });\n    }\n    //succesful\n    return res.status(200).json({\n      message: \"Product added succesfully\"\n    });\n  } catch (err) {\n    //handling errors\n    console.log(err);\n    return res.status(500).json({\n      message: \"Error adding product\"\n    });\n  }\n};\n\n//delete product\nmodule.exports.deleteProduct = async (req, res, next) => {\n  const company = req.user;\n  if (req.userType != \"Company\") {\n    return res.status(401).json({\n      message: \"Unauthorized could not delete product\"\n    });\n  }\n\n  //try finding and deleting\n  try {\n    const {\n      productId\n    } = req.params;\n    const result = await Product.findOneAndDelete({\n      ownerId: company._id,\n      _id: new mongoose.Types.ObjectId(productId)\n    });\n    if (!result) {\n      //deleting failed\n      return res.status(401).json({\n        message: \"Could not delete product\"\n      });\n    }\n    return res.status(200).json({\n      message: \"Deleted succesfully\"\n    });\n  } catch (err) {\n    //handling errors\n    console.log(err);\n    return res.status(500).json({\n      message: \"Error deleting product\"\n    });\n  }\n};\n\n//# sourceURL=webpack://bobproject/./Controllers/CompanyAdmin.js?");

/***/ }),

/***/ "./Controllers/DeliveryGuyAdmin.js":
/*!*****************************************!*\
  !*** ./Controllers/DeliveryGuyAdmin.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("//import models\nconst Order = __webpack_require__(/*! ../Models/Order */ \"./Models/Order.js\");\n\n//import mongoose\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\n//get unassined products\nmodule.exports.getOrders = async (req, res, next) => {\n  if (req.userType !== 'DeliveryGuy') {\n    //not authorized\n    return res.status(401).json({\n      message: 'Not an authorized delivery guy'\n    });\n  }\n  try {\n    //get products\n    const orders = await Order.find({\n      deliveryGuyId: null\n    });\n    if (!orders) {\n      return res.status(401).json({\n        message: 'No orders found for now'\n      });\n    }\n    //returning orders\n    return res.status(200).json({\n      orders\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json({\n      message: 'error searching for orders'\n    });\n  }\n};\n\n//get orders by delivery guy\nmodule.exports.getOrdersByDeliveryGuy = async (req, res, next) => {\n  if (req.userType !== 'DeliveryGuy') {\n    //not authorized\n    return res.status(401).json({\n      message: 'Not an authorized delivery guy'\n    });\n  }\n  try {\n    //get status param\n    const {\n      status\n    } = req.query;\n    if (status && status !== 'Completed' && status !== 'Current' && status !== 'Pending') {\n      //status code is wrong\n      return res.status(401).json({\n        message: 'status error'\n      });\n    }\n\n    //get orders\n    const id = req.user._id;\n    const orders = status ? await Order.find({\n      deliveryGuyId: id,\n      status\n    }) : await Order.find({\n      deliveryGuyId: id\n    });\n    if (!orders) {\n      //no orders found\n      return res.status(401).json({\n        message: 'No orders found for this deliveryGuy'\n      });\n    }\n    //returning orders\n    return res.status(200).json({\n      orders\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json({\n      message: 'error searching for orders'\n    });\n  }\n};\n\n//assign order\nmodule.exports.assignOrder = async (req, res, next) => {\n  if (req.userType !== 'DeliveryGuy') {\n    //not authorized\n    return res.status(401).json({\n      message: 'Not an authorized delivery guy'\n    });\n  }\n\n  //extract orderId\n  const {\n    orderId\n  } = req.params;\n  try {\n    const order = await Order.findById(orderId);\n    if (!order) {\n      //no order found\n      return res.status(401).json({\n        message: 'order not found'\n      });\n    }\n    if (order.deliveryGuyId !== null) {\n      //delivery guy already assigned\n      return res.status(401).json({\n        message: 'order has already be assigned'\n      });\n    }\n\n    //assigning delivery guy\n    order.deliveryGuyId = req.user._id;\n    const result = await order.save();\n    if (!result) {\n      //error assigning deliveryGuy\n      return res.status(401).json({\n        message: 'Could not assign deliveryGuy'\n      });\n    }\n\n    //operation done succesfully\n    return res.status(200).json({\n      message: 'deliveryGuy assigned succesfully'\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json({\n      message: 'error searching for orders'\n    });\n  }\n};\n\n//change order status\nmodule.exports.changeOrderStatus = async (req, res, next) => {\n  if (req.userType !== 'DeliveryGuy') {\n    //not a dellivery guy \n    return res.status(401).json({\n      message: 'unauthorized'\n    });\n  }\n\n  //extract orderId\n  const {\n    orderId\n  } = req.body;\n  if (!orderId) {\n    //no order id \n    return res.status(401).json({\n      message: 'order not found'\n    });\n  }\n  try {\n    //search for the order\n    const order = await Order.findById(orderId);\n    if (!order) {\n      //no order found\n      return res.status(401).json({\n        message: 'order not found'\n      });\n    }\n\n    //extract order status to be updated\n    const {\n      status\n    } = req.query;\n    if (!status) {\n      //no order status\n      return res.status(401).json({\n        message: 'please set the order status'\n      });\n    }\n\n    //must be a delivery guy to change the status\n    console.log(req.user._id);\n    if (req.user._id !== order.deliveryGuyId) {\n      return res.status(401).json({\n        message: 'not authorized'\n      });\n    }\n    if (order.status === 'Prepared' && status === 'Delivering' || order.status === 'Delivering' && status === 'Delivered') {\n      order.status = status;\n      const result = await order.save();\n      if (!result) {\n        //status was not updated succesfully\n        return res.status(401).json({\n          message: 'order status was not updated'\n        });\n      }\n      return res.status(200).json({\n        message: 'order status updated succesfully'\n      });\n    } else {\n      //status was not updated succesfully\n      return res.status(401).json({\n        message: 'order status was not updated'\n      });\n    }\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json({\n      message: 'error updating order status'\n    });\n  }\n};\n\n//# sourceURL=webpack://bobproject/./Controllers/DeliveryGuyAdmin.js?");

/***/ }),

/***/ "./Controllers/Shop.js":
/*!*****************************!*\
  !*** ./Controllers/Shop.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("//import Product Model\nconst Products = __webpack_require__(/*! ../Models/Product */ \"./Models/Product.js\");\nconst mailer = __webpack_require__(/*! ../Utils/Mailer */ \"./Utils/Mailer.js\");\nconst to = 'itanim555@gmail.com';\nconst subject = 'Test Email';\nconst text = 'This is a test email.';\nconst html = '<p>This is a <b>test</b> email.</p>';\n//import mon\n\n//get all products\nmodule.exports.getProducts = async (req, res, next) => {\n  //find all products\n  const products = await Products.find();\n  if (!products) {\n    //no products found\n    return res.status(401).json({\n      message: 'Could not find products'\n    });\n  }\n  //products found\n  return res.status(200).json({\n    products\n  });\n};\n\n//get products through company id\nmodule.exports.getProductsByCompanyId = async (req, res, next) => {\n  let id;\n\n  //checks if user is company then it grabs the id from the jwt (private) else it grabs the id from the url params (public)\n  if (req.userType === 'Company') {\n    id = req.user._id;\n  } else {\n    id = req.params.companyId;\n  }\n  if (!id) {\n    //authentication error couldnt get the id\n    return res.status(401).json({\n      message: 'could not get products'\n    });\n  }\n  try {\n    //find products by company id\n    const products = await Products.find({\n      ownerId: id\n    });\n    if (!products) {\n      //no products found\n      return res.status(401).json({\n        message: 'Could not find products'\n      });\n    }\n    //products found\n    return res.status(200).json({\n      products\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json({\n      message: 'error finding products'\n    });\n  }\n};\n\n//# sourceURL=webpack://bobproject/./Controllers/Shop.js?");

/***/ }),

/***/ "./Controllers/UserAdmin.js":
/*!**********************************!*\
  !*** ./Controllers/UserAdmin.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("//import Models\nconst User = __webpack_require__(/*! ../Models/User */ \"./Models/User.js\");\nconst Product = __webpack_require__(/*! ../Models/Product */ \"./Models/Product.js\");\n\n//importing mongoose\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\n//handle add to cart route\nmodule.exports.addToCart = async (req, res, next) => {\n  if (req.userType !== 'User') {\n    return res.status(401).json({\n      message: 'Could not add to cart as unauthorized'\n    });\n  }\n\n  //extract product id\n  const {\n    productId\n  } = req.params;\n  try {\n    const productCheck = await Product.findById(productId);\n    if (!productCheck) {\n      //no product found\n      return res.status(401).json({\n        message: 'Product not found'\n      });\n    }\n    const result = await req.user.addToCart(productId);\n    if (!result) {\n      //the product was not added to cart\n      return res.status(401).json({\n        message: 'Could not add to cart'\n      });\n    }\n\n    //product added succesfully\n    return res.status(200).json({\n      message: 'Product added succesfully'\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json * {\n      message: 'Error adding to cart'\n    };\n  }\n};\n\n//handle remove from cart route\nmodule.exports.removeFromCart = async (req, res, next) => {\n  if (req.userType !== 'User') {\n    return res.status(401).json({\n      message: 'Could not remove from cart as unauthorized'\n    });\n  }\n\n  //extract product id\n  const {\n    productId\n  } = req.params;\n  try {\n    const result = await req.user.removeFromCart(productId);\n    if (!result) {\n      //the product was not removed from cart\n      return res.status(401).json({\n        message: 'Could not remove from cart'\n      });\n    }\n\n    //product removed succesfully\n    return res.status(200).json({\n      message: 'Product removed succesfully'\n    });\n  } catch (err) {\n    //error handling\n    console.log(err);\n    return res.status(500).json({\n      message: 'Error removeing from cart'\n    });\n  }\n};\n\n//# sourceURL=webpack://bobproject/./Controllers/UserAdmin.js?");

/***/ }),

/***/ "./Middlewares/isAuth.js":
/*!*******************************!*\
  !*** ./Middlewares/isAuth.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("//import jwt\nconst JsonWebToken = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n\n//import helper functions\nconst SearchByUserType = __webpack_require__(/*! ../Utils/SearchByUserType */ \"./Utils/SearchByUserType.js\");\nmodule.exports = isAuth = async (req, res, next) => {\n  const jwt = req.headers.jwt || req.query.jwt;\n\n  //user is not authenticated\n  if (!jwt) {\n    console.log('User is not authorized');\n    return res.status(401).json({\n      message: 'User not authorized'\n    });\n  }\n  try {\n    //extract user from jwt\n    const userJWT = JsonWebToken.decode(jwt);\n\n    //pass the userType and userId to extract the user\n    const user = await SearchByUserType(userJWT.userType, userJWT.user._id);\n    if (user) {\n      req.user = user;\n      req.userType = userJWT.userType;\n      userJWT.tokenType ? req.tokenType = userJWT.tokenType : req.tokenType = 'authToken';\n      next();\n    }\n  } catch (err) {\n    console.log(err);\n    return res.status(401).json({\n      message: 'error authenticating user'\n    });\n  }\n};\n\n//# sourceURL=webpack://bobproject/./Middlewares/isAuth.js?");

/***/ }),

/***/ "./Models/Company.js":
/*!***************************!*\
  !*** ./Models/Company.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst CompanySchema = new mongoose.Schema({\n  name: {\n    type: String,\n    required: true\n  },\n  ownerId: {\n    type: mongoose.Schema.Types.ObjectId,\n    ref: 'User'\n    //required:true\n  },\n\n  userName: {\n    type: String,\n    required: true,\n    unique: true\n  },\n  password: {\n    type: String,\n    required: true\n  },\n  profileImage: {\n    type: String\n  },\n  verified: {\n    type: Boolean,\n    default: false\n  },\n  phoneNumber: {\n    type: Number\n  },\n  address: {\n    city: String,\n    state: String,\n    country: String\n  }\n});\n\n//exporting User Model\nconst Company = mongoose.model('Company', CompanySchema);\nmodule.exports = Company;\n\n//# sourceURL=webpack://bobproject/./Models/Company.js?");

/***/ }),

/***/ "./Models/DeliveryGuy.js":
/*!*******************************!*\
  !*** ./Models/DeliveryGuy.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst DeliveryGuySchema = new mongoose.Schema({\n  name: {\n    type: String,\n    required: true\n  },\n  userName: {\n    type: String,\n    required: true,\n    unique: true\n  },\n  password: {\n    type: String,\n    required: true\n  },\n  profileImage: {\n    type: String\n  },\n  verified: {\n    type: Boolean,\n    default: false\n  },\n  address: {\n    city: String,\n    state: String,\n    country: String\n  },\n  isAvailable: {\n    type: Boolean,\n    default: true\n  },\n  phoneNumber: String\n});\n\n//exporting Delivery Guy Model\nconst DeliveryGuy = mongoose.model('DeliveryGuy', DeliveryGuySchema);\nmodule.exports = DeliveryGuy;\n\n//# sourceURL=webpack://bobproject/./Models/DeliveryGuy.js?");

/***/ }),

/***/ "./Models/Order.js":
/*!*************************!*\
  !*** ./Models/Order.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst orderSchema = new mongoose.Schema({\n  userId: {\n    type: mongoose.Schema.Types.ObjectId,\n    ref: 'User',\n    required: true\n  },\n  items: [{\n    product: {\n      type: mongoose.Schema.Types.ObjectId,\n      ref: 'Product',\n      required: true\n    },\n    quantity: {\n      type: Number,\n      required: true\n    }\n  }],\n  total: {\n    type: Number,\n    required: true\n  },\n  orderDate: {\n    type: Date,\n    default: Date.now\n  },\n  deliveryGuyId: {\n    type: mongoose.Schema.Types.ObjectId,\n    ref: 'DeliveryGuy',\n    default: null\n  },\n  status: {\n    type: String,\n    default: 'pending'\n  }\n});\n\n// Define the models\nconst Order = mongoose.model('Order', orderSchema);\nmodule.exports = Order;\n\n//# sourceURL=webpack://bobproject/./Models/Order.js?");

/***/ }),

/***/ "./Models/Product.js":
/*!***************************!*\
  !*** ./Models/Product.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst ProductSchema = new mongoose.Schema({\n  name: {\n    type: String,\n    required: true,\n    unique: true\n  },\n  price: {\n    type: Number,\n    default: 0,\n    min: 0,\n    required: true\n  },\n  imagePath: {\n    type: String,\n    required: true\n  },\n  description: String,\n  tags: [{\n    type: String\n  }],\n  ownerId: {\n    type: mongoose.Types.ObjectId,\n    ref: \"Company\",\n    required: true\n  }\n});\n\n//exporting Product Model\nconst Product = mongoose.model('Product', ProductSchema);\nmodule.exports = Product;\n\n//# sourceURL=webpack://bobproject/./Models/Product.js?");

/***/ }),

/***/ "./Models/User.js":
/*!************************!*\
  !*** ./Models/User.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst UserSchema = new mongoose.Schema({\n  name: {\n    type: String,\n    required: true\n  },\n  userName: {\n    type: String,\n    required: true,\n    unique: true\n  },\n  phoneNumber: String,\n  password: {\n    type: String,\n    required: true\n  },\n  profileImage: {\n    type: String\n  },\n  address: {\n    city: String,\n    state: String,\n    country: String\n  },\n  verified: {\n    type: Boolean,\n    default: false\n  },\n  cart: {\n    items: [{\n      productId: {\n        type: mongoose.Schema.Types.ObjectId,\n        ref: 'Product'\n      },\n      quantity: Number\n    }]\n  }\n});\n\n//add to cart\nUserSchema.methods.addToCart = async function (productId) {\n  const productIndex = this.cart.items.findIndex(item => item.productId.equals(productId));\n  if (productIndex !== -1) {\n    this.cart.items[productIndex].quantity++;\n  } else {\n    this.cart.items.push({\n      productId: productId,\n      quantity: 1\n    });\n  }\n  return await this.save();\n};\n\n//remove from cart\nUserSchema.methods.removeFromCart = async function (productId) {\n  const productIndex = this.cart.items.findIndex(item => item.productId.equals(productId));\n  if (productIndex === -1) {\n    //product not found in cart\n    throw new Error('Product not found in cart');\n  } else {\n    //product found so we decrease quantity\n    const cartItem = this.cart.items[productIndex];\n    cartItem.quantity--;\n    if (cartItem.quantity <= 0) {\n      //the product should be removed\n      this.cart.items.splice(productIndex, 1); // Remove item from cart\n    }\n  }\n  //saving\n  return await this.save();\n};\n\n//exporting User Model\nconst User = mongoose.model('User', UserSchema);\nmodule.exports = User;\n\n//# sourceURL=webpack://bobproject/./Models/User.js?");

/***/ }),

/***/ "./Utils/Mailer.js":
/*!*************************!*\
  !*** ./Utils/Mailer.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const nodemailer = __webpack_require__(/*! nodemailer */ \"nodemailer\");\nconst sgMail = __webpack_require__(/*! @sendgrid/mail */ \"@sendgrid/mail\");\nsgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set your SendGrid API key\n\nconst transporter = nodemailer.createTransport({\n  service: 'gmail',\n  // You can use other services as well\n  auth: {\n    user: process.env.EMAIL_USERNAME,\n    // Your email username\n    pass: process.env.EMAIL_PASSWORD // Your email password\n  }\n});\n\nmodule.exports = {\n  sendMail: async (to, subject, text, html) => {\n    const mailOptions = {\n      from: process.env.EMAIL_USERNAME,\n      to,\n      subject,\n      text,\n      html\n    };\n    try {\n      console.log(JSON.stringify(mailOptions));\n      const mail = await transporter.sendMail(mailOptions);\n      console.log('Email sent successfully');\n      return mail ? true : false;\n    } catch (error) {\n      console.error('Error sending email:', error);\n      return false;\n    }\n  }\n};\n\n//# sourceURL=webpack://bobproject/./Utils/Mailer.js?");

/***/ }),

/***/ "./Utils/SearchByUserType.js":
/*!***********************************!*\
  !*** ./Utils/SearchByUserType.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("//import Models\nconst DeliveryGuy = __webpack_require__(/*! ../Models/DeliveryGuy */ \"./Models/DeliveryGuy.js\");\nconst User = __webpack_require__(/*! ../Models/User */ \"./Models/User.js\");\nconst Company = __webpack_require__(/*! ../Models/Company */ \"./Models/Company.js\");\nmodule.exports = SearchByUserType = async (userType, _id) => {\n  let user = null;\n  if (userType === 'Company') {\n    //try search Company\n    try {\n      user = await Company.findById(_id);\n      if (user) {\n        return user;\n      } else {\n        throw new Error('Could not find User');\n      }\n    } catch (err) {\n      throw new Error(err);\n    }\n  } else if (userType === 'User') {\n    //try search user\n    try {\n      user = await User.findById(_id);\n      if (user) {\n        return user;\n      } else {\n        throw new Error('Could not find Company');\n      }\n    } catch (err) {\n      throw new Error(err);\n    }\n  } else if (userType === 'DeliveryGuy') {\n    //try search delivery guy\n    try {\n      user = await DeliveryGuy.findById(_id);\n      if (user) {\n        return user;\n      } else {\n        throw new Error('Could not find Delivery Guy');\n      }\n    } catch (err) {\n      throw new Error(err);\n    }\n  }\n\n  //type is not valid\n  return new Error('User Type is invalid');\n};\n\n//# sourceURL=webpack://bobproject/./Utils/SearchByUserType.js?");

/***/ }),

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var createError = __webpack_require__(/*! http-errors */ \"http-errors\");\nvar express = __webpack_require__(/*! express */ \"express\");\nvar path = __webpack_require__(/*! path */ \"path\");\nvar cookieParser = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\nvar logger = __webpack_require__(/*! morgan */ \"morgan\");\n\n//define routers\nconst indexRouter = __webpack_require__(/*! ./routes/index */ \"./routes/index.js\");\nconst shopRouter = __webpack_require__(/*! ./routes/shop */ \"./routes/shop.js\");\nconst authRouter = __webpack_require__(/*! ./routes/auth */ \"./routes/auth.js\");\nconst companyAdmin = __webpack_require__(/*! ./routes/companyAdmin */ \"./routes/companyAdmin.js\");\nconst userAdmin = __webpack_require__(/*! ./routes/userAdmin */ \"./routes/userAdmin.js\");\nconst deliveryAdmin = __webpack_require__(/*! ./routes/deliveryGuyAdmin */ \"./routes/deliveryGuyAdmin.js\");\nconst admin = __webpack_require__(/*! ./routes/admin */ \"./routes/admin.js\");\n\n//import cors\nconst cors = __webpack_require__(/*! cors */ \"cors\");\nvar app = express();\n\n//set up cors\napp.use(cors());\n\n// view engine setup\napp.set('views', path.join(__dirname, 'views'));\napp.set('view engine', 'jade');\napp.use(logger('dev'));\napp.use(express.json());\napp.use(express.urlencoded({\n  extended: false\n}));\napp.use(cookieParser());\napp.use(express.static(path.join(__dirname, 'public')));\n\n//defining endpoints for routers\napp.use('/auth', authRouter);\napp.use('/shop', shopRouter);\napp.use('/company', companyAdmin);\napp.use('/user', userAdmin);\napp.use('/deliveryGuy', deliveryAdmin);\napp.use('/admin', admin);\napp.use('/', indexRouter);\n\n// catch 404 and forward to error handler\napp.use(function (req, res, next) {\n  next(createError(404));\n});\n\n// error handler\napp.use(function (err, req, res, next) {\n  // set locals, only providing error in development\n  res.locals.message = err.message;\n  res.locals.error = req.app.get('env') === 'development' ? err : {};\n\n  // render the error page\n  res.status(err.status || 500);\n  res.render('error');\n});\nmodule.exports = app;\n\n//# sourceURL=webpack://bobproject/./app.js?");

/***/ }),

/***/ "./routes/admin.js":
/*!*************************!*\
  !*** ./routes/admin.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\nconst AdminController = __webpack_require__(/*! ../Controllers/Admin */ \"./Controllers/Admin.js\");\n\n//import middlewares\nconst isAuth = __webpack_require__(/*! ../Middlewares/isAuth */ \"./Middlewares/isAuth.js\");\n\n//router.post('/addProduct',isAuth,CompanyAdminController.addProduct)\n\n//handle edit user route\nrouter.post('/editUser', isAuth, AdminController.editUserProfile);\n\n//handle delete user route\nrouter.delete('/deleteUser', isAuth, AdminController.deleteUser);\nmodule.exports = router;\n\n//# sourceURL=webpack://bobproject/./routes/admin.js?");

/***/ }),

/***/ "./routes/auth.js":
/*!************************!*\
  !*** ./routes/auth.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\n\n//importing express validator\nconst {\n  body\n} = __webpack_require__(/*! express-validator */ \"express-validator\");\n\n//import Controllers\nconst authController = __webpack_require__(/*! ../Controllers/Auth */ \"./Controllers/Auth.js\");\nconst isAuth = __webpack_require__(/*! ../Middlewares/isAuth */ \"./Middlewares/isAuth.js\");\n\n//login\nrouter.post(\"/login\", authController.Login);\n\n//signup\nrouter.post(\"/signup\", [\n//signup validation\nbody(\"userName\", \"Please enter a valid email\").isEmail(), body(\"password\", \"Please enter a valid password using at least 8 characters, 1 Capital letter, 1 small leter, 1 symbol\").trim().isLength({\n  min: 8\n}) //at least 8 characters\n.matches(/[A-Z]/) // At least 1 capital letter\n.matches(/[a-z]/) // At least 1 small letter\n.matches(/[!@#$%^&*(),.?\":{}|<>]/),\n// At least 1 symbol\nbody(\"name\", \"Please enter a valid name\").trim().not().isEmpty(), body(\"type\", \"You forgot to assign a type\").trim().not().isEmpty()], authController.Signup);\n\n//handle sending verification email\nrouter.get('/verifyEmail', isAuth, authController.sendUserVerification);\n\n//verify user\nrouter.get('/verifyUser', isAuth, authController.verifyUser);\n\n//verify user\nrouter.get('/passEmail', authController.sendUserPass);\n\n//forget password\nrouter.post('/forgetPass', isAuth, [body(\"password\", \"Please enter a valid password using at least 8 characters, 1 Capital letter, 1 small leter, 1 symbol\").trim().isLength({\n  min: 8\n}) //at least 8 characters\n.matches(/[A-Z]/) // At least 1 capital letter\n.matches(/[a-z]/) // At least 1 small letter\n.matches(/[!@#$%^&*(),.?\":{}|<>]/) // At least 1 symbol\n], authController.changePass);\n\n//place order\nrouter.get('/placeOrder', isAuth, authController.placeOrder);\nmodule.exports = router;\n\n//# sourceURL=webpack://bobproject/./routes/auth.js?");

/***/ }),

/***/ "./routes/companyAdmin.js":
/*!********************************!*\
  !*** ./routes/companyAdmin.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\n\n//importing express validator\nconst {\n  body\n} = __webpack_require__(/*! express-validator */ \"express-validator\");\nconst CompanyAdminController = __webpack_require__(/*! ../Controllers/CompanyAdmin */ \"./Controllers/CompanyAdmin.js\");\n\n//import middlewares\nconst isAuth = __webpack_require__(/*! ../Middlewares/isAuth */ \"./Middlewares/isAuth.js\");\n\n//add product\nrouter.post(\"/addProduct\", isAuth, [body(\"name\", \"You forgot to assign a name\").trim().not().isEmpty(), body(\"imagePath\", \"You forgot to add an image\").trim().not().isEmpty(), body(\"price\").isFloat({\n  gt: 0\n}).withMessage(\"The price must be greater than 0\")], CompanyAdminController.addNewProduct);\n\n//delete product\nrouter.delete('/deleteProduct/:productId', isAuth, CompanyAdminController.deleteProduct);\nmodule.exports = router;\n\n//# sourceURL=webpack://bobproject/./routes/companyAdmin.js?");

/***/ }),

/***/ "./routes/deliveryGuyAdmin.js":
/*!************************************!*\
  !*** ./routes/deliveryGuyAdmin.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\n\n//importing controllers\nconst DeliveryController = __webpack_require__(/*! ../Controllers/DeliveryGuyAdmin */ \"./Controllers/DeliveryGuyAdmin.js\");\n\n//importing middlewares\nconst isAuth = __webpack_require__(/*! ../Middlewares/isAuth */ \"./Middlewares/isAuth.js\");\n\n//get unassigned orders\nrouter.get('/AllOrders', isAuth, DeliveryController.getOrders);\n\n//get delivery guy orders\nrouter.get('/MyOrders', isAuth, DeliveryController.getOrdersByDeliveryGuy);\n\n//assign order\nrouter.post('/AssignOrders/:orderId', isAuth, DeliveryController.assignOrder);\n\n//change order status\nrouter.post('/ChangeOrderStatus', isAuth, DeliveryController.changeOrderStatus);\nmodule.exports = router;\n\n//# sourceURL=webpack://bobproject/./routes/deliveryGuyAdmin.js?");

/***/ }),

/***/ "./routes/index.js":
/*!*************************!*\
  !*** ./routes/index.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var express = __webpack_require__(/*! express */ \"express\");\nvar router = express.Router();\n\n/* GET home page. */\nrouter.get('/', function (req, res, next) {\n  res.render('index', {\n    title: 'Express'\n  });\n});\nmodule.exports = router;\n\n//# sourceURL=webpack://bobproject/./routes/index.js?");

/***/ }),

/***/ "./routes/shop.js":
/*!************************!*\
  !*** ./routes/shop.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\n\n//import auth middleware\nconst isAuth = __webpack_require__(/*! ../Middlewares/isAuth */ \"./Middlewares/isAuth.js\");\n\n//import shop controller\nconst shopController = __webpack_require__(/*! ../Controllers/Shop */ \"./Controllers/Shop.js\");\n\n//get all products\nrouter.get('/getProducts', shopController.getProducts);\n\n//get products by companyId for users\nrouter.get('/getProductsByCompany/:companyid', shopController.getProductsByCompanyId);\n\n//get products by companyId for companies (for edit later)\nrouter.get('/getProductsByCompany', isAuth, shopController.getProductsByCompanyId);\nmodule.exports = router;\n\n//# sourceURL=webpack://bobproject/./routes/shop.js?");

/***/ }),

/***/ "./routes/userAdmin.js":
/*!*****************************!*\
  !*** ./routes/userAdmin.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\nconst UserAdminController = __webpack_require__(/*! ../Controllers/UserAdmin */ \"./Controllers/UserAdmin.js\");\n\n//import middlewares\nconst isAuth = __webpack_require__(/*! ../Middlewares/isAuth */ \"./Middlewares/isAuth.js\");\n\n//add to cart route\nrouter.post('/addToCart/:productId', isAuth, UserAdminController.addToCart);\n\n//remove from cart route\nrouter.post('/removeFromCart/:productId', isAuth, UserAdminController.removeFromCart);\nmodule.exports = router;\n\n//# sourceURL=webpack://bobproject/./routes/userAdmin.js?");

/***/ }),

/***/ "@sendgrid/mail":
/*!*********************************!*\
  !*** external "@sendgrid/mail" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@sendgrid/mail");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("cookie-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("debug");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "express-validator":
/*!************************************!*\
  !*** external "express-validator" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("express-validator");

/***/ }),

/***/ "http-errors":
/*!******************************!*\
  !*** external "http-errors" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("http-errors");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("morgan");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("nodemailer");

/***/ }),

/***/ "stripe":
/*!*************************!*\
  !*** external "stripe" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stripe");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./bin/www");
/******/ 	
/******/ })()
;