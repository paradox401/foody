import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    user: {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
    },
    items: [
        {
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Food',
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
