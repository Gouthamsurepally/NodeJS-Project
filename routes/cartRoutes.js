const express= require('express');
const cartController = require('../controllers/cartController');
const {verifyUser}= require('../middleware/authMiddleware');

const router=express.Router();

router.post('/add-cart',verifyUser,cartController.addToCart);
router.get('/get-cart',verifyUser,cartController.getCart);
router.delete('/delete-cart',verifyUser,cartController.deleteCart);

module.exports=router;