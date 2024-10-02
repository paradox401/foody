import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

// Existing method to create an order
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

// New method to fetch the list of orders
const getOrderList = async (req, res) => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find();

        // Check for empty orders
        if (orders.length === 0) {
            return res.status(200).json({ success: true, message: 'No orders found' });
        }

        // Map the orders to the desired structure
        const formattedOrders = orders.map(order => ({
            user: {
                name: order.user.name,
                address: order.user.address,
                phone: order.user.phone,
            },
            items: order.items.map(item => ({
                foodName: item.foodName,
                foodId: item.foodId, // Assuming foodId is stored directly
                quantity: item.quantity,
            })),
            totalAmount: order.totalAmount,
            createdAt: new Date(order.createdAt).toLocaleString(), // Format the date
        }));

        res.status(200).json({
            success: true,
            data: formattedOrders, // Send the formatted order data
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching orders",
        });
    }
};

export { createOrder, getOrderList };
