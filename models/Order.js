const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
            },
        }
    ],
    total: {
        type: Number,
    },
    shippingAddress: {
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zipcode: {
            type: String,
        }
    },
    status: {
        type: String,
        default: 'Pending'
    }
    // createdAt:{
    //     type:Date,
    //     default:Date.now
    // }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);