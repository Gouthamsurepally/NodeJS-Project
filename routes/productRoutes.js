const express= require('express');
const productController=require('../controllers/productController');
const {verifyUser}=require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/add-product',verifyUser,upload, productController.addProduct);
router.get('/all-products',productController.getProducts);
router.get('/:id',productController.getProductById);
router.put('/update-product/:id',verifyUser,upload,productController.updateProduct);

module.exports=router;
