
const express = require("express");
const {Login, Register, Me, ListAllUsers, UpdateUser, GetUserById} = require("../controller/users/authentication");
const {LookIP} = require("../libs/middle/ip");
const {CheckRegister, CheckLogin, ValidateToken, isAdmin, ValidateUserID} = require("../libs/middle/auth");

const router = express.Router();

router.route("/auth/register").post(LookIP,CheckRegister,Register)
router.route("/auth/login").post(LookIP,CheckLogin,Login)
router.route("/me").get(LookIP,ValidateToken,Me)

// Admin Routes
router.route("/").get(LookIP,ValidateToken,isAdmin,ListAllUsers)
router.route("/:id").post(LookIP,ValidateToken,isAdmin,ValidateUserID,UpdateUser)
router.route("/:id").get(LookIP,ValidateToken,isAdmin,ValidateUserID,GetUserById)

module.exports = router;
