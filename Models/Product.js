const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        default: 0,
        min: 0, 
        required: true
    },
    imagePath: {
        type: String,
        required: true,
    },
    description:String,
    tags: [{ type: String }],
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: "Company",
        required: true,
    },
})

//exporting Product Model
const Product = mongoose.model('Product',ProductSchema);
module.exports = Product;