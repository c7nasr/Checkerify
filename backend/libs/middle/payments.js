const Joi = require("joi");
const Payment = require("../../model/charges");
const coinbase = require("coinbase-commerce-node");
const mongoose = require("mongoose");
const axios = require("axios");
const Client = coinbase.Client;
const Charge = coinbase.resources.Charge;

const schema = Joi.object({
    charge: Joi.number().integer().required().min(5),
})
exports.ValidateCharge = (req,res,next) => {
    const {charge} = req.body
    if (!charge){
        return res.json({status:422,error:"Charge Required!"})
    }else{
     const {error}=    schema.validate({charge})
        if (error){
            return res.json({status:422,error:"Charge isn't correct!!"})
        }else{
            next()
        }
    }
}

exports.ValidatePaymentID = async (req, res, next) => {
    const {id} = req.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.json({status: 422, error: "Invalid Payment ID"})
    } else {
        const PaymentById = await Payment.findOne({_id: id})
        if (!PaymentById){
            return res.json({status: 422, error: "No Payment Found"})
        }
        req.code = PaymentById.code
        next()
    }
}

exports.UpdatePayments = async (payment) => {
    Client.init(process.env.COINBASE);

    // Get payment status
    const {timeline,confirmed_at,applied_threshold,payments} = await Charge.retrieve(payment.code)
    // Update Status if changed
    if (timeline[timeline.length - 1].status !== payment.status) {
        await Payment.findOneAndUpdate({code: payment.code}, {status: timeline[timeline.length - 1].status,confirmed_at,applied_threshold,payments}, {new: true})
    }
}

exports.SendPaymentCancel = async (code) => {

    try {
        const {data,status} =  await axios.post(`https://api.commerce.coinbase.com/charges/${code}/cancel`, {},{
            headers: {
                'X-CC-Api-Key': process.env.COINBASE,
                'X-CC-Version': '2018-03-22',
            }},)

        return  {data:data.data,status}
    }catch (e) {
        return {data:{},status:400}
    }

}