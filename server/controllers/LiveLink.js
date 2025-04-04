const program = require("../Modes/Programmes");
const crypto = require("crypto");

exports.LinkGenerate = async(req,res) =>{
    try{
        const userId = req.user.id;
        const {programId} = req.body; // path to that route
        const liveLinkExpiredAt = new Date(Date.now()+1000*60*60*5);
        const link = `http://localhost:3000/edit/p/${userId}/${programId}/${liveLinkExpiredAt}`;

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