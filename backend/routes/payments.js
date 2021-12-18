
const express = require("express");
const {NewPayment, PaymentsHistory, GetPayment, CancelPayment, GetAllPayments, WebHook} = require("../controller/payments/payments");
const {ValidateToken, isAdmin} = require("../libs/middle/auth");
const {LookIP} = require("../libs/middle/ip");
const {ValidateCharge, ValidatePaymentID} = require("../libs/middle/payments");

const router = express.Router();

router.route("/new").post(LookIP,ValidateToken,ValidateCharge,NewPayment)
router.route("/history").post(LookIP,ValidateToken,PaymentsHistory)
router.route("/cancel/:id").post(LookIP,ValidateToken,ValidatePaymentID,CancelPayment)
router.route("/:id").get(LookIP,ValidateToken,ValidatePaymentID,GetPayment)
router.route("/").get(LookIP,ValidateToken,isAdmin,GetAllPayments)
router.route("/hook").post(WebHook)

module.exports = router;
