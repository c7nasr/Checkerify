const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
    {
        email: {
            type: String,
        },
        username: {
            type: String,
            unique: true,
            required:true

        },
        password: {
            type: String,
            select:false
        },
        balance: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        role:{
            type: String,
            default: "user",
        },
        orders:{
            type: Number,
            default: 0,
        },
        recharges:{
            type: Number,
            default: 0,
        },
        logins:{
            type:[{}],
            default:[],
            select:false

        },
        register_info:{
            type:{},
            select:false
        },
        ban:{
            type:Array,
            select:false
        },
        avatar:{type:String,default:""}


    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
