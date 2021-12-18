
const express = require("express");
const {ValidateToken, isAdmin} = require("../libs/middle/auth");
const {LookIP} = require("../libs/middle/ip");
const {AddNewProduct, EditProduct, ListAllProducts, GetProduct} = require("../controller/products/products");
const {ValidateProductID} = require("../libs/middle/products");

const router = express.Router();
router.route("/new").post(LookIP,ValidateToken,isAdmin,AddNewProduct)
router.route("/edit/:id").post(LookIP,ValidateToken,isAdmin,EditProduct)
router.route("/:id").get(LookIP,ValidateToken,ValidateProductID,GetProduct)
router.route("/").get(LookIP,ValidateToken,ListAllProducts)

module.exports = router;
