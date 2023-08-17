const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
        min: 0, 
    },
    description: String,
    imagePath: {
        type: String,
        required: true,
    },
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