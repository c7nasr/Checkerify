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
        console.log(e)
        return res.sendStatus(500)
    }
}
exports.AddNewProduct = async (req,res) => {

}
exports.EditProduct = async (req,res) => {

}
