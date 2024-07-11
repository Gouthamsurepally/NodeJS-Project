const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    address:[
        {   city:String,
            state:String,
            zipcode:String
        }
    ]
});

module.exports=mongoose.model('User',userSchema);