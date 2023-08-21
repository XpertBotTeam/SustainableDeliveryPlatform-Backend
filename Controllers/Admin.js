//import utils method
const  SearchByUserType = require('../Utils/SearchByUserType');

//update User Profile
module.exports.editUserProfile = async (req, res, next) => {
  const { name, profileImage, phoneNumber, city, state, country } = req.body;
  console.log(req.userType);

  try {
    //find user to update
    const user = await SearchByUserType(req.userType,req.user._id);

    if(!user){
        return res.status(401).json({error:'not authorized'})
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
      return res.status(401).json({ error: "Could not update user!" });
    }
    //updated succesfully
    return res.status(200).json({message:'user updated succesfully'});
  } catch (err) {
    //error handling
    console.log(err);
    return res.status(500).json({ error: "Error updating user" });
  }
};
