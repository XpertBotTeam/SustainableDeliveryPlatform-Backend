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
        const orders = await Order.find({deliveryGuyId:null}).populate({path:'userId',select:'_id name userName address'})
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

//get delivery routes for delivery guy
module.exports.getRoutes = async (req,res,next) => {
  if(req.userType !=='DeliveryGuy'){
    //unauthorized access not a delivery guy 
    return res.status(401).json({message:'unauthorized access'})
  }

  //extaract orderId
  const {orderId} = req.params;

  if(!orderId){
    //no orderId passed
    return res.status(401).json({message:'orderId is required'});
  }

  try{
    //extract the order
    const order = await Order.findOne({_id:orderId,deliveryGuyId:req.user._id}).populate({path:'userId',select: 'address _id'}).populate({path:'companyOrders.companyId',select:'address _id'});

    
    //extract destination address
    const destination = order.userId.address;
  
    let otherAddresses = [];
  
    for(let orderCompany of order.companyOrders){
        // extract related addresses
        otherAddresses.push(orderCompany.companyId.address);
    }
    

     return res.status(200).json({destination,otherAddresses})
  }
  catch(err){
    //error handling
    console.log(err);
    return res.status(500).json({message:'error getting routes'})
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
        const {status,orderId} = req.query;


        if(status && (status!=='Delivered' && status!=='Delivering' && status!== 'Prepared' && status!== 'Preparing')){
            //status code is wrong
            return res.status(401).json({message:'status error'})
        }

        //get orders
        const id = req.user._id;
        const query = {
          deliveryGuyId: req.user._id,
        };
        
        if (orderId) {
          console.log(orderId)
          //add orderId if any
          query._id = orderId;
        }

        if(status){
          //add status if any
          console.log(status)
          query.status=status;
        }
        console.log(JSON.stringify(query))
        //find order/orders
        const orders = await Order.find(query).populate({ path: 'userId',
        select: 'address name _id'}) .populate({
          path: 'companyOrders.companyId',
          select: 'address'
        });

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

 
  //must be a delivery guy to change the status
  if(req.user._id.toString() !== order.deliveryGuyId.toString()){
    return res.status(401).json({message:'not authorized'})
  }

  if(order.status === 'Prepared'){
    order.status = 'Delivering';
  }else if(order.status === 'Delivering'){
    order.status = 'Delivered';
  }else{
    return res.status(400).json({message:'error updating status (not authorized)'})
  }
  
    const result = await order.save();

    if(!result){
      //status was not updated succesfully
      return res.status(401).json({message:'order status was not updated'})
    }

    return res.status(200).json({message:'order status updated succesfully'})
} catch(err){
  //error handling
  console.log(err);
  return res.status(500).json({message:'error updating order status'})
}
}
