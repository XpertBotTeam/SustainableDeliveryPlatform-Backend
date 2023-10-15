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
    const { name, price, tags, description } = req.body;
    let newProduct = await new Product({
      name,
      price,
      imagePath:`${(req.file && req.file.filename)? `http://localhost:3000/${req.file.filename}` : null}`,
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
module.exports.deleteProduct = async (req, res, next) => {
  const company = req.user;
  if (req.userType !== "Company") {
      return res.status(401).json({ message: "Unauthorized could not delete product" });
  }

  try {
      const { productId } = req.params;
      const product = await Product.findOne({ ownerId: company._id, _id: new mongoose.Types.ObjectId(productId) });

      const result = await Product.deleteOne(product);
      company.products = company.products.filter(product => product.productId.toString() !== productId);

      await company.save()

      if (!result) {
          return res.status(401).json({ message: "Could not delete product" });
      }
      return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
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
    const {orderId} = req.query;
    // Getting orders that contain company Id
    const query = {'companyOrders.companyId': req.user._id }
    
    if(orderId){
      query._id = orderId
    }

    let orders = await Order.find(query).populate({path:'userId' , select:'name address _id'}).populate({path:'deliveryGuyId' , select:'name _id userName'}).populate('companyOrders.items.product').populate('orderDate');

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
      order.orderDate = companyOrder.orderDate
      order.orderId  = companyOrder._id;
      order.companyOrders = []
      companyOrder.companyOrders.forEach(orderExtracted=>{
        //map through company orders and return the company order in each order that has the companyId as user
        if(orderExtracted.companyId.toString() === req.user._id.toString()){
          order.user = companyOrder.userId
          order.deliveryGuy = companyOrder.deliveryGuyId;
          order.total = companyOrder.total
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


//edit product
module.exports.editProduct = async (req, res, next) => {
  //validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log(result.array());
    return res.status(500).json({ message: result.array() });
  }

  const { productId } = req.query;
  const company = req.user;

  if (req.userType != "Company") {
    return res
      .status(401)
      .json({ message: "Unauthorized could not edit product" });
  }

  try {
    //finding product
    let foundProduct = await Product.findOne({ ownerId: company._id, _id: productId });

    if (!foundProduct) {
      //editing product failed
      return res.status(401).json({ message: "Product not found" });
    }

    //editing product
    for (const key in req.body) {
      if(req.body[key] !== null){
        foundProduct[key] = req.body[key];
      }
    }

    foundProduct['imagePath'] = `${ (req.file &&req.file.filename)? `http://localhost:3000/${req.file.filename}` : foundProduct['imagePath']}`

    const result = await foundProduct.save(); // Use a different variable name

    if (!result) {
      //editing product failed
      return res.status(401).json({ message: "Could not edit product" });
    }

    //succesful
    return res.status(200).json({ message: "Product edited successfully" });
  } catch (err) {
    //handling errors
    console.log(err);
    return res.status(500).json({ message: "Error editing product" });
  }
};

//edit banner image
module.exports.editBannerImage = async (req,res,next) => {
  if(req.userType !== 'Company'){
    //must be a company
    return res.status(401).json({message:'unauthorized acces'})
  }

  if(!req.file || !req.file.filename){
    //no file uploaded
    return res.status(401).json({message:'please upload an image first'})
  }

  try{
    req.user.bannerImage = `http://localhost:3000/${req.file.filename}`
    const result = await req.user.save();

    if(!result){
      return res.status(401).json({message:'could not update bannerImage'})
    }
    //succesful
    return res.status(200).json({message:'bannerimage updated succesfully'})

  }catch(err){
    //error handling
    console.log(err);
    return res.status(500).json({message:'error updating bannerImage'})
  }
}

module.exports.changeOrderStatus = async (req, res, next) => {
  if (req.userType !== 'Company') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(401).json({ message: 'Order not found' });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(401).json({ message: 'Order not found' });
    }

    for (const orderComp of order.companyOrders) {
      if (orderComp.companyId.equals(req.user._id)) {
        switch (orderComp.status) {
          case 'Pending':
            orderComp.status = 'Preparing';
            break;
          case 'Preparing':
            orderComp.status = 'Prepared';
            break;
          default:
            break;
        }
      }
    }

    await order.save();

    return res.status(200).json({ message: 'Updated successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error updating order status' });
  }
};

