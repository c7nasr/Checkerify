const User = require("../../model/user");
const {GenerateToken, MakeAvatarForUser} = require("../../libs/middle/auth");
const Order = require("../../model/orders");
const Payment = require("../../model/charges");
exports.Register = async (req,res) => {
  try {
       const {email,password} = req.body
        let register_info = req.ip_info
      const avatar = MakeAvatarForUser(req.username)
      const NewUser = await User.create({username:req.username,email,password,register_info,avatar})

      if (NewUser){
          const token = await GenerateToken(NewUser._id)
          return res.json({status:200,data:token})
      }else{
          return res.json({status:500,error:"Something went error while registering"})
      }

  }catch (e) {
    return res.sendStatus(500)
  }
}
exports.Login = async (req,res) => {
    try {
        const {password} = req.body
        const isExisted = await User.findOne({username:req.username,password}).select("+password")

        if (isExisted){
            const token = await GenerateToken(isExisted._id)
            await User.findOneAndUpdate({username:req.username},{
                $push:{
                    logins: req.ip_info
                }
            })
            return res.json({status:200,data:token})
        }else{
            return res.json({status:404,error:"Account not found"})
        }

    }catch (e) {
            return res.json({status:500,error:"Something went error. try again later"})
    }
}
exports.Me = async (req,res) => {
    try {

       const user = await User.findOne({_id:req.id})

        let userData = {}

        userData.user = user

        userData.orders =await Order.find({by:req.id}).populate("of")
        userData.recharges =await Payment.find({user:req.id}) || []
        return res.json({status:200,data:userData})


    }catch (e) {
        return res.json({status:500,error:"Something went error. try again later"})
    }
}

exports.ListAllUsers = async (req,res) => {
    try {
        const users = await User.find({}).select("+logins +ban +register_info +ban")
        const count = users.length
        return res.json({status:200,count,data:users})
    }catch (e) {
        return res.json({status:500,error:"Something went error. try again later"})
    }
}

exports.UpdateUser = async (req,res) => {
    try {
        const {ban,balance ,ban_reason,role} = req.body
        const {id} = req.params
        if (ban){
            const ban_data = {}
            ban_data.time = new Date().getTime()
            ban_data.reason = ban_reason
            ban_data.banned_by = req.id
            await User.findByIdAndUpdate(id,{$push:{ban:ban_data}},{new:true})
        }else{
            await User.findByIdAndUpdate(id,{balance,isActive:true,role},{new:true})
        }
        return res.json({status:200,data:"User Updated!"})
    }catch (e) {
        return res.json({status:500,error:"Something went error. try again later"})
    }
}

exports.GetUserById = async (req,res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id).select("+logins +ban +register_info +ban")
        if (!user) return res.json({status:404,error:"Account not found"})
        let userData = {}
        userData.user = user

        userData.orders = await Order.find({by:user._id}).populate("of")
        userData.recharges = await Payment.find({user:user._id}) || []
        return res.json({status:200,data:userData})


    }catch (e) {
        return res.json({status:500,error:"Something went error. try again later"})
    }
}