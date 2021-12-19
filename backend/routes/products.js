
const express = require("express");
const {ValidateToken, isAdmin} = require("../libs/middle/auth");
const {LookIP} = require("../libs/middle/ip");
const {AddNewProduct, EditProduct, ListAllProducts, GetProduct} = require("../controller/products/products");
const {ValidateProductID,  ValidateProductInputs} = require("../libs/middle/products");

const router = express.Router();
router.route("/").post(LookIP,ValidateToken,isAdmin,ValidateProductInputs,AddNewProduct)
router.route("/edit/:id").post(LookIP,ValidateToken,isAdmin,ValidateProductInputs,EditProduct)
router.route("/:id").get(LookIP,ValidateToken,ValidateProductID,GetProduct)
router.route("/").get(LookIP,ValidateToken,ListAllProducts)

module.exports = router;
