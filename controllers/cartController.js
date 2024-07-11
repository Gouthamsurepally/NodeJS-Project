const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');


const addToCart = async (req,res)=>{
    
    try{
        const {productId,quantity}=req.body;
        const userId=req.user.id;

        let cart= await Cart.findOne({user:userId,isDeleted:false});    // isDeleted:false
        if(!cart){
            cart = new Cart({user:userId,items:[]});
        }

        const product= await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:'product not found'});
        }
        const cartItemIndex= await cart.items.findIndex(item=>item.product.toString() === productId);

        if(cartItemIndex > -1){
            cart.items[cartItemIndex].quantity += quantity;

        } else{
            cart.items.push({product:productId,quantity});
        }

        await cart.save();

        res.status(201).json({message:'product added to cart', data:cart});
    }
    catch(error){
        res.status(500).json({message:error.message,error});
    }
};

// const getCart= async(req,res)=>{
//     try{
//         const userId= req.user.id;
//         const cart = await Cart.findOne({user:userId}).populate({
//             path:'items.product',       // populate the product field in the items array
//             model:'Product'             // specify the model to popullate from
//         });
//         if(!cart){
//             return res.status(404).json({message:'Cart not found'});
//         }

//         res.status(200).json(cart);
//     }
//     catch(error){
//         res.status(500).json({message:error.message,error});
//     }
// };


const getCart = async (req,res)=>{
    try{
        const userId = req.user.id;

        const cart = await Cart.aggregate([
            {
                $match:{user:new mongoose.Types.ObjectId(userId),isDeleted:false}  
            },
            {
                $unwind:'$items'
            },
            {
                $lookup:{
                    from:'products',                  // name of the collection to join
                    localField:'items.product',      // the field from the input documents
                    foreignField:'_id',             // the field from the document of the "from "collection
                    as: 'productDetails'           // the name of the new array field to add to the input documents
                }
            },
           
            {
                $unwind:"$productDetails"
            },
            {
                $group:{
                    _id:"$_id",
                    user:{$first:"$user"},
                    items:{
                        $push:{
                            product:"$items.product",
                            quantity:"$items.quantity",
                            productDetails:{
                                _id:"$productDetails._id",
                                name:"$productDetails.name",
                                price:"$productDetails.price"
                            }
                        }
                        
                    }
                }
            }
        ]);

        console.log('cart aggregation result:',cart);

        if(!cart || cart.length === 0){
            return res.status(400).json({message:"cart not found"});
        }

        res.status(200).json(cart[0]);

    }
    catch(error){
        res.status(500).json({message:error.message,error});
    }
};

const deleteCart = async (req,res)=>{
    try{
        const cart = await Cart.findOneAndUpdate(
            { user:req.user.id,isDeleted:false},
            {isDeleted:true},
            {new:true}
        )

        if(!cart){
          return  res.status(404).json({message:'Cart not found'});
        };

        res.status(200).json({message:'Cart deleted successfully',data:cart});

    }
    catch(error){
        res.status(500).json({message:error.message,error});
    }
}

module.exports={ addToCart,getCart,deleteCart};