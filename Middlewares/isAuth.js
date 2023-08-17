//import jwt
const JsonWebToken = require('jsonwebtoken');

//import helper functions
const SearchByUserType = require('../Utils/SearchByUserType');

module.exports = isAuth = async (req, res, next) => {
    const { jwt } = req.headers

    //user is not authenticated
    if (!jwt) {
        console.log('User is not authorized')
        return res.status(401).json({ error: 'User not authorized' })
    }

    try {
        //extract user from jwt
        const userJWT = JsonWebToken.decode(jwt);

        //pass the userType and userId to extract the user
        const user = await SearchByUserType(userJWT.userType, userJWT.user._id);
        if (user) {
            req.user = user;
            req.userType = userJWT.userType
            next();
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: err });
    }

}