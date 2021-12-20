const User = require("../../model/user");
const {GenerateToken} = require("../../libs/middle/auth");
exports.Register = async (req,res) => {
  try {
       const {email,password} = req.body
        let register_info = req.ip_info
      const NewUser = await User.create({username:req.username,email,password,register_info})

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
        return res.sendStatus(500)
    }
}
exports.Me = async (req,res) => {
    try {

       const user = await User.findOne({_id:req.id})
        return res.json({status:200,data:user})


    }catch (e) {
        return res.sendStatus(500)
    }
}