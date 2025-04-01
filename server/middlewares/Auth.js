const jwt = require("jsonwebtoken");
const User = require("../Modes/User");

exports.auth = async(req,res,next) =>{
    try{
        const token = req.body.token || req.cookies.token || req.header("Authorisation").replace("Bearer ","");
        if(!token){
            return res.json({
                success:false,
                message:"Token Not Found",
            });
        }

        try{
            const decode = jwt.verify(token,"Lovekush_Sachin");
            req.user = decode;
        }catch(e){
            return res.json({
                success:false,
                message:"Something heppend during verifying token",
            });
        }
        next();
    }catch(e){
        return res.json({
            success:false,
            message:e.message,
        });
    }

}