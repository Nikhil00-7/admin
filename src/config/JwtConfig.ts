    import jwt ,{SignOptions}from "jsonwebtoken"
    import { authConfig } from "."
    import Admin from "../Module/Admin"

    class Jwtservice{
        public secret 
        constructor(){
             this.secret = process.env.JWT_AUTH as string
        }
    
        public   options ={
            expireToken: authConfig.expireToken ||  3600
        }

        public generateToken(admin:{id: string  , email:string , role: string}){
        const paylod={
            id : admin.id,
            email: admin.email    ,
            password: admin.role,

        }
        const options : SignOptions={
           expiresIn: authConfig.expireToken ||"1h"
        }
        const token = jwt.sign(paylod , this.secret , options)
        
        return token;
    }

    public verifyToken(token:string){
        try{
        return jwt.verify(token ,this.secret)
        }catch(error){
 throw new Error("Invalid token");
        }
    }


    }


    export default Jwtservice