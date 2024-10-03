import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import CompletedOrder from '../models/completedOrderModel.js';

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
        console.error("Error creating order:", error.message);
        res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
    }
};

// Method to fetch the list of orders
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
            _id: order._id, // Ensure to include the order ID
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
        console.error("Error fetching orders:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while fetching orders",
        });
    }
};

// Method to complete an order
const completeOrder = async (req, res) => {
    const { id } = req.params; // Using 'id' from the URL parameters

    try {
        const order = await Order.findById(id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Create a new completed order using the completedOrder model
        const completedOrder = new CompletedOrder({
            userId: order.userId,
            user: order.user,
            items: order.items,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
        });
        
        await completedOrder.save(); // Save the completed order to the database

        await Order.findByIdAndDelete(id); // Optionally delete the original order

        res.status(200).json({ success: true, message: 'Order completed and moved to Completed Orders' });
    } catch (error) {
        console.error("Error completing order:", error.message);
        res.status(500).json({ success: false, message: 'Server error while completing order' });
    }
};

// Method to remove an order
const removeOrder = async (req, res) => {
    const { id } = req.params; // Using 'id' from the URL parameters

    try {
        if (!id) {
            return res.status(400).json({ success: false, message: 'Order ID is required' });
        }

        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: 'Order removed successfully' });
    } catch (error) {
        console.error('Error removing order:', error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Method to get completed orders
const getCompletedOrders = async (req, res) => {
    try {
        // Fetch all completed orders from the database
        const completedOrders = await CompletedOrder.find();

        // Check for empty completed orders
        if (completedOrders.length === 0) {
            return res.status(200).json({ success: true, message: 'No completed orders found' });
        }

        // Map the completed orders to the desired structure
        const formattedCompletedOrders = completedOrders.map(order => ({
            _id: order._id, // Ensure to include the completed order ID
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
            data: formattedCompletedOrders, // Send the formatted completed order data
        });
    } catch (error) {
        console.error("Error fetching completed orders:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while fetching completed orders",
        });
    }
};

// Method to remove a completed order
const removeCompletedOrder = async (req, res) => {
    const { id } = req.params; // Using 'id' from the URL parameters

    try {
        if (!id) {
            return res.status(400).json({ success: false, message: 'Completed order ID is required' });
        }

        const deletedCompletedOrder = await CompletedOrder.findByIdAndDelete(id);

        if (!deletedCompletedOrder) {
            return res.status(404).json({ success: false, message: 'Completed order not found' });
        }

        res.status(200).json({ success: true, message: 'Completed order removed successfully' });
    } catch (error) {
        console.error('Error removing completed order:', error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export { createOrder, getOrderList, completeOrder, removeOrder, getCompletedOrders, removeCompletedOrder };
