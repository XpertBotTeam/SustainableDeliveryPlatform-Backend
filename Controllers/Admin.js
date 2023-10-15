//import utils method
const Company = require('../Models/Company');
const DeliveryGuy = require('../Models/DeliveryGuy');
const Order = require('../Models/Order');
const User = require('../Models/User');
const  SearchByUserType = require('../Utils/SearchByUserType');

//update User Profile
module.exports.editUserProfile = async (req, res, next) => {
  const { name, profileImage, phoneNumber, longitude, latitude } = req.body;
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
    longitude ? (user.address.longitude = longitude) : "";
    latitude ? (user.address.latitude = latitude) : "";
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

module.exports.handleLocationChnage = async (req,res,next) => {
  if(!req.userType || req.userType === 'deliveryGuy'){
      //unauthorized 
      return res.status(401).json({message:'unauthorized'})
  }

  try{
    console.log(req.userType)
    console.log({'longitude': parseFloat(req.body.location.lng),'latitude':parseFloat(req.body.location.lat)})
  //req.user.address = {'longitude':req.body.location.lng ,'latitude':req.body.location.lat}
  console.log(JSON.stringify(req.user))
  req.user.address.longitude = await req.body.location.lng;

  req.user.address.latitude = await req.body.location.lat;


  await req.user.save();
  return res.status(200).json({message:'location updated succesfully'})
}
catch(err){
  //error handling
  console.log(err);
  return res.status(500).json({message:'error updating location'})
}
}

//upload profile picture
module.exports.UpdateProfilePicture = async (req,res,next) => {
  //extracting uploaded image path
  const imagePath = req.file.path;

  try{
    //changing profile pic
    user.profileImage = imagePath;
    const result = await user.save();

    if(!result){
      //image not saved
      return res.status(401).json({message:'image was not saved'})
    }

    //image uploaded succesfully
    return res.status(200).json({message:'Succesfully uploaded image'});
     
  }catch(err){
    //error handling
    console.log(err);
    return res.status(500).json({message:'Could not upload image'})
  }
}
