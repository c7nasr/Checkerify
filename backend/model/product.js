const mongoose = require("mongoose");
const { Schema } = mongoose;
const ProductsSchema = new Schema(
    {
        added_by: {
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        name: String,
        description: String,
        charge_per_live: Number,
        charge_per_dead:Number,
        image:String,
        isActive:{
            type: Boolean,
            default:true
        },
        usage:Number,



    },
    { timestamps: true }
);

const Product = mongoose.model("Product", ProductsSchema);

module.exports = Product;
