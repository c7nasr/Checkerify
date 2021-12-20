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
        const user = await User.findById(req.id)
        const isComboValid = mongoose.Types.ObjectId.isValid(combo)
        const isProductValid = mongoose.Types.ObjectId.isValid(of)
        let ComboCollection = null
        let ProductCollection = null
        if (isComboValid)
            ComboCollection = await Combo.findById(combo)
        if (isProductValid)
            ProductCollection = await Product.findById(of)

        if (!ProductCollection || !req.id || !user || !ComboCollection
        ) {
            return res.json({status: 404, error: "Invalid Inputs"})
        } else {
            next()
        }
    } catch (e) {
        console.log(e)
        return res.json({status: 500, error: "Something went error. it's not your fault"})
    }
}