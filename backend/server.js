const app = require("./app");
const mongoose = require("mongoose");
const expressOasGenerator = require("express-oas-generator");



const db = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
const port = process.env.PORT || 5000;

const ServerBoot = async () =>{
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.info("Database Connected.... Starting Server")
        expressOasGenerator.handleRequests();

        app.listen(port, () => {
            console.info("Server Booted on port " + port + "...");
        });
    }catch (e) {
        console.error("Database is Down!")
        process.exit()
    }


}

_ = ServerBoot()

