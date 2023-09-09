//importing mongoose
const mongoose = require('mongoose');

//import Models
const Company = require("../Models/Company");
const Product = require("../Models/Product");
const Order = require('../Models/Order');

//validation results from validator
const { validationResult } = require("express-validator");

//add new product
module.exports.addNewProduct = async (req, res, next) => {
  //validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log(result.array());
    return res.status(500).json({ message: result.array() });
  }

  const company = req.user;
  if (req.userType != "Company") {
    return res
      .status(401)
      .json({ message: "Unauthorized could not add product" });
  }
  try {
    const { name, price, imagePath, tags, description } = req.body;
    let newProduct = await new Product({
      name,
      price,
      imagePath,
      description: description ? description:null,
      tags: tags ? tags : null,
      ownerId: company._id,
    });
    if (!newProduct) {
      //adding product failed
      return res.status(401).json({ message: "Could not add product" });
    }
    const result = await newProduct.save();

    if (!result) {
      //adding product failed
      return res.status(401).json({ message: "Could not add product" });
    }


    //saving product id to company
    const results_ = req.user.products.push({productId:newProduct._id});
    req.user.save();

    
    //succesful
    return res.status(200).json({ message: "Product added succesfully" });
  } catch (err) {
    //handling errors
    console.log(err);
    return res.status(500).json({ message: "Error adding product" });
  }
};

//delete product
module.exports.deleteProduct = async (req,res,next) => {
    const company = req.user;
    if (req.userType != "Company") {
      return res
        .status(401)
        .json({ message: "Unauthorized could not delete product" });
    }

    //try finding and deleting
    try{
        const {productId} = req.params;
        const result = await Product.findOneAndDelete({ownerId:company._id,_id:new mongoose.Types.ObjectId(productId)});

        if (!result) {
            //deleting failed
            return res.status(401).json({ message: "Could not delete product" });
        }
        return res.status(200).json({ message: "Deleted succesfully" });
    } catch (err) {
        //handling errors
        console.log(err);
        return res.status(500).json({ message: "Error deleting product" });
      }
}

//get orders
module.exports.getOrders = async (req,res,next) => {
  if(req.userType !== 'Company'){
    //not authorized
    return res.status(400).json({message:'not an authorized company'})
  }

  try {
    // Getting orders that contain company Id
    const orders = await Order.find({ 'companyOrders.companyId': req.user._id });

    if (!orders || !orders.length) {
      // No orders found
      return res.status(400).json({ message: 'No orders found' });
    }

    // Extracting the orders related to this company
    const companyOrders = []
    orders.forEach(companyOrder => {
      //define empty order
      const order = {}

      //extract order id 
      order.orderId  = companyOrder._id;
      order.companyOrders = []
      companyOrder.companyOrders.forEach(orderExtracted=>{
        //map through company orders and return the company order in each order that has the companyId as user
        if(orderExtracted.companyId.toString() === req.user._id.toString()){
          order.companyOrders.push(orderExtracted)
        }
      })
      companyOrders.push(order)
    } )

    // Successful
    return res.status(200).json({ orders:companyOrders });
  }
catch(err) {
  //error handling
  console.log(err);
  return res.status(500).json({message:'error extracting orders'})
}
}
