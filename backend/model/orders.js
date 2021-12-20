const mongoose = require("mongoose");
const { Schema } = mongoose;
const OrderSchema = new Schema(
    {
        by: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        of: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        isCancelled: {
            type: Boolean,
            default: false,
        },
        isError: {
            type: Boolean,
            default: false,
        },
        isOutOfBalance:{
            type: Boolean,
            default: false,
        },
        isPending:{
            type: Boolean,
            default: true,
        },
        uploaded_list:{
            type: String,
            default: "",
        },
        status:{
            type: String,
            default: "Waiting PS to send start signal",
        },
        count:{
            type: Number,
            default: 0,
        },
        left:{
            type: Number,
            default: 0,
        },
        last:{
            type: String,
            default: "XXXX:XXXX",
        },
        time_used:{
            type: String,
            default: "0",
        },
        dead:{
            type: Number,
            default: 0,
        },
        live:{
            type: Number,
            default: 0,
        },
        total_per_dead:{
            type: Number,
            default: 0,
        },
        total_per_live:{
            type: Number,
            default: 0,
        },
        ip:{
            type:{},

        }


    },
    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
