const mongoose  = require("mongoose");


const contactSchema = new mongoose.Schema({
    email:{
        type:String
    },
    phone:{
        type:String
    }
})

module.exports = mongoose.model("Contact", contactSchema)