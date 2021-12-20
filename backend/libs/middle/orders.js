const mongoose = require("mongoose");
const Product = require("../../model/product");
const User = require("../../model/user");
const Combo = require("../../model/combo");
exports.ListUserOrdersFilters = (role) => {
    let select
    if (role === "admin") {
        select = "-__v"
    } else if (role === "user") {
        select = "-ip -__v"
    } else {
        select = ""
    }

    return {select}
}
exports.ValidateUserID = (req, res, next) => {
    const {user} = req.params

    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
        return res.json({status: 404, error: "Invalid User ID"})
    } else {
        next()
    }
}
function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

exports.ValidateCreateInputs = async (req, res, next) => {
    try {
        const {of,combo} = req.body
        const product = await Product.findById(of)
        const user = await User.findById(req.id)
        const isCombo = await Combo.findById(combo)

        if (!of || !mongoose.Types.ObjectId.isValid(of) || !product || !req.id || !mongoose.Types.ObjectId.isValid(req.id)
        || !user || !isCombo || !combo
        ) {
            return res.json({status: 404, error: "Invalid Inputs"})
        } else {
            next()
        }
    } catch (e) {
        return res.json({status: 500, error: "Something went error. it's not your fault"})
    }
}