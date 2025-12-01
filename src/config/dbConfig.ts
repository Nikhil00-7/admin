import mongoose from "mongoose";
import {authConfig} from "./index"
import { logger } from "../Log/logger";

export const connectDb = async()=>{
    try{
     await mongoose.connect(authConfig.mongo_url)
       console.log(`mongodb is connected`)
       logger.info("mongodb is connected successfull")
    }catch(error){
      console.error('mongodb is. failed to connect')
     logger.info("mongodb is failed to connect");
     }
}

