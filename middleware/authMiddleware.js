const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');

dotenv.config();

const secretKey=process.env.SECRET_KEY;

const verifyUser = (req,res,next)=>{
    console.log('Headers:', req.headers);
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        console.log("token:",token);

        jwt.verify(token,secretKey,(err,user)=>{
            if(err){
              return  res.status(403).json({error:'Token is not valid'});
            };
            req.user=user;
            next();
        });
    } else{
        res.status(401).json({message:"you are not authenticated"});
    }
};

module.exports = { verifyUser };