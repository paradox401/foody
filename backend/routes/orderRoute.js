import express from "express";
import authMiddleware from "../middleware/auth.js"; // If you need it for the route
import { createOrder } from "../controllers/orderController.js";

const orderRouter = express.Router(); // Define the router

// Use orderRouter instead of router
orderRouter.post('/', createOrder); // Optional: add authMiddleware if needed

export default orderRouter; // Export the correct router
