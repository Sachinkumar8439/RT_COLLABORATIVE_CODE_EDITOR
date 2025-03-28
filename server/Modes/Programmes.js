const mongoose = require("mongoose");
const User = require("../Modes/User");

const programmeSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },

  extension: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    default: "",
  },

  userEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const program = mongoose.model("Program", programmeSchema);
module.exports = program;
