const express=require('express');
const userController = require('../controllers/userController');
const {verifyUser}= require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create',userController.createUser);
router.get('/all',verifyUser,userController.getUsers);
router.delete('/delete/:userId',verifyUser,userController.deleteUser);

router.post('/set-password', userController.setPassword);
router.put('/update-profile',verifyUser,userController.updateUserProfile);

module.exports = router;