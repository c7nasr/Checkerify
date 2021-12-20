const express = require("express");
const dotenv = require("dotenv");
const requestIp = require('request-ip');
const helmet = require("helmet");
const multer = require('multer')
const Users = require("./routes/user")
const Payments = require("./routes/payments")
const Products = require("./routes/products")
const Orders = require("./routes/orders")
const Uploads = require("./routes/uploads")
const expressOasGenerator = require('express-oas-generator');




dotenv.config({ path: "./.env" });
const app = express();
expressOasGenerator.handleResponses(app, {});

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const fileExtension = require("file-extension");
const {randomBytes} = require("crypto");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const ext = fileExtension(file.originalname);
        const file_name = file.originalname.replace("."+ext,"") + "_" + randomBytes(4).toString("hex") + "." + ext
        cb(null, file_name)
    }
})
const upload = multer({ storage: storage })

app.use(upload.single("file"))
app.use(helmet());
app.use(function (req, res, next) {
    next();
});
app.use(requestIp.mw({ attributeName : 'ip' }))


app.use(express.json({
    verify(req, res, buf, encoding) {
        req.rawBody = buf
    }
}));
if (process.env.NODE_ENV === "development"){
    const morgan = require("morgan");
    app.use(morgan('dev'))

}
app.use("/user", Users);
app.use("/payments", Payments);
app.use("/products", Products);
app.use("/orders", Orders);
app.use("/uploads", Uploads);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.all("*", (req, res) => {
    res.sendStatus(404)
});

module.exports = app;
