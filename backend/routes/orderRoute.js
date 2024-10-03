import express from "express";
// Optional: import authMiddleware if you need authentication
// import authMiddleware from "../middleware/auth.js"; 
import { createOrder, getOrderList, completeOrder, removeOrder, getCompletedOrders, removeCompletedOrder } from "../controllers/orderController.js"; 

const orderRouter = express.Router(); // Define the router

// Route to create a new order
orderRouter.post('/', createOrder); // Optional: add authMiddleware if needed

// Route to fetch the list of orders
orderRouter.get('/list', getOrderList); // Define the GET route for fetching orders

// Route to complete an order
orderRouter.put('/complete/:id', completeOrder); // Route to complete an order

// Route to remove an order
orderRouter.delete('/remove/:id', removeOrder);   // Route to remove an order

// Route to fetch the list of completed orders
orderRouter.get('/completed-orders', getCompletedOrders); // Define the GET route for completed orders

orderRouter.delete('/completed-orders/remove/:id', removeCompletedOrder);



export default orderRouter; // Export the router
