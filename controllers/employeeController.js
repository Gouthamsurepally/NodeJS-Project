const Employee = require('../models/Employee');

const createEmployee = async (req,res)=>{
    try{
        console.log("hello");
        const {name,email,phone,city} = req.body ;

        const employee = new Employee({
            name,
            email,
            phone,
            city
        })
        await employee.save()
        res.status(201).json(employee);
    } catch(error){
        console.log("there is an error:",error)
        res.status(500).json({message:'server error'});

    }
};

const getEmployees= async (req,res)=>{
    try{
        const employees = await Employee.find({isDeleted:false});
        res.status(200).json(employees);

    }
    catch(error){
        console.error("there is an error:",error);
        res.status(500).json({message:'server error'});
    }
};

const singleEmployee= async (req,res)=>{
    try{
        const employee= await Employee.findById({_id:req.params.id,isDeleted:false});

        if(!employee){
            return res.status(404).json({message:'employee not found'})
        }

        res.status(200).json(employee);
    }
    catch(error){
        console.error("there is an error:",error);
        res.status(500).json({message:'server error'});
    }
};

const updateEmployee= async(req,res)=>{
    try{
        const {name,email,phone,city} = req.body;
        const myEmployee = await Employee.findByIdAndUpdate(req.params.id,{name,email,phone,city})

        if(!myEmployee){
            return res.status(404).json({message:"employee not found"});
        }
        res.status(200).json(myEmployee);
    }
    catch(error){
        console.error('there is an error:',error);
        res.status(500).json({message:'server error'});
    }
};


// permanent delete

// const deleteEmployee = async(req,res)=>{
//     try{
//         const deleteEmp= await Employee.findByIdAndDelete(req.params.id);
//         res.status(204).send()
//     } catch(error){
//         console.log("there is an error:",error);
//         res.status(500).json({message:'server error'})
//     }
// };
const deleteEmployee = async (req,res)=>{
    try{
        const deleteEmp=await  Employee.findByIdAndUpdate(req.params.id,{isDeleted:true});
        console.log(deleteEmp);
        if(!deleteEmp){
            return res.status(404).json({message:'employee not found'});
        }
        res.status(204).send();
    } catch(error){
        console.log('there is an error:',error);
        res.status(500).json({message:'server error'});
    }
};

module.exports = {getEmployees,singleEmployee ,createEmployee,updateEmployee,deleteEmployee};