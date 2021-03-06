const Joi = require('joi');
const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const RegisterSchema = Joi.object({
    username: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).trim().min(3).max(32).required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).max(32).required(),


    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
})

const LoginSchema = Joi.object({
    username: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).trim().required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

})
exports.GenerateToken = async (id) => {
    try {
        return await jwt.sign({
            id: id
        }, process.env.JWT_SECRET, {expiresIn: 60 * 60})
    }catch (e) {
        console.log(e)
        return false
    }
}
exports.ValidateToken = async (req,res,next) => {
    try {
        const token = req.headers["x-access-token"]
        if (!token) return res.json({status: 401,error:"You're not logged in"})
        const pattern = /(^[\w-]*\.[\w-]*\.[\w-]*$)/g;
        if (!pattern.test(token))  return res.json({status: 401,error:"Invalid or Expired Token"})

        const is_valid = await jwt.verify(token, process.env.JWT_SECRET)
        if (is_valid){
            const getUser = await User.findOne({_id:is_valid.id})
            if (!getUser) return res.json({status: 404,error:"Invalid user id"})
            if (!getUser.isActive) return res.json({status: 403,error:"Account Banned. Contact support for more info"})
            req.id = is_valid.id
            req.role = getUser.role

            next()
        }else{
            return res.json({status: 403,error:"Invalid or Expired Token"})
        }

    }catch (e) {
        return res.json({status: 403,error:"Invalid or Expired Token"})
    }
}
exports.MakeAvatarForUser = (username) => {
    return `https://ui-avatars.com/api/?size=512&background=random&font-size=0.4&name=${username}`
}
exports.CheckRegister = async (req, res, next) => {
    const {username, email, password} = req.body

    const {value,error} = RegisterSchema.validate({username, email, password});
    if (error) {
        return res.json({status: 422, error: "Some inputs isn't valid"})
    } else {
req.username = value.username
        const is_existed = await User.findOne({username:value.username,email})
        if (!is_existed) return next()


        return res.json({status: 422, error: "Username or email is already existed"})

    }

}

exports.CheckLogin = async (req, res, next) => {
    const {username, password} = req.body

    const {value, error} = LoginSchema.validate({username, password});
    if (error) {
        return res.json({status: 422, error: "Some inputs isn't valid"})
    } else {
        console.log(value)
        req.username = value.username
       next()

    }

}


exports.isAdmin = async (req, res, next) => {
    try {
        const {id} = req
        const is_admin = await User.findOne({_id: id})

        if (!id || !is_admin){
            return res.json({status:401,error:"You're not logged in"})
        }else{
            if (is_admin.role !== "admin"){
                return res.json({status:403,error:"You're not authorized"})

            }else{
                next()
            }

        }
    } catch (e) {
        return res.sendStatus(500)
    }
}

exports.ValidateUserID = async(req,res,next) => {
    const {id} = req.params
    const isUserIDValid = mongoose.Types.ObjectId.isValid(id)

    if (!isUserIDValid) return res.json({status:404,error:"User not found"})

    next()
}