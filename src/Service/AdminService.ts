import {logger} from '../Log/logger'
import Admin from "../Module/Admin";
import express, { Request, Response, NextFunction } from "express";
import RedisConfig from '../config/RedisConfig';
import { stripTypeScriptTypes } from 'module';
import {Role} from "../Module/Admin";
import  Jwtservice from "../config/JwtConfig"
import { isGeneratorFunction } from 'util/types';
import Otp from './Otp';
class AdminService{

  public   jwt  = new  Jwtservice();
  public otp = new Otp();

  public   redisClient

  constructor(redisClient: RedisConfig ) {
    this.redisClient = redisClient.getClient();
  
  }

public  async createAdmin (req : Request , res :Response){
    try{
        const {adminName , email , password} = req.body;
          const check = await Admin.findOne({email});
          if(check){
            logger.info("admin isalready exist");
            return res.status(403).json({message : "Admin already exist "});
          }
         if(!this.redisClient.isOpen){
          await this.redisClient.connect();
         }
        await this.redisClient.set(`admin ${email}` , JSON.stringify(adminName ,  email , password));
   
       const create = new Admin({
         adminName ,
         email,
         password
       })
       await create.save();
     
       logger.info("Admin is. created");
       return res.status(201).json(create);

    }catch(error){ 
        logger.error("Admin creation failed");
        console.log(error);
        return res.status(500).json({message: "Admin creation is failed" , error});
    }
}

public async login(req: Request , res: Response){ 
  const {adminName , email , password} = req.body;
try{
    
 const checkAdmin = await  Admin.findOne({ adminName, email });
   if(!checkAdmin)return res.status(403).json({message: "invalid admin "})

    const isMatch = await checkAdmin.comparePassword(password);
    if(!isMatch){
      return res.status(403).json({message: "wrong password"});
    }
     if(checkAdmin?.role !== Role.ADMIN){
         return res.status(403).json({message : "unauthorized admin"})
     }
const token = await this.jwt.generateToken({
  id: checkAdmin.id,
  email: checkAdmin.email,
  role: checkAdmin.role
});

if(!this.redisClient.isOpen){
  await this.redisClient.connect();
}
await this.redisClient.set(`token${token}` , token  ,{EX : this.jwt.options.expireToken });
logger.info("token is generated" , token);
return res.status(200).json({token : token})
  }catch(error){
    logger.error("faile to generate token" , error);
    console.error(error);
    return res.status(500).json({message : "Internal server error"})
    }
}

public async logout (req: Request , res : Response) {
  try{
      const header = req.headers.authorization;
      if(!header) {
          return res.status(404).json({message : "Token is missing "});
      }

      const token = header.split(" ")[1];
   if(!this.redisClient.isOpen) { this.redisClient.connect();}

      const stored = await this.redisClient.get(`token${token}`);
        
      if(!stored){return res.status(404).json({message: "Invalid Token"});}

     await  this.redisClient.del(`token${token}`);
       logger.info("admin is logged out successfully");
       return res.status(200).json({message : "admin is logged out successfully"});
     
    }catch(err){
     console.error(err);
     logger.error("failed to logout admin" , err);
     return res.status(500).json({message: "Internal server error"});
  }
}


public async getAll(req: Request , res: Response){
  try{ 
    await Admin.find().then((data)=>{
      return res.status(200).json(data);
    });
  }catch(error: any ){
    logger.error("failed to fetch admin data" , error);   
    return res.status(500).json({message: "Internal server error"});
    
  }
}
}





export default AdminService;