const coinbase = require('coinbase-commerce-node');
const Payment = require("../../model/charges");
const async = require("async");
const {UpdatePayments, SendPaymentCancel} = require("../../libs/middle/payments");
const User = require("../../model/user");
const Client = coinbase.Client;
const Charge = coinbase.resources.Charge;

exports.NewPayment = async (req, res) => {
    Client.init(process.env.COINBASE);

    try {
        const {id} = req

        const isHaveOrder = await Payment.findOne({user:id,status:"NEW"})

        if (isHaveOrder) return res.json({status:401,error:"Sorry, You already has unpaid order"})


        const {charge} = req.body
        const receivable = charge * process.env.RATE

        const checkoutData = {
            'name': 'Recharging Checkerify',
            'description': 'Mastering the Transition to the Information Age',
            'pricing_type': 'fixed_price',
            'local_price': {
                'amount': charge,
                'currency': 'USD'
            },
            'metadata':{
                "id":id,
                "amount":receivable,
            }
        };
        const charge_req = await Charge.create(checkoutData)
        const user = await User.findById(id)
        const NewPayment = await Payment.create({
            user: id,
            charge,
            addresses: charge_req.addresses,
            code: charge_req.code,
            at: charge_req.created_at,
            expires_at: charge_req.expires_at,
            at_exchange_rates: charge_req.exchange_rates,
            uuid: charge_req.id,
            receivable,
            ip:req.ip_info,
            pricing:charge_req.pricing,
            balance_before:user.balance,
            payment_link:charge_req.hosted_url
        })
        return res.json({status:200,data: NewPayment})

    } catch (e) {
        return res.json({status:500,error: "Something went error while creating payment!"})
    }
}


exports.PaymentsHistory = async (req, res) => {

    try {
        const {id} = req
        let all_payments = await Payment.find({
            user: id
        })
        await async.map(all_payments, UpdatePayments)
        const history = await Payment.find({
            user: id
        }).sort("-createdAt")
        return res.json({status:200,data:history})

    } catch (e) {
        return res.json({status:500,error: "Something went error while fetching payments!"})
    }
}

exports.GetPayment = async (req, res) => {
    try {
        Client.init(process.env.COINBASE);

        const {id} = req
        const {code} = req.params
        if (!code || code === "") return res.json({status:404,error: "not found"})
        const {timeline,confirmed_at,applied_threshold,payments} = await Charge.retrieve(code)

        let payment = await Payment.findOneAndUpdate({
          user:id, code
        },{
            status:timeline[timeline.length -1].status,
            confirmed_at,applied_threshold,payments,
            timeline
        },{new:true}) || null

        return res.json({status:200,data:payment})

    } catch (e) {
        console.log(e)
        return res.json({status:500,error: "Something went error while fetching a payment!"})
    }
}

exports.GetAllPayments = async (req, res) => {
    try {
        Client.init(process.env.COINBASE);
        const outdated_payments = await Payment.find({}).sort("-createdAt")
        await async.map(outdated_payments, UpdatePayments)
        const payments = await Payment.find({}).sort("-createdAt")

        return res.json({status:200,data:payments})

    } catch (e) {
        return res.json({status:500,error: "Something went error while fetching payments!"})

    }
}

exports.CancelPayment = async (req, res) => {
    try {

        const {id, code} = req

        const {data,status} = await SendPaymentCancel(code)

        if (status === 200){
            await Payment.findOneAndUpdate({
                user:id,  code
            },{
                status:data.timeline[data.timeline.length -1].status,
            })

            return res.json({status:200,data:"Payment Cancelled"})
        }else{
            return res.json({status:403,error:"Payment can't be cancelled!"})

        }

    } catch (e) {
        return res.json({status:500,error: "Something went error while cancelling payment!"})
    }
}




exports.WebHook = async (req, res) => {
    const Webhook = require('coinbase-commerce-node').Webhook;

    try {
        Client.init(process.env.COINBASE);
        const rawBody = req.rawBody
        const signature = req.headers['x-cc-webhook-signature']
        const sharedSecret = process.env.HOOK

        const events =  Webhook.verifyEventBody(rawBody, signature, sharedSecret);
        console.log(events.type)
        if (events.type==="charge:confirmed"){
            console.log(events.metadata)
            const {id,amount} = events.metadata
            await User.findByIdAndUpdate(id,{$inc:{
                balance:amount,recharges:1
                }})
            await Payment.findOneAndUpdate({uuid:events.data.id},{status:"COMPLETED",timeline:events.data.timeline,payments:events.data.payments},{new:true})

        }
        if (events.type === "charge:pending"){
            console.log("Pending...")
        }
        if (events.type === "charge:failed"){
            console.log(events.data.id)
            console.log("failed or expired...")

            await Payment.findOneAndUpdate({uuid:events.data.id},{status:events.data.timeline[events.data.timeline.length -1].status,timeline:events.data.timeline},{new:true})


        }
        return res.sendStatus(200)

    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}