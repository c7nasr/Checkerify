const Order = require("../../model/orders");
const {ListUserOrdersFilters} = require("../../libs/middle/orders");
const Combo = require("../../model/combo");
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

        // check if combo belong to user
        const isYourCombo = await Combo.findOne({by:req.id})
        if (!isYourCombo) return res.json({status:401,error:"Access Denied"})



        const newOrder = await Order.create({by:req.id,of,combo})

        return res.json({status:200,data:newOrder})

    }catch (e) {
        return res.sendStatus(500)
    }
}
exports.GetOrder = async( req,res) => {
    try {

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