const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
    },
    profileImage: {
        type:String,
    },
    address: {
        city: String,
        state: String,
        country: String
    },
    verified: {
        type:Boolean,
        default: false
    },
    cart:{
        items:[
            {
                productId :{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Product'
                },
                quantity:Number
            }
        ]
    },
})

//exporting User Model
const User = mongoose.model('User',UserSchema);
module.exports = User;