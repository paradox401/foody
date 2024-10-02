import express from "express";
import authMiddleware from "../middleware/auth.js"; // Optional: use if you need authentication
import { createOrder, getOrderList } from "../controllers/orderController.js"; // Import both methods

const orderRouter = express.Router(); // Define the router

// Route to create a new order
orderRouter.post('/', createOrder); // Optional: add authMiddleware if needed

// Route to fetch the list of orders
orderRouter.get('/list', getOrderList); // Added this line to define the GET route for fetching orders

export default orderRouter; // Export the correct router
