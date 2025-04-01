const User = require("../Modes/User");

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
        const {email,password} = req.body();

    }catch(e){

    }
}