const mongoose = require("mongoose");
const Program = require("./Programmes");

const userSchema = new mongoose.Schema({

    UserName:{
        type:String,
        required:true,
        unique:true,
    },

    Name:{
        type:String,
        required:true,
    },

    Email:{
        type:String,
    },


    Programmes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
    }],

    PhoneNumber:{
        type:String,
    },

    Password:{
        type:String,
        required:true,
    },

});

const user = mongoose.model("User",userSchema);
module.exports = user;