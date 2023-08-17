//import Models
const DeliveryGuy = require('../Models/DeliveryGuy');
const User = require('../Models/User');
const Company = require('../Models/Company');

module.exports = SearchByUserType = async (userType, _id) => {
    let user = null;
    if (userType === 'Company') {
        //try search Company
        try {
            user = await Company.findById(_id);
            if (user) {
                return user;
            }else{
                throw new Error('Could not find User')
            }
        }
        catch (err) {
            throw new Error(err);
        }
    }else if(userType === 'User'){
        //try search user
        try {
            user = await User.findById(_id);
            if (user) {
                return user;
            }else{
                throw new Error('Could not find Company')
            }
        }
        catch (err) {
            throw new Error(err);
        }
    }else if(userType === 'DeliveryGuy'){
        //try search delivery guy
        try {
            user = await DeliveryGuy.findById(_id);
            if (user) {
                return user;
            }else{
                throw new Error('Could not find Delivery Guy')
            }
        }
        catch (err) {
            throw new Error(err);
        }
    }

    //type is not valid
    return new Error('User Type is invalid')
}