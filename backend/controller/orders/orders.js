const Order = require("../../model/orders");
const {ListUserOrdersFilters} = require("../../libs/middle/orders");
const Combo = require("../../model/combo");
const Product = require("../../model/product");
const User = require("../../model/user");

exports.ListAllOrders = async( req,res) => {
    try {
        const orders = await Order.find({}).sort("-createdAt").populate("by").populate("of").populate("combo")
        const count = orders.length
        return res.json({status:200,count,data:orders})
    }catch (e) {
        return res.sendStatus(500)
    }
}

exports.ListUserOrders = async( req,res) => {
    try {
        const {role} = req
        const {user} = req.params
        if (user !== req.id && role !=="admin") return res.json({status:401,error:"Access Denied"})
        const {select} = ListUserOrdersFilters(role)
        if (select === "") return res.sendStatus(500)
        const orders = await Order.find({by:user}).sort("-createdAt").populate("by",select).populate("combo",select).populate("of",select)
        const count = orders.length
        return res.json({status:200,count,data:orders})
    }catch (e) {
        return res.sendStatus(500)
    }
}
exports.CreatOrder = async( req,res) => {
    try {

        const  {of,combo} = req.body

        const isYourCombo = await Combo.findOne({by:req.id})
        if (!isYourCombo) return res.json({status:401,error:"Access Denied"})

        const newOrder = await Order.create({by:req.id,of,combo})
        if (newOrder) {
            await Product.findByIdAndUpdate(of,{$inc:{purchases:1}},{new:true})
            await  User.findByIdAndUpdate(req.id,{$inc:{orders:1}},{new:true})
        }
        return res.json({status:200,data:newOrder})

    }catch (e) {
        return res.sendStatus(500)
    }
}
exports.GetOrder = async( req,res) => {
    try {
        const {role,id:user} = req

        const {id} = req.params

        const order = await Order.findById(id)
        if (!order) return res.json({status: 404, error: "Not Found"})
        if (role !== "admin" && user !== order.by){
            return res.json({status:401,error:"Access Denied"})
        }

        return res.json({status:200,data:order})


    }catch (e) {
        return res.sendStatus(500)
    }
}

exports.CancelOrder = async( req,res) => {
    try {

    }catch (e) {
        return res.sendStatus(500)
    }
}

exports.UpdateOrder = async( req,res) => {
    try {

    }catch (e) {
        return res.sendStatus(500)
    }
}