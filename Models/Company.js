const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
	    //required:true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    products:[{productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product'}}],
    profileImage: {
        type: String,
    },
    bannerImage:{
        type:String
    },
    verified: {
        type: Boolean,
        default: false,
    },
    phoneNumber:{
        type: Number,
    },
    address: {
        longitude:String,
        latitude:String
     },
})

//exporting User Model
const Company = mongoose.model('Company',CompanySchema);
module.exports = Company;