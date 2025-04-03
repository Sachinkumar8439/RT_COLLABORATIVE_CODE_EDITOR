const User = require("../Modes/User");
const jwt = require("jsonwebtoken");

exports.SignUp = async(req,res) =>{
    try{
        const {UserName,Name,Email,Password} = req.body;
        const isUserExist = await User.findOne({Email:Email});
        if(isUserExist){
            return res.json({
                success:false,
                message:"User Already Exist"
            });
        }

        const isUserNameExisted = await User.findOne({UserName:UserName});

        if(isUserNameExisted){
            return res.json({
                success:false,
                message:"Plz Change Your UserName, User already Exist With This UserName",
            });
        }

        // we just storing the password, we're not gonna hash password for small task
        const newUser = new User({UserName,Name,Email,Password});
        const userAdded = await newUser.save();
        if(!userAdded){
            return res.json({
                success:false,
                message:"Something Went Wrong Plz Try Again Later",
            });
        }

        return res.json({
            success:true,
            message:"Sign Up Successfully",
            user:userAdded,
        });


    }catch(e){
        res.json({
            succcess:false,
            message:e.message,
            where:"Inside catch",
        })
    }
}










exports.LogIn = async(req,res) =>{
    try{
        const {Email,Password} = req.body;

        const isUserExist = await User.findOne({Email:Email});
        if(!isUserExist){
            return res.json({
                success:false,
                message:"User Not Found, SignUp First",
            });
        }

        if(Password !== isUserExist.Password){
            return res.json({
                success:false,
                message:"Password Not Matched",
            });
        }

        const payload = {
            email:isUserExist.Email,
            id:isUserExist._id,
        }

        const token = jwt.sign(payload,"Lovekush_Sachin",{
            expiresIn:"5h"
        });
        const user = {...isUserExist._doc,token:token};
        // user.token = token;
        // console.log("token:",token);
        // console.log("user data inside login:",user);
        const options = {
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }

        return res.cookie("token",token,options).json({
            success:true,
            message:"Logged In Successfully",
            user:user,
            token:token,
        });

    }catch(e){
        return res.json({
            success:false,
            message:e.message,
        })
    }
}