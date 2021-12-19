const Product = require("../../model/product");
exports.ListAllProducts = async (req,res) => {
try {
    const products = await Product.find({}).sort("-createdAt")
    return res.json({status:200,data:products})
}catch (e) {
    return res.sendStatus(500)
}
}
exports.GetProduct = async (req,res) => {
    try {
        const {id} = req.params
        const product = await Product.findById(id)
        if (!product) return res.json({status:404,error:"No Product with this ID"})
        return res.json({status:200,data:product})
    }catch (e) {
        return res.sendStatus(500)
    }
}
exports.AddNewProduct = async (req,res) => {
    try {
        const {image,charge_per_dead,charge_per_live} = req.body
        req.ip_info.operation = "CREATE"
        const product = await Product.create({$push:{ip:req.ip_info},name:req.name,description:req.description,image,charge_per_dead,charge_per_live,ip:req.ip_info,added_by:req.id})
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
