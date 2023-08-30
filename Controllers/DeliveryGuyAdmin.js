//import models
const Order = require('../Models/Order');

//import mongoose
const mongoose = require('mongoose');

//get unassined products
module.exports.getOrders = async (req,res,next) =>{
    if(req.userType !== 'DeliveryGuy'){
        //not authorized
        return res.status(401).json({message:'Not an authorized delivery guy'})
    }

    try{
        //get products
        const orders = await Order.find({deliveryGuyId:null})
        if(!orders){
            return res.status(401).json({message:'No orders found for now'});
        }
        //returning orders
        return res.status(200).json({orders});
    }catch(err){
        //error handling
        console.log(err);
        return res.status(500).json({message:'error searching for orders'})
    }
}

//get orders by delivery guy
module.exports.getOrdersByDeliveryGuy = async (req,res,next) => {
    if(req.userType !== 'DeliveryGuy'){
        //not authorized
        return res.status(401).json({message:'Not an authorized delivery guy'})
    }

    try{
        //get status param
        const {status} = req.query;

        if(status && (status!=='Completed' && status!=='Current' && status!== 'Pending')){
            //status code is wrong
            return res.status(401).json({message:'status error'})
        }

        //get orders
        const id = req.user._id;
        const orders = status? await Order.find({deliveryGuyId: id,status}) :  await Order.find({deliveryGuyId: id}) 

        if(!orders){
            //no orders found
            return res.status(401).json({message:'No orders found for this deliveryGuy'});
        }
        //returning orders
        return res.status(200).json({orders});
    }catch(err){
        //error handling
        console.log(err);
        return res.status(500).json({message:'error searching for orders'})
    }
}

//assign order
module.exports.assignOrder = async (req,res,next) => {
    if(req.userType !== 'DeliveryGuy'){
        //not authorized
        return res.status(401).json({message:'Not an authorized delivery guy'})
    }

    //extract orderId
    const {orderId} = req.params;

    try{
        const order = await Order.findById(orderId);
    
        if(!order){
            //no order found
            return res.status(401).json({message:'order not found'})
        }
    
        if(order.deliveryGuyId !== null){
            //delivery guy already assigned
            return res.status(401).json({message:'order has already be assigned'})
        }
    
        //assigning delivery guy
        order.deliveryGuyId = req.user._id;
        const result = await order.save();
    
        if(!result){
            //error assigning deliveryGuy
            return res.status(401).json({message:'Could not assign deliveryGuy'});
        }
        
        //operation done succesfully
        return res.status(200).json({message:'deliveryGuy assigned succesfully'})
    }catch(err){
        //error handling
        console.log(err);
        return res.status(500).json({message:'error searching for orders'})
    }


}
