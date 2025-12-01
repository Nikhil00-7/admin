import express from "express";
import router from "./src/Router/router"
import bodyParser from "body-parser";
import {connectDb }from "./src/config/dbConfig";
import { authConfig } from "./src/config";
import RedisConfig from "./src/config/RedisConfig";
import { cli } from "winston/lib/winston/config";
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 
app.use("/api/admin" , router);

const client = new RedisConfig;


( async()=>{
    await client.connectRedis();
    connectDb();
    app.listen( authConfig.port ,()=> console.log(`server is started on port ${authConfig.port}`))
})();