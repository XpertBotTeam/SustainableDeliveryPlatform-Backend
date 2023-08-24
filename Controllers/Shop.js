//import Product Model
const Products = require('../Models/Product');
const mailer = require('../Utils/Mailer');

const to = 'itanim555@gmail.com';
const subject = 'Test Email';
const text = 'This is a test email.';
const html = '<p>This is a <b>test</b> email.</p>';
//import mon

//get all products
module.exports.getProducts = async (req,res,next) => {
// Using nodemailer
mailer.sendMail(to, subject, text, html);

// Using SendGrid
mailer.sendGridMail(to, subject, text, html);
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
    if(req.userType === 'Company'){
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
    const products = await Products.find({ownerId:id});
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