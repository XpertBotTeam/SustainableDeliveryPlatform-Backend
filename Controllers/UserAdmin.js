//import Models
const User = require("../Models/User");
const Product = require("../Models/Product")
const Order = require('../Models/Order');

//importing mongoose
const mongoose = require('mongoose');

//handle add to cart route
module.exports.addToCart = async (req, res, next) => {
    if (req.userType !== 'User') {
        return res.status(401).json({ message: 'Could not add to cart as unauthorized' });
    }

    //extract product id
    const {productId,companyId} = req.query;
    if(!productId || !companyId){
        return res.status(401).json({message:'companyId and productId are required'})
    }

    try {
        const productCheck = await  Product.findById(productId);
       
        if (!productCheck) {
            //no product found
            return res.status(401).json({ message: 'Product not found' });
        }

        if(productCheck.ownerId.toString() !== companyId.toString()){
            //wrong company id
            return res.status(401).json({message:'product is not related to this company'})
        }

        const result = await req.user.addToCart(productId,companyId);
        if (!result) {
            //the product was not added to cart
            return res.status(401).json({ message: 'Could not add to cart' })
        }

        //product added succesfully
        return res.status(200).json({ message: 'Product added succesfully' });

    } catch (err) {
        //error handling
        console.log(err);
        return res.status(500).json ({ message: 'Error adding to cart' })
    }
}


//handle remove from cart route
module.exports.removeFromCart = async (req, res, next) => {
    if (req.userType !== 'User') {
        return res.status(401).json({ message: 'Could not remove from cart as unauthorized' });
    }

    //extract product id
    const {productId,companyId} = req.query;

    try {
        const result = await req.user.removeFromCart(productId,companyId);
        if (!result) {
            //the product was not removed from cart
            return res.status(401).json({ message: 'Could not remove from cart' })
        }

        //product removed succesfully
        return res.status(200).json({ message: 'Product removed succesfully' });

    } catch (err) {
        //error handling
        console.log(err);
        return res.status(500).json ( { message: 'Error removeing from cart' } )
    }
}

//get user orders
module.exports.getOrders = async (req,res,next) => {
 if(req.userType !== 'User'){
    //not authorized
    return res.status(401).json({message:'unauthorized user'});
 }

 console.log(req.user._id)
 try{
    //getting orders
 const orders = await Order.find({userId: req.user._id});

 if(orders.length === 0 || orders === null){
        //no orders found
        return res.status(401).json({message:'no orders found'});
 }

 //return orders
 return res.status(200).json({orders});

}catch(err){
    //error handling
    console.log(err);
    return res.status(500).json({message:'error gettimg orders'})
}
}

//track order
module.exports.trackOrder = async (req,res,next) => {
    if(req.userType !== 'User'){
        //not authorized
        return res.status(401).json({message:'unauthorized user'});
     }

     //extract order details
     const {orderId} =req.params;

     //orderId not defined
     if(!orderId){
        return res.status(410).json({message:'orderId is not defined'})
     }

     try{

    
     const order = await Order.findById(orderId).populate('deliveryGuyId')

     if(!order || order.length === 0) {
        //no order found
        return res.status(401).json({message:'error'})
     }

     //succesful
     return res.status(200).json({address: order.deliveryGuyId.address})

    }catch(err){
        //error handling
        console.log(err);
        return res.status(500).json({message:'error tracking order'});
    }
    }