//import Models
const User = require("../Models/User");
const Product = require("../Models/Product")

//importing mongoose
const mongoose = require('mongoose');

//handle add to cart route
module.exports.addToCart = async (req, res, next) => {
    if (req.userType !== 'User') {
        return res.status(401).json({ message: 'Could not add to cart as unauthorized' });
    }

    //extract product id
    const {productId} = req.params;

    try {
        const productCheck = await  Product.findById(productId);
        if (!productCheck) {
            //no product found
            return res.status(401).json({ message: 'Product not found' });
        }
        const result = await req.user.addToCart(productId);
        if (!result) {
            //the product was not added to cart
            return res.status(401).json({ message: 'Could not add to cart' })
        }

        //product added succesfully
        return res.status(200).json({ message: 'Product added succesfully' });

    } catch (err) {
        //error handling
        console.log(err);
        return res.status(500).json * { message: 'Error adding to cart' }
    }
}


//handle remove from cart route
module.exports.removeFromCart = async (req, res, next) => {
    if (req.userType !== 'User') {
        return res.status(401).json({ message: 'Could not remove from cart as unauthorized' });
    }

    //extract product id
    const {productId} = req.params;

    try {
        const result = await req.user.removeFromCart(productId);
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