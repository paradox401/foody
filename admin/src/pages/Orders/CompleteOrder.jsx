import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CompleteOrder.css'; // Optional: Add styles for the page

const CompleteOrder = ({ url }) => {
    const [orders, setOrders] = useState([]); // Initialize as an empty array

    // Fetch the list of orders
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/complete`);
            if (response.data.success) {
                setOrders(response.data.data || []); // Ensure it's always an array
            } else {
                toast.error("Failed to fetch orders");
            }
        } catch (error) {
            toast.error("Error fetching orders");
        }
    };

    // Mark order as complete
    const handleCompleteOrder = async (id) => {
        try {
            const response = await axios.put(`${url}/api/orders/complete/${id}`);
            if (response.data.success) {
                toast.success(response.data.message);
                fetchOrders(); // Refresh the order list
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error completing the order");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className='complete-order'>
            <h1>Complete Orders</h1>
            <div className="order-table">
                <div className="order-table-format title">
                    <b>User</b>
                    <b>Address</b>
                    <b>Phone</b>
                    <b>Items</b>
                    <b>Total Amount</b>
                    <b>Order Date</b>
                    <b>Actions</b>
                </div>
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <div key={index} className="order-table-format">
                            <p>{order.user?.name || "N/A"}</p>
                            <p>{order.user?.address || "N/A"}</p>
                            <p>{order.user?.phone || "N/A"}</p>
                            <div>
                                {order.items?.length > 0 ? (
                                    order.items.map((item, i) => (
                                        <p key={i}>
                                            {item.foodName} - Quantity: {item.quantity}
                                        </p>
                                    ))
                                ) : (
                                    <p>No items</p>
                                )}
                            </div>
                            <p>Rs {order.totalAmount}</p>
                            <p>{new Date(order.createdAt).toLocaleString()}</p> {/* Format date */}
                            <div>
                                <button onClick={() => handleCompleteOrder(order._id)}>Complete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No orders found.</p> // Handle the case when no orders are available
                )}
            </div>
        </div>
    );
};

export default CompleteOrder;
