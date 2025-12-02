   import dotenv from "dotenv";
  dotenv.config();
   
   interface  userConfig{
        service:string,
        port:number,
        mongo_url:string,
        jwtToken: string,
        expireToken ?: number
        log_level:string,
        redis_url:string
    }

    export const authConfig :userConfig ={
       service: process.env.APP_NAME || "hello",
  port: Number(process.env.PORT) || 3001,
  mongo_url: process.env.MONGO_URL || "mongodb://localhost:27017/user_info",
  jwtToken: process.env.JWT_AUTH || "default_secret",
  expireToken: Number(process.env.JWT_EXPIRES_IN ),
  log_level: process.env.LOG_LEVEL || "debug",
   redis_url: process.env. REDIS_URL || 'redis://localhost:6379'

}

        