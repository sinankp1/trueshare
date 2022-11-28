const jwt = require('jsonwebtoken');

exports.generateToken = (payload,expires)=>{
    return jwt.sign(payload,process.env.TOKEN_SECRET,{
        expiresIn: expires,
    })
}
exports.generateTokenAdmin = (payload,expires)=>{
    return jwt.sign(payload,process.env.ADMIN_TOKEN_SECRET,{
        expiresIn: expires,
    })
}