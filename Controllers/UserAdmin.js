//import Models
const User = require("../Models/User");
const Product = require("../Models/Product");
const Order = require("../Models/Order");

//importing mongoose
const mongoose = require("mongoose");

//handle add to cart route
module.exports.addToCart = async (req, res, next) => {
  if (req.userType !== "User") {
    return res
      .status(401)
      .json({ message: "Could not add to cart as unauthorized" });
  }

  //extract product id
  const { productId, companyId } = req.query;
  if (!productId || !companyId) {
    return res
      .status(401)
      .json({ message: "companyId and productId are required" });
  }

  try {
    const productCheck = await Product.findById(productId);

    if (!productCheck) {
      //no product found
      return res.status(401).json({ message: "Product not found" });
    }

    if (productCheck.ownerId.toString() !== companyId.toString()) {
      //wrong company id
      return res
        .status(401)
        .json({ message: "product is not related to this company" });
    }

    const result = await req.user.addToCart(productId, companyId);
    if (!result) {
      //the product was not added to cart
      return res.status(401).json({ message: "Could not add to cart" });
    }

    //product added succesfully
    return res.status(200).json({ message: "Product added succesfully" });
  } catch (err) {
    //error handling
    console.log(err);
    return res.status(500).json({ message: "Error adding to cart" });
  }
};

module.exports.placeOrder = async (req, res, next) => {
  if (req.userType !== "User") {
    return res
      .status(401)
      .json({ message: "Could not place order as unauthorized" });
  }

  try {
    let user = await req.user.populate('cart.items.product')
    // Extract cart details to create an order
    const companyOrders = user.cart.map((order) => {
      return {
        companyId: order.companyId._id,
        items: order.items,
      };
    });

   let total = 0;

for (const order of user.cart) {
  for (const item of order.items) {
    total += item.product.price * item.quantity;
  }
}

    const order = new Order({
      userId: user._id,
      companyOrders,
      total,
    });

    await order.save();

    // Clear the user's cart
    user.cart = [];
    await user.save();

    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    //error handling
    console.log(err);
    return res.status(500).json({ message: "error placing order" });
  }
};

//handle remove from cart route
module.exports.removeFromCart = async (req, res, next) => {
  if (req.userType !== "User") {
    return res
      .status(401)
      .json({ message: "Could not remove from cart as unauthorized" });
  }

  //extract product id
  const { productId, companyId } = req.query;

  try {
    const result = await req.user.removeFromCart(productId, companyId);
    if (!result) {
      //the product was not removed from cart
      return res.status(401).json({ message: "Could not remove from cart" });
    }

    //product removed succesfully
    return res.status(200).json({ message: "Product removed succesfully" });
  } catch (err) {
    //error handling
    console.log(err);
    return res.status(500).json({ message: "Error removeing from cart" });
  }
};

//get user orders
module.exports.getOrders = async (req, res, next) => {
  if (req.userType !== "User") {
    //not authorized
    return res.status(401).json({ message: "unauthorized user" });
  }

  console.log(req.user._id);
  try {
    //getting orders
    const orders = await Order.find({ userId: req.user._id }).populate({path:'deliveryGuyId',select:'_id name userName'}).populate('companyOrders.items.product').populate({path:'userId',select:'name address userName'});

    if (orders.length === 0 || orders === null) {
      //no orders found
      return res.status(401).json({ message: "no orders found" });
    }

    //return orders
    return res.status(200).json({ orders });
  } catch (err) {
    //error handling
    console.log(err);
    return res.status(500).json({ message: "error gettimg orders" });
  }
};

//track order
module.exports.trackOrder = async (req, res, next) => {
  if (req.userType !== "User") {
    //not authorized
    return res.status(401).json({ message: "unauthorized user" });
  }

  //extract order details
  const { orderId } = req.params;

  //orderId not defined
  if (!orderId) {
    return res.status(410).json({ message: "orderId is not defined" });
  }

  try {
    const order = await Order.findById(orderId).populate("deliveryGuyId");

    if (!order || order.length === 0) {
      //no order found
      return res.status(401).json({ message: "error" });
    }

    //succesful
    return res.status(200).json({ address: order.deliveryGuyId.address });
  } catch (err) {
    //error handling
    console.log(err);
    return res.status(500).json({ message: "error tracking order" });
  }
};

//get cart
module.exports.getCart = async (req, res, next) => {
  if (req.userType !== "User") {
    //not authorized
    return res.status(401).json({ message: "unauthorized user" });
  }

  try {
    //getting cart

    //populate company details

    let user = await req.user.populate({
      path: "cart.companyId",
      select: "profileImage name",
    });

    user = await user.populate("cart.items.product");

    const cart = await user.cart;

    if (cart.length === 0 || cart === null) {
      //no cart items found
      return res.status(401).json({ message: "cart is empty" });
    }

    //return cart
    return res.status(200).json({ cart });
  } catch (err) {
    //error handling
    console.log(err);
    return res.status(500).json({ message: "error getting cart" });
  }
};
