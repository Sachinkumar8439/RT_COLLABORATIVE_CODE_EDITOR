const Program = require("../Modes/Programmes");
const User = require("../Modes/User");

exports.saveCode = async (req, res) => {
  try {
    const { code = "", extension, id, fileName } = req.body;
    const userId = req.user.id;

    console.log(
      "hello i am under saveCode-------------------------------------------",
      code,
      extension,
      id,
      fileName,
      userId,
    );
    const exist = await Program.findById(id);
    if (exist) {
      const updateFile = await Program.findByIdAndUpdate(
        id,
        { code: code, fileName: fileName },
        { new: true }
      );
      if (!updateFile) {
        return res.json({
          success: false,
          message: "Try Again Later",
        });
      }
      return res.json({
        success: true,
        message: "Saved Successfully",
      });
    }

    const newFile = new Program({ code, extension, fileName });
    const saved = await newFile.save();
    const pushedCode = await User.findByIdAndUpdate({_id:userId},{$push:{
                                                                    Programmes : saved._id,
                                                                    }},{new:true}).populate("Programmes");
    if (!saved) {
      return res.json({
        success: false,
        message: "Try Again",
      });
    }
    return res.json({
      success: true,
      message: "File Saved Successfully",
      file:saved,
      user:pushedCode,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const id = req.user.id;
    console.log("--------------------------------------------------------------------",id);
    const allFiles = await User.findById(id).populate("Programmes");
    return res.json({
      success: true,
      message: "All Files Fetched Successfully",
      data: allFiles,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.body;
    await Program.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "File Deleted Successfully",
    });
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.getProgram = async(req,res) =>{
    try{
      const {programId} = req.body;
      const programData = await Program.findById(programId);
      if(!programData){
        return res.json({
          success:false,
          message:"Program Not Found",
        });
      }
      return res.json({
        success:true,
        message:"Program Found",
        data:programData,
      });
    }catch(e){
      return res.json({
        success:false,
        message:e.message,
      });
    }
}
