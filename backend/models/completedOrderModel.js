import mongoose from 'mongoose';

const completedOrderSchema = new mongoose.Schema({
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
            foodName: {
                type: String, 
                required: true,
            },
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

const CompletedOrder = mongoose.model('CompletedOrder', completedOrderSchema);
export default CompletedOrder; // Ensure this export is present
