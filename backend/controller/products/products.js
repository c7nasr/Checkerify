const Product = require("../../model/product");
const {getProductFilters, listAllProductsFilters} = require("../../libs/middle/products");
exports.ListAllProducts = async (req,res) => {
try {
    const {role} = req
    const {filter,select} = listAllProductsFilters(role)
    if (!filter || !select) return res.sendStatus(500)
    const products = await Product.find(filter).select(select).sort("-createdAt")
    const count = await  products.length
    return res.json({status:200,count,data:products})
}catch (e) {
    console.log(e)
    return res.sendStatus(500)
}
}
exports.GetProduct = async (req,res) => {
    try {
        const {id} = req.params
        const {role} = req
        const {select,filter} = getProductFilters(role,id)
        if (select === "" || filter === {}) return res.sendStatus(500)
        const product = await Product.findOne(filter).select(select)
        if (!product) return res.json({status:404,error:"No Product with this ID"})
        return res.json({status:200,data:product})
    }catch (e) {
        return res.sendStatus(500)
    }
}
exports.AddNewProduct = async (req,res) => {
    try {
        const {image,charge_per_dead,charge_per_live,checker_server,
            separator} = req.body
        req.ip_info.operation = "CREATE"
        const product = await Product.create({
            $push:{ip:req.ip_info},
            name:req.name,
            description:req.description,
            image,charge_per_dead,charge_per_live,
            ip:req.ip_info,added_by:req.id,
        separator,checker_server})
        if (!product) return res.json({status:500,error:"Something went error while creating the product"})
        return res.json({status:200,data:product})
    }catch (e) {
        return res.sendStatus(500)
    }
}
exports.EditProduct = async (req,res) => {
    try {
        const {image,charge_per_dead,charge_per_live,isActive} = req.body
        const {id} = req.params
        req.ip_info.operation = "UPDATE"
        await Product.findByIdAndUpdate(id,{name:req.name,description:req.description,image,charge_per_dead,charge_per_live,isActive,$push:{ip:req.ip_info}},{new:true})
        return res.json({status:200,data:`${req.name} updated`})


    }catch (e) {
        return res.sendStatus(500)

    }
}
