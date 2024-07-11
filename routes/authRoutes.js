const express=require('express');
const {loginUser, registerUser}=require('../controllers/authController');

const router=express.Router();

router.post('/register',registerUser);       // For User Registration

router.post('/login',loginUser);            // For User Login

module.exports = router;