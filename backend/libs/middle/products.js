const mongoose = require("mongoose");
const Joi = require("joi");

exports.ValidateProductID = (req,res,next) =>{
    const {id} = req.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)){
        return res.json({status:404,error:"No Product with this ID"})
    }
    next()
}

const ProductSchema = Joi.object({
    name: Joi.string().trim(true).required(),
    description: Joi.string().trim().required(),
    charge_per_live:Joi.number().min(0.1).positive().required(),
    charge_per_dead:Joi.number().min(0.1).positive().required(),
    image:Joi.string().uri().required()

})
exports.ValidateProductInputs = (req,res,next) => {
    const {name,description,image,charge_per_dead,charge_per_live} = req.body

    const {value,error} = ProductSchema.validate({name,description,image,charge_per_dead,charge_per_live})

    if (error){
        return res.json({
            status:422,
            error:"Some inputs aren't valid"
        })
    }else{
        req.name = value.name
        req.description = value.description
        next()
    }
}
exports.getProductFilters = (role,id) => {
    let filter
    if (role === "user"){
        filter = {_id:id,isActive:true}

    }else if (role === "admin"){
        filter = {_id:id}
    }else{
        return {}
    }
    let select

    if (role === "user"){
        select = "-purchases -ip -__v -isActive"

    }else if (role === "admin"){
        select = "-__v"
    }else{
        return ""
    }
    return {filter,select}
}


exports.listAllProductsFilters = (role) => {
    let filter
    if (role === "user"){
        filter = {isActive:true}
    }else if (role === "admin"){
        filter = {}
    }else{
        return false
    }
    let select

    if (role === "user"){
        select = "-purchases -ip -__v -isActive"

    }else if (role === "admin"){
        select = "-__v"
    }else{
        return ""
    }
    return {filter,select}
}