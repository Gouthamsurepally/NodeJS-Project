const User =require('../models/User');
const bcrypt = require('bcrypt');

const createUser = async(req,res)=>{
    try{
        const {firstName,lastName,email,password,isDeleted}=req.body;
        if(!email || !password){
            return res.status(400).json({message:'Email and password required'})
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'email is already in use'});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({firstName,lastName,email,password:hashedPassword,isDeleted});
        await user.save();
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({message:'server error',error});
    }
};

const deleteUser= async(req,res)=>{
    try{
        if(req.user._id===req.params.userId){
            const user = await User.findByIdAndDelete(req.params.userId);
            if(!user){
                return res.status(404).json({message:'User not found'});
            }
            res.status(200).json({message:'user deleted successfully'});
        } else{
            res.status(403).json({message:'you are not allowed to delete this user'})
        }
    }
    catch(error){
        res.status(500).json({message:'server error',error});
    }
};

const getUsers= async(req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({message:'server error',error});
    }
};

const setPassword= async (req,res)=>{
    try{
        const {email,password,confirmPassword}= req.body;
        if(!email || !password || !confirmPassword){
            return res.status(400).json({message:'email,password,confirm password required'})
        }

        if(password !== confirmPassword){
            return res.status(400).json({message:'password mismatched'});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:'user not found'});
        }

        const hashedPassword= await bcrypt.hash(password,10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({message:'password created successfully'})
    }
    catch(error){
        res.status(500).json({message:error.message,error});

    }
};

const updateUserProfile = async (req,res)=>{
    try{

        const {id}= req.user;
        // const updateData = req.body;
        if(!id){
            return res.status(400).json({message:"id required"});
        }

        const updatedUser= await User.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});
        


        if(!updatedUser){
            return res.status(404).json({message:'User not found'});
        }

        res.status(200).json({message:'User details upadated successfully',data:updatedUser});

    }
    catch(error){
        res.status(500).json({message:error.message,error});
    }
}

module.exports = {createUser,deleteUser,getUsers,setPassword,updateUserProfile };