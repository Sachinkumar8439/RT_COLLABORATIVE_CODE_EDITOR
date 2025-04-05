const program = require("../Modes/Programmes");
const crypto = require("crypto");
const User = require("../Modes/User");
const Program = require("../Modes/Programmes");

exports.LinkGenerate = async(req,res) =>{
    try{
        const userId = req.user.id;
        const {programId} = req.body; // path to that route
        const liveLinkExpiredAt = new Date(Date.now()+1000*60*60*5);
        const link = `http://localhost:3000/edit/p/${userId}/${programId}`;

        const liveLinkPassword = crypto.randomBytes(16).toString("hex");
        const savedLink = await program.findByIdAndUpdate(programId,{link,liveLinkExpiredAt,liveLinkPassword},{new:true,lean:true});
        return res.json({
            success:true,
            message:"Link Generate Succussfully",
            link:link,
            password:liveLinkPassword,
            time:liveLinkExpiredAt,
            data:savedLink,
        });
    }catch(e){
        return res.json({
            success:false,
            message:e.message,
        });
    }
}


exports.TerminateLiveLink = async(req,res) =>{
    try{
        const {programId} = req.body;
        const liveLinkExpiredAt = Date.now();
        const updatedProgram = await program.findByIdAndUpdate(programId,{liveLinkExpiredAt},{new:true});
        return res.json({
            success:true,
            message:"Terminated Successfully",
            data:updatedProgram,
        });
    }catch(e){
        return res.json({
            success:false,
            message:"Terminated Successfully",
            data:updatedProgram,
        });
    }
}



exports.checkLink = async(req,res) =>{
    try{
        const {programId,userId} = req.body;
        const isUserExist = await User.findById(userId);
        const isProgramExist = await Program.findById(programId);
        if(!isUserExist || !isProgramExist){
            return res.json({
                success:false,
                message:"Link is Not Valid",
            });
        }

        const expirationTime = isProgramExist.liveLinkExpiredAt;
        const timeInMs = expirationTime.getTime();
        console.log(timeInMs,":",Date.now());
        if(timeInMs < Date.now()){
            return res.json({
                success:false,
                message:"Link has expired",
                expired:false,
            });
        }

        return res.json({
            success:true,
            expired:false,
            time:timeInMs,
        });


    }catch(e){
        return res.json({
            success:false,
            message: e.message,
        });
    }
}


exports.validateMember = async(req,res) =>{
    try{
        const bodyContent = req.body;
        const UserName = bodyContent.username;
        const {programId} = bodyContent;
        const password = bodyContent.code;
        // const userExist = await User.findOne({UserName});
        // if(!userExist){
        //     return res.json({
        //         success:false,
        //         message:"No user exist with this user name",
        //     });
        // }

        const programData = await Program.findById(programId);
        if(!programData){
            return res.json({
                success:false,
                message:"No program found",
            });
        }

        if(programData.liveLinkPassword !== password){
            return res.json({
                success:false,
                message:"Password not matched",
            });
        }

        return res.json({
            success:true,
            message:"Welcome to Live Editor",
            data:programData,
        });

    }catch(e){
        return res.json({
            success:false,
            message:e.message,
        });
    }
}