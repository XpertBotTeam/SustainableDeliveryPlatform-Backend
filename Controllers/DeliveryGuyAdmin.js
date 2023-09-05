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

//change order status
module.exports.changeOrderStatus = async (req,res,next) => {

  if(req.userType !== 'DeliveryGuy'){
    //not a dellivery guy 
    return res.status(401).json({message:'unauthorized'})
  }

  //extract orderId
  const {orderId} = req.body;

  if(!orderId){
    //no order id 
    return res.status(401).json({message:'order not found'});
  }

    try{
  //search for the order
  const order = await Order.findById(orderId);
  if(!order){
    //no order found
    return res.status(401).json({message:'order not found'});
  }

  //extract order status to be updated
  const {status} = req.query;
  if(!status){
    //no order status
    return res.status(401).json({message:'please set the order status'});
  }
  
  //must be a delivery guy to change the status
  if(req.user._id.toString() !== order.deliveryGuyId.toString()){
    return res.status(401).json({message:'not authorized'})
  }

  if((order.status === 'Prepared' && status === 'Delivering') || (order.status === 'Delivering' && status === 'Delivered')){
    order.status = status;
    const result = await order.save();

    if(!result){
      //status was not updated succesfully
      return res.status(401).json({message:'order status was not updated'})
    }

    return res.status(200).json({message:'order status updated succesfully'})
  }else{
     //status was not updated succesfully
     return res.status(401).json({message:'order status was not updated'})
  }
} catch(err){
  //error handling
  console.log(err);
  return res.status(500).json({message:'error updating order status'})
}
}

