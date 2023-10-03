const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: String,
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  address: {
    longitude:String,
    latitude:String
 },
  verified: {
    type: Boolean,
    default: false,
  },
  cart: [
    {
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",

        required: true,
      },
      items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
});

UserSchema.methods.addToCart = async function(productId, companyId) {
    // Find company order index
    let companyOrderIndex = this.cart.findIndex(cartOrder => cartOrder.companyId.toString() === companyId.toString());

    // If company order doesn't exist, create it
    if (companyOrderIndex === -1) {
        this.cart.push({ companyId, items: [] });
        companyOrderIndex = this.cart.length - 1; // Update the index
    }

    const companyOrder = this.cart[companyOrderIndex];

    // Find product index in company order
    const productIndex = companyOrder.items.findIndex(item => item.product.toString() === productId.toString());

    if (productIndex !== -1) {
        // Product found, so increment the quantity
        companyOrder.items[productIndex].quantity++;
    } else {
        // Product not found, so add it to the items
        companyOrder.items.push({ product: { _id: productId }, quantity: 1 });
    }

    await this.save(); // Save the user

    return this; // Return the user object
};


UserSchema.methods.removeFromCart = async function(productId, companyId) {
    // Find company order index
    const companyOrderIndex = this.cart.findIndex(cartOrder => cartOrder.companyId.toString() === companyId.toString());

    // If company order doesn't exist, return
    if (companyOrderIndex === -1) {
        return null; // No need to make any changes
    }

    const companyOrder = this.cart[companyOrderIndex];

    // Find product index in company order
    const productIndex = companyOrder.items.findIndex(item => item.product.toString() === productId.toString());

    if (productIndex !== -1) {
        // If quantity is greater than 1, decrement it
        if (companyOrder.items[productIndex].quantity > 1) {
            companyOrder.items[productIndex].quantity--;
        } else {
            // If quantity is 1, remove the item from the items array
            companyOrder.items.splice(productIndex, 1);
        }
    } else {
        // Product not found, no action needed
        return null; // No need to make any changes
    }

    await this.save(); // Save the user

    return this; // Return the user object
};

//exporting User Model
const User = mongoose.model("User", UserSchema);

module.exports = User;
