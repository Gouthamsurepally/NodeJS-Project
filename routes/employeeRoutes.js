const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const readFileController= require('../controllers/readFileController');



// get , post , put/patch , delete

router.post('/add-emp', employeeController.createEmployee);
router.get('/allemployees', employeeController.getEmployees);
router.get('/employee/:id', employeeController.singleEmployee);
router.put('/update/:id', employeeController.updateEmployee);
router.delete('/delete/:id',employeeController.deleteEmployee);


router.get('/callback',readFileController.getDataUsingCallback);
router.get('/promise',readFileController.getDataUsingPromise);
router.get('/async',readFileController.getDataUsingAsync);



module.exports = router ;
