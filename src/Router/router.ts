import express from "express"
import AdminController from "../Controller/AdminController"
import AdminService from "../Service/AdminService";
import RedisConfig from "../config/RedisConfig";
import jwt ,{SignOptions}from "jsonwebtoken"
const router = express.Router();

const client = new RedisConfig();
const adminService = new AdminService(client);
const adminController = new AdminController(adminService ) ;



const  authmiddleware = async(req: express.Request , res : express.Response , next : express.NextFunction)=>{
    const token = req.headers['authorization'];
    if(!token){
        return res.status(403).json({message: "No token provided"});
    }
    const   header = token.split(" ")[1];
 try{
        if(!client.getClient().isOpen){
            await client.getClient().connect();
        }
    const stored = await client.getClient().get(`token${header}`);
    if(!stored){
         return res.status(403).json({message: "Invalid  token"})
    }
    jwt.verify(header , process.env.JWT_AUTH as string  , (err , decoded)=>{
        if(err){
            console.error("JWT verification failed:", err.message);
            return res.status(401).json({message: "Unauthorized!"});
        }
        (req as any).adminId = (decoded as any).id;
        next();
    });
 }catch(error: any){
  console.error("auth  middleware error" , error);
  return res.status(500).json({message: "Internal server error"});
 }
    
}   
router.post("/create" ,  adminController.create.bind(adminController));
router.post("/login" , adminController.login.bind(adminController))
router.post("/forgotpassword" , adminController.generateOtp.bind(adminController));
router.post("/newPassword" , adminController.newPassword.bind(adminController));
router.post("/logout" , adminController.logout.bind(adminController));
router.get("/getAdminDetails" , authmiddleware , adminController.getAdminDetails.bind(adminController));
export default router;