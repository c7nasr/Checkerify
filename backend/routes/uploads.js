
const express = require("express");
const {LookIP} = require("../libs/middle/ip");
const { ValidateToken, isAdmin} = require("../libs/middle/auth");
const {UploadCombo, UploadImage} = require("../controller/uploads/uploads");
const {ValidateCombo, ValidateImage} = require("../libs/middle/uploads");

const router = express.Router();

router.route("/image").post(LookIP,ValidateToken, isAdmin,ValidateImage,UploadImage)
router.route("/combo").post(LookIP,ValidateToken, ValidateCombo, UploadCombo)
// router.route("/me").get(LookIP,ValidateToken,Me)

module.exports = router;
