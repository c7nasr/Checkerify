const express = require("express");
const dotenv = require("dotenv");
const requestIp = require('request-ip');
const helmet = require("helmet");
const Users = require("./routes/user")
const Payments = require("./routes/payments")
const Products = require("./routes/products")
const expressOasGenerator = require('express-oas-generator');




dotenv.config({ path: "./.env" });
const app = express();
expressOasGenerator.handleResponses(app, {});

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')


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
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.all("*", (req, res) => {
    res.sendStatus(404)
});

module.exports = app;
