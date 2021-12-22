
const express = require("express");
const {ValidateToken, isAdmin} = require("../libs/middle/auth");
const {LookIP} = require("../libs/middle/ip");
const {ListAllOrders, ListUserOrders, CreatOrder, GetOrder, CancelOrder, UpdateOrder} = require("../controller/orders/orders");
const {ValidateUserID,   ValidateCreateInputs, ValidateOrderID} = require("../libs/middle/orders");

const router = express.Router();
router.route("/").get(ValidateToken,isAdmin,ListAllOrders)
router.route("/:user/all").get(ValidateToken,ValidateUserID,ListUserOrders)

router.route("/").post(LookIP,ValidateToken,ValidateCreateInputs,CreatOrder)
router.route("/update/:id").post(LookIP,ValidateToken,ValidateOrderID,UpdateOrder)
router.route("/cancel/:id").post(LookIP,ValidateToken,ValidateOrderID,CancelOrder)

router.route("/:id").get(LookIP,ValidateToken,ValidateOrderID,GetOrder)

module.exports = router;
