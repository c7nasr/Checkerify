
const express = require("express");
const {Login, Register, Me} = require("../controller/users/authentication");
const {LookIP} = require("../libs/middle/ip");
const {CheckRegister, CheckLogin, ValidateToken} = require("../libs/middle/auth");

const router = express.Router();

router.route("/auth/register").post(LookIP,CheckRegister,Register)
router.route("/auth/login").post(LookIP,CheckLogin,Login)
router.route("/me").get(LookIP,ValidateToken,Me)

module.exports = router;
