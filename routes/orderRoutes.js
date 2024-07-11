const express= require('express');
const orderController = require('../controllers/orderController');
const{verifyUser}= require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-order',verifyUser,orderController.createOrder);
router.get('/get-orders',verifyUser,orderController.getOrders);

module.exports= router;