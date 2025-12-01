import AdminService from "../Service/AdminService";
import { logger } from "../Log/logger";
import express ,{Request , Response , NextFunction} from  "express";
import {forgot}from "../Service/ForgotPass";
class AdminController {
   
    public   admin: AdminService
    public forgot = forgot;
    constructor(admin: AdminService , ){
     this.admin = admin;
  
    }

    public async  create (req: Request , res : Response ){
           try{
                await this.admin.createAdmin(req , res);
            }catch(error){
               logger.error("admin creation is failed");
               console.log(error);
                res.status(500).json({
                     message: "Something went wrong in AdminController",
                 error,
                }) 
            }   
    }

    public async login (req: Request , res :Response){
        try{
           await this.admin.login(req , res);
        }catch(error){
      logger.error("Failed  to login");
      console.log("failed to login " , error);
      res.status(500).json({message: "Something went wrong in login " , error}  )
        }
    }

    public generateOtp(req:Request , res :Response){
            try{
              this.forgot.forgotPassword(req, res);
           }catch(error){
            console.log(error);
            res.status(500).json({message:"Some thing went wrong in forgot password " , error})
           }
    }

    public  newPassword (req:Request , res:Response){
          try{
           this.forgot.newPassword(req , res);
          }catch(error){
            console.log(error);
            res.status(500).json({message:"Some thing went wrong in new password" , error})
           }
    }

    public  logout(req: Request , res: Response){
         try{
             this.admin.logout(req , res);
         }catch(error: any){
          logger.error("failed to logout admin" , error);
          res.status(500).json({message: "Internal server error" , error})
         }
    }

    public getAdminDetails (req: Request , res: Response){  
        try{            
      this.admin.getAll(req , res);
        }catch(error){
            logger.error("failed to get admin details" , error);
            res.status(500).json({message: "Internal server error" , error})
        }
}
}

export default AdminController;
