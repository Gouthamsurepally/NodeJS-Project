

const fs = require('fs');
const path=require('path');
const filePath=path.join(__dirname,'..', 'public', 'sample.json');


// using callbacks 

const getDataUsingCallback=(req,res)=>{
    fs.readFile(filePath,'utf8',(error,data)=>{
        if(error){
            return res.status(500).send({error:'error in reading file'});
        }
        res.send(JSON.parse(data));
    });
};



// using promise

const readFilePromise=(file)=>{
    return new Promise((resolve,reject)=>{
        fs.readFile(file,'utf8',(error,data)=>{
            if(error){
                reject(error);
            }
            else{
                resolve(data);
            }
        });
    });
};

const getDataUsingPromise = (req,res)=>{
    readFilePromise(filePath)
    .then(data=>res.send(JSON.parse(data)))
    .catch(error=>res.status(500).send({error:'error in reading file'}))
};


// using async await


const getDataUsingAsync = async(req,res)=>{
   try{
    const fs= require('fs').promises;
    const data = await fs.readFile(filePath,'utf8');
    res.send(JSON.parse(data));
   } 
   catch(error){
    res.status(500).send({error:'error in reading file'});
   }
};

module.exports={getDataUsingCallback,getDataUsingPromise,getDataUsingAsync}