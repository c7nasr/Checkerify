const mongoose = require("mongoose");
exports.ValidateProductID = (req,res,next) =>{
    const {id} = req.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)){
        return res.json({status:404,error:"No Product with this ID"})
    }
    next()
}