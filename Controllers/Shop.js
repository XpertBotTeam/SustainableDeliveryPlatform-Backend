//import Models
const Products = require('../Models/Product');
const Companies = require('../Models/Company');
//midleware
const mailer = require('../Utils/Mailer');

const to = 'itanim555@gmail.com';
const subject = 'Test Email';
const text = 'This is a test email.';
const html = '<p>This is a <b>test</b> email.</p>';
//import mon

//get products grouped by companies
module.exports.getCompaniesProducts = async (req,res,next) => {
    try{
        //get companyId
        const companyId = req.params.companyId || ( req.user && req.user._id ?req.user._id :null);

        //getting companies and their products
        const CompaniesProducts = companyId? await Companies.find({_id:companyId}).select('id name bannerImage products').populate('products.productId') : await Companies.find({ products: { $exists: true, $ne: [] } }).select('id name bannerImage products').populate('products.productId')

        if(!CompaniesProducts){
            //could not get companies associated with products
            return res.status(401).json({message:'no companies extracted'})
        }
    
        //return companies associated with products
        return res.status(200).send({companies:CompaniesProducts})
    }catch(err){
        //error handling
        console.log(err);
        res.status(500).json({message:'error getting products'})
    }
}

//get all products
module.exports.getProducts = async (req,res,next) => {
    
    //find all products
    const products = await Products.find();
    if(!products){
        //no products found
        return res.status(401).json({message:'Could not find products'});
    }
    //products found
    return res.status(200).json({products});
}

//get products through company id
module.exports.getProductsByCompanyId = async (req,res,next) =>{
    let id;

    //checks if user is company then it grabs the id from the jwt (private) else it grabs the id from the url params (public)
    if(req.userType && req.userType === 'Company'){
        id = req.user._id;
    }else{
        id = req.params.companyId;
    }

    if(!id){
        //authentication error couldnt get the id
        return res.status(401).json({message:'could not get products'})
    }
    try{
    //find products by company id
    const {productId} = req.query;

    //bbuild the query
    const params = {};
    params.ownerId = id;
    {productId ? params._id = productId : null}

    const products = await Products.find(params);
    if(!products){
        //no products found
        return res.status(401).json({message:'Could not find products'});
    }
    //products found
    return res.status(200).json({products});
}
catch(err){
    //error handling
    console.log(err);
    return res.status(500).json({message:'error finding products'});
}
}