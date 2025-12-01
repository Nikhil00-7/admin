  import { logger } from "../Log/logger";
  import Admin from "../Module/Admin";
  import Otp from './Otp';
  import RedisConfig from '../config/RedisConfig';
  import express, { Request, Response, NextFunction } from "express";

  class ForgotPass {

    public otp = new Otp();
    public   redisClient

    constructor(redisClient: RedisConfig ) {
      this.redisClient = redisClient.getClient();
    
    }

  public  async forgotPassword (req :Request , res: Response){

  try{
      const {email} = req.body || {};
    if(!email){
      return res.status(400).json({ message: "Email is required" });
    }
  const generateOtp = this.otp.generateOtp();
  const  checkFirst = await Admin.findOne({email});

  if(!checkFirst){
  logger.error("un authorized admin");
    return res.status(403).json({message: "un authorized admin"});
  }

  if(!this.redisClient.isOpen){
            await this.redisClient.connect();
          }
    
          await this.redisClient.set(`otp:${email}`, generateOtp, {
    EX: 300, 
  });

  logger.info("opt. is generated" , generateOtp);
    return res.status(201).json({message: "Otp is generated" , Otp: generateOtp});
  }catch(error){
  logger.error("failed to generate otp");
  return res.status(500).json({message: "Internal service issue"});
  }
  }


  public async newPassword(req: Request , res : Response) {
    const {email , otp    , newPassword} = req.body;
    try{
      if(!email || !otp || !newPassword)  return res.status(400).json({message: "Bad credential "})
    
        if(!this.redisClient.isOpen){
            await this.redisClient.connect();
          }
    
      const checkOtp = await this.redisClient.get(`otp:${email}`)
      
      if(!checkOtp){
        return res.status(403).json({message:"Otp not found try again"});
      }

      if(checkOtp !== otp){
        return res.status(404).json({message :" wrong otp"});
      }
    
      const admin = await Admin.findOne({email});
      if(!admin){
        return res.status(404).json({message:"admin not found"});
      }

    admin.password = newPassword;
    await  admin.save();

    logger.info("password has changed. successfully ");
    return res.status(201).json({messsage:"password  changed" , new: newPassword});
    }catch(error){
      logger.error("failed to generate new Password");
      console.log("failed to create new password" , error);
      return res.status(500).json({mesage :"Internal server error"})
    }
  }

  }

  export const forgot = new ForgotPass(new RedisConfig());