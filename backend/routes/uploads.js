
const express = require("express");
const {LookIP} = require("../libs/middle/ip");
const { ValidateToken} = require("../libs/middle/auth");
const {UploadCombo} = require("../controller/uploads/uploads");
const {ValidateCombo} = require("../libs/middle/uploads");

const router = express.Router();

// router.route("/image").post(LookIP,CheckRegister,Register)
router.route("/combo").post(LookIP,ValidateToken, ValidateCombo, UploadCombo)
// router.route("/me").get(LookIP,ValidateToken,Me)

module.exports = router;
