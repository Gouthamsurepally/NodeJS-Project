const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

// const createOrder = async (req,res)=>{
//     try{
//         const userId = req.user.id;

//         // fetch users cart
//         const cart = await Cart.findOne({user:userId}).populate('items.product');
//         if(!cart){
//             return res.status(404).json({message:'Cart is empty'});
//         }

//         const items = cart.items.map(item=>({
//             product:item.product._id,
//             quantity:item.quantity
//         }));

//         let total = 0;

//         // caluculating the total price
//         for(let item of cart.items){
//             total += item.product.price * item.quantity;
//         }

//         const {city,state,zipcode} = req.body.shippingAddress;
//         if(!city){
//             return res.status(400).json({message:'city required'});
//         }

//         if(!state){
//             return res.status(400).json({message:'state required'});
//         }

//         if(!zipcode){
//             return res.status(400).json({message:'zipcode required'});
//         }

//         // create the order
//         const order = new Order({
//             user:userId,
//             items,
//             total,
//             shippingAddress:{
//                 city,state,zipcode
//             },
//             status:'pending'
//         });

//         await order.save();

//         //clear the users cart
//         cart.items = [];
//         await cart.save();

//         res.status(201).json({message:'Order placed successfuly',data:order});
//     }
//     catch(error){
//         res.status(500).json({message:error.message,error});
//     }
// }

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId),isDeleted:false } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'products'
                }
            },

            {
                $addFields: {
                    items: {
                        $map: {
                            input: '$items',
                            as: 'item',
                            in: {
                                product: { $arrayElemAt: ['$products', { $indexOfArray: ['$products._id', '$$item.product'] }] },
                                quantity: '$$item.quantity'
                            }
                        }
                    }
                }
            },

            {
                $addFields: {
                    total: {
                        $reduce: {
                            input: '$items',
                            initialValue: 0,
                            in: {
                                $add: [
                                    '$$value',
                                    { $multiply: ['$$this.product.price', '$$this.quantity'] }
                                ]
                            }
                        }
                    }
                }
            },


            {
                $project: {
                    products: 0   // Exclude the products array as its not needed anymore
                }
            }
        ]);
        console.log("cart", JSON.stringify(cart));
        if (!cart.length) {
            return res.status(404).json({ message: 'cart is empty' });
        }

        // const cartData = cart[0];
        // const items = cartData.items.map(item => ({
        //     product: item.product,
        //     quantity: item.quantity
        // }));

        // let total = 0;

        // for (let item of cartData.products) {
        //     for (let item2 of items) {
        //         total += item.price * item2.quantity;
        //     }

        // }
        // console.log("total", total);
        // console.log("item", items)
        // const { shippingAddress } = req.body;
        // if (!city) {
        //     return res.status(400).json({ message: 'city required' });
        // }
        // if (!state) {
        //     return res.status(400).json({ message: 'state required' });
        // }
        // if (!zipcode) {
        //     return res.status(400).json({ message: 'zipcode is required' })
        // }

        //create order

        const cartData = cart[0];
        const { total, items } = cartData;

        console.log("items after aggregation:", items);
        console.log("total after aggregation:", total);

        const { shippingAddress } = req.body;

        if (!items.length) {
            return res.status(400).json({ message: 'items are empty' });
        }
        // if (!city) {
        //     return res.status(400).json({ message: 'city required' });
        // }
        // if (!state) {
        //     return res.status(400).json({ message: 'state required' });
        // }
        // if (!zipcode) {
        //     return res.status(400).json({ message: 'zipcode is required' })
        // }

        const order = new Order({
            user: userId,
            items,
            total,
            shippingAddress,
            status: 'pending'
        });

        await order.save();

        //clear the users cart
        // cartData.items = [];
        await Cart.updateOne({ user: userId }, { $set: { items: [] } });

        res.status(200).json({ message: 'order placed successfully', data: order });
    }
    catch (error) {
        res.status(500).json({ message: error.message, error });
    }
}


const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).populate('items.product');

        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message, error });
    }
};

module.exports = { createOrder, getOrders };