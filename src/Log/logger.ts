    import winston from "winston";
    import {authConfig} from "../config/index"
    import fs, { mkdirSync } from "fs";

    import path from "path";


      const logDir = path.resolve("logs")
     

      if(!fs.existsSync(logDir)){
         mkdirSync(logDir , { recursive: true })
      }
       const logFile = path.join(logDir , "logFile.log");
      export const logger = winston.createLogger({

        level : authConfig.log_level,
        format : winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({level , timestamp , message , ...meta})=>{
                return `${timestamp}  ${level.toUpperCase()} [${authConfig.service}]  ${message} ${Object.keys(meta)? JSON.stringify(meta) : ""}`
                
                })
        ),

        transports:[
            new winston.transports.Console(),
             new winston.transports.File({filename : logFile})
        ]
    })