const mongoose = require("mongoose");
const { Schema } = mongoose;
const PaymentsSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        balance_before:Number,
        addresses: {
            type: {}
        },
        charge: {
            type: Number,
        },
        code: {
            type: String,
        },
        at:{
            type: String,
        },
        expires_at:{
            type: String,
        },
        at_exchange_rates:{
            type: {},
        },
        uuid:String,
        status:{
            type: String,
            default: "NEW",
        },
        ip:{},
        receivable:Number,
        confirmed_at:String,
        applied_threshold:String,
        payments:Array,
        pricing:Array,
        payment_link:String,

    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentsSchema);

module.exports = Payment;
