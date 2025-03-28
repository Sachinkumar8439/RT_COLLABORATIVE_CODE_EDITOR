const Program = require("../Modes/Programmes");

exports.saveCode = async (req, res) => {
  try {
    const { code = "", extension, id, fileName } = req.body;

    console.log(
      "hello i am under saveCode-------------------------------------------",
      code,
      extension,
      id,
      fileName
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
    if (!saved) {
      return res.json({
        success: false,
        message: "Try Again",
      });
    }
    return res.json({
      success: true,
      message: "File Saved Successfully",
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
    const allFiles = await Program.find();
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

// exports.createFile = async() =>{
//     const {fileName,extension} = req.body;
//     const code = "";
//     const newFile = new Program
// }
