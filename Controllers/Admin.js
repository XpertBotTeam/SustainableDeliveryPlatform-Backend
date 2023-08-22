//import utils method
const Company = require('../Models/Company');
const DeliveryGuy = require('../Models/DeliveryGuy');
const User = require('../Models/User');
const  SearchByUserType = require('../Utils/SearchByUserType');

//update User Profile
module.exports.editUserProfile = async (req, res, next) => {
  const { name, profileImage, phoneNumber, city, state, country } = req.body;
  console.log(req.userType);

  try {
    //find user to update
    const user = await SearchByUserType(req.userType,req.user._id);

    if(!user){
        return res.status(401).json({message:'not authorized'})
    }

    //replace the data
    name ? (user.name = name) : "";
    profileImage ? (user.profileImage = profileImage) : "";
    phoneNumber ? (user.phoneNumber = phoneNumber) : "";
    city ? (user.address.city = city) : "";
    state ? (user.address.state = state) : "";
    country ? (user.address.country = country) : "";

    //save data
    const result = await user.save();
    if (!result) {
      return res.status(401).json({ message: "Could not update user!" });
    }
    //updated succesfully
    return res.status(200).json({message:'user updated succesfully'});
  } catch (err) {
    //error handling
    console.log(err);
    return res.status(500).json({ message: "Error updating user" });
  }
};

//delete User
module.exports.deleteUser = async (req,res,next) => {
  //extract userType and userId from the request
  const userType = req.userType;
  const userId = req.user._id
  try{
  //initialize the result
  let result;

  //delete by id
  if(userType === 'Company'){
      result = await Company.findByIdAndDelete(userId);
  }else if(userType === 'DeliveryGuy'){
      result = await DeliveryGuy.findByIdAndDelete(userId);
  }else if(userType === 'User'){
      result = await User.findByIdAndDelete(userId);
  }
  console.log(result)
  //results confirmatoin and send response
  if(!result){
    return res.status(401).json({message:"Could not delete user"});
  }
    return res.status(200).json({message: 'user Deleted Succesfully'});

  }
  catch(err){
    //error handling
    console.log(err);
    return res.status(500).json({message:"Sorry could not delete user"});
  }
  
  
}
