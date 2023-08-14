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
    profileImage: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    phoneNumber:{
        type: Number,
    },
    address: {
        city: String,
        state: String,
        country: String,
    }
})

//exporting User Model
const Company = mongoose.model('Company',CompanySchema);
module.exports = Company;