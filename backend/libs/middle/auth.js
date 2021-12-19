const Joi = require('joi');
const User = require("../../model/user");
const jwt = require("jsonwebtoken");

const RegisterSchema = Joi.object({
    username: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).trim().required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),


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

        const is_valid = await jwt.verify(token, process.env.JWT_SECRET)
        if (is_valid){
            req.id = is_valid.id
            next()
        }else{
            return res.json({status: 401})

        }

    }catch (e) {
        return res.json({status: 401})
    }
}

exports.CheckRegister = async (req, res, next) => {
    const {username, email, password} = req.body

    const {error} = RegisterSchema.validate({username, email, password});
    if (error) {
        return res.json({status: 422, error: "Some inputs isn't valid"})
    } else {
        const is_existed = await User.findOne({username})
        if (!is_existed) return next()
        return res.json({status: 422, error: "Username is already existed"})

    }

}

exports.CheckLogin = async (req, res, next) => {
    const {username, password} = req.body

    const {error} = LoginSchema.validate({username, password});
    if (error) {
        return res.json({status: 422, error: "Some inputs isn't valid"})
    } else {
        req.username = username
       next()

    }

}


exports.isAdmin = async (req, res, next) => {
    try {
        const {id} = req
        const is_admin = await User.findOne({_id: id})

        if (!id || !is_admin){
            return res.json({status:401,error:"You're not authorized"})
        }else{
            if (is_admin.role !== "admin"){
                return res.json({status:401,error:"You're not authorized"})

            }else{
                next()
            }

        }
    } catch (e) {
        return res.sendStatus(500)
    }
}