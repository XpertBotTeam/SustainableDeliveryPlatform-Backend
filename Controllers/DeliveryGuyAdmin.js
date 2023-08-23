module.exports.getProducts = (req,res,next) =>{
    if(req.userType !== 'DeliveryGuy'){
        return res.status(401).json({message:'Not an authorized delivery guy'})
    }
}