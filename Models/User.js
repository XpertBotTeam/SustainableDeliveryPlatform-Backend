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
    phoneNumber: String,
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

//add to cart
UserSchema.methods.addToCart = async function (productId) {
    console.log(productId)
    const productIndex = this.cart.items.findIndex(item => item.productId.equals(productId));
    if(productIndex !== -1){
        this.cart.items[productIndex].quantity++;
    }else{
        this.cart.items.push({productId: productId,quantity:1});
    }
    return await this.save()
}

//exporting User Model
const User = mongoose.model('User',UserSchema);



module.exports = User;