const mongoose = require('mongoose');

const DeliveryGuySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    address: {
        city: String,
        state: String,
        country: String,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    phoneNumber: String,
})

//exporting Delivery Guy Model
const DeliveryGuy = mongoose.model('DeliveryGuy',DeliveryGuySchema);
module.exports = DeliveryGuy;