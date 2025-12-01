import express from "express"
import AdminController from "../Controller/AdminController"
import AdminService from "../Service/AdminService";
import RedisConfig from "../config/RedisConfig";
const router = express.Router();

const client = new RedisConfig();
const adminService = new AdminService(client);
const adminController = new AdminController(adminService ) ;

const  authmiddleware = (req: express.Request , res : express.Response , next : express.NextFunction)=>{
    const token = req.headers['authorization'];
    if(!token){
        return res.status(403).json({message: "No token provided"});
    }
    //verify token logic here
    next();
}   
router.post("/create" ,  adminController.create.bind(adminController));
router.post("/login" , adminController.login.bind(adminController))
router.post("/forgotpassword" , adminController.generateOtp.bind(adminController));
router.post("/newPassword" , adminController.newPassword.bind(adminController));
router.post("/logout" , adminController.logout.bind(adminController));
router.get("/getAdminDetails" , authmiddleware , adminController.getAdminDetails.bind(adminController));
export default router;