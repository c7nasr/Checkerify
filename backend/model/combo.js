const mongoose = require("mongoose");
const { Schema } = mongoose;
const ComboSchema = new Schema(
    {
        by: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        url: String,
        count:{
            type: Number,
            default: 0,
        },

        ip:{
            type:{},

        },

        isValid:{
            type: Boolean,
            default: false,
        },
        size:{
            type: String,
            default: "0 KB",
        },
        original_name:{
            type: String,
            default: "",
        },
        uploaded_name:{
            type: String,
            default: "",
        }



    },
    { timestamps: true }
);

const Combo = mongoose.model("Combo", ComboSchema);

module.exports = Combo;
