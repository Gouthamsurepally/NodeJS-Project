const jwt=require('jsonwebtoken');
const users=require('../models/User');
const dotenv= require('dotenv');
const bcrypt=require('bcrypt');


dotenv.config();

const secretKey = process.env.SECRET_KEY;


const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'email missing' });
        }

        const existingUser = await users.findOne({ email });       // checks if username already existed
        if (existingUser) {
            return res.status(400).json({ message: 'email is already existed' });
        }

        // const hashedPassword = await bcrypt.hash(password,10);
        const user = new users({ firstName, lastName, email });
        await user.save();
        res.status(201).json({ message: 'user created successfully', data: user });
    }
    catch (error) {
         res.status(500).json({ message: error.message, error })
    }
};

const loginUser =async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email){
            return res.status(400).json({message:"email required"});
        }
        const user = await users.findOne({email});
        if(!user){
            return res.status(401).json({message:'user not found'});
        }

        const isPasswordValid= await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
         return  res.status(401).json({message:'inavlid password'});
        }

        const accessToken = jwt.sign(
            {id:user._id, email:user.email},
            secretKey ,
            {expiresIn:'1h'});

            res.status(201).json({email:user.email,accessToken});

    } 
    catch(error){
        res.status(500).json({message:error.message,error});
    }
}

module.exports={loginUser,registerUser};