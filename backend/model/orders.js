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
        combo:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Combo"

        },
        status:{
            type: String,
            default: "Pending: not started yet",
        },
        left:{
            type: Number,

        },
        last:{
            type: String,
            default: "Not Started yet",
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

        },
        lives:{
            type: Array,
            default: [],
        },
        deads:{
            type: Array,
            default: [],
        }


    },
    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
