//import Product Model
const Products = require('../Models/Product');

//get all products
module.exports.getProducts = async (req,res,next) => {
    //find all products
    const products = await Products.find();
    if(!products){
        //no products found
        return res.status(401).json({error:'Could not find products'});
    }
    //products found
    return res.status(200).json({products});
}

//get products through company id
module.exports.getProductsByCompanyId = async (req,res,next) =>{
    const id = req.params.id;
    //find products by company id
    const products = await Products.find({ownerId:id});
    if(!products){
        //no products found
        return res.status(401).json({error:'Could not find products'});
    }
    //products found
    return res.status(200).json({products});
}