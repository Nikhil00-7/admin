import { createClient } from "redis";
import { authConfig } from ".";
import { logger } from "../Log/logger";
class RedisConfig {

public  rediseClient = createClient({
        url: authConfig.redis_url
    })

    public    async connectRedis (){
try{
    this.rediseClient.on('error', (error)=>{
     logger.error("Redis client error" , error)
    })
  
    if(!this.rediseClient.isOpen){
    await this.rediseClient.connect();
    logger.info("Redis client is Connected");
  }

}catch(err){
  logger.error("failed to connecte " , err);  
}
    }

    public  getClient(){
        return this.rediseClient;
    }
}

export default RedisConfig;