const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
      companyOrders: [
        {
        status: { type: String, default: "Pending" },
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
  total: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryGuyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryGuy",
    default: null,
  },
  status: {
    type: String,
    default: "Pending",
  },
});

// Define the models
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
