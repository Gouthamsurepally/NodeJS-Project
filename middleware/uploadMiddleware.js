const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: './uploads/images',
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer ({
    storage:storage,
    limits:{fileSize:1000000},
    fileFilter:(req,file,cb)=>{
        checkFileType(file,cb);
    }
}).single('image');         // image is the name of the field in the form data


function checkFileType(file,cb){
//Allowed extensions
const fileTypes =/jpeg|jpg|png/;

// check extension
const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

//check mime type
const mimetype = fileTypes.test(file.mimetype);

if(mimetype&&extname){
    return cb(null,true);
} else{
    cb('Error: Images only!');
}
};

module.exports =upload;