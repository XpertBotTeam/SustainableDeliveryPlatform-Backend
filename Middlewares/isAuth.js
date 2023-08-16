//import jwt
const JsonWebToken = require ('jsonwebtoken');

module.exports = isAuth = (req,res,next) => {
    const {jwt} = req.headers

    //user is not authenticated
    if(!jwt){
        console.log('User is not authoprized')
        return res.status(401).json({error:'User not authorized'})
    }

    //extract user from jwt
    const user = JsonWebToken.decode(jwt);
    res.status(201).json(user);

}