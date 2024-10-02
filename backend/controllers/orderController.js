import Order from '../models/orderModel.js';
import User from '../models/userModel.js'; // Adjust the import path as needed

const createOrder = async (req, res) => {
    const { userId, user, items, totalAmount } = req.body;

    // Validate incoming request
    if (!userId || !user || !user.name || !user.address || !user.phone || !items || !items.length || !totalAmount) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        // Check if the user exists
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        // Create a new order
        const newOrder = new Order({
            userId,
            user,
            items,
            totalAmount,
        });

        await newOrder.save();
        res.status(201).json({ success: true, order: newOrder, message: 'Order placed successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
    }
};

export { createOrder };
