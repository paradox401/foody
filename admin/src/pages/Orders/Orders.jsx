import React, { useEffect, useState } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderList = ({ url }) => {
    const [orders, setOrders] = useState([]); // Ensure it's an empty array

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/orders/list`);
            console.log("Fetched orders:", response.data); // Log response for debugging

            if (response.data.success) {
                setOrders(response.data.data); // Ensure this path is correct
            } else {
                toast.error("Failed to fetch orders");
            }
        } catch (error) {
            toast.error("Error fetching orders");
            console.error("Fetch orders error:", error); // Log error for debugging
        }
    };

    // Mark order as complete
    const handleCompleteOrder = async (_id) => {
        try {
            const response = await axios.put(`${url}/api/orders/complete/${_id}`);

            if (response.data.success) {
                toast.success(response.data.message);
                fetchOrders(); // Refresh the order list
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error completing the order");
            console.error("Complete order error:", error); // Log error for debugging
        }
    };

    // Remove order
    const handleRemoveOrder = async (_id) => {
        try {
            const response = await axios.delete(`${url}/api/orders/remove/${_id}`);

            if (response.data.success) {
                toast.success(response.data.message);
                fetchOrders(); // Refresh the order list
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error removing the order");
            console.error("Remove order error:", error); // Log error for debugging
        }
    };

    useEffect(() => {
        fetchOrders(); // Fetch orders when the component mounts

        // Set up interval to fetch orders every 10 seconds (10000 ms)
        const intervalId = setInterval(() => {
            fetchOrders();
        }, 10000);

        // Cleanup function to clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run effect only once on mount

    return (
        <div className='order-list add flex-col'>
            <p>Order List</p>
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
                {Array.isArray(orders) && orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order._id} className="order-table-format">
                            <p>{order.user.name}</p>
                            <p>{order.user.address}</p>
                            <p>{order.user.phone}</p>
                            <div>
                                {order.items.map((item, i) => (
                                    <p key={i}>
                                        {item.foodName} - Quantity: {item.quantity}
                                    </p>
                                ))}
                            </div>
                            <p>Rs {order.totalAmount}</p>
                            <p>{new Date(order.createdAt).toLocaleString()}</p>
                            <div className='button'>
                                <button onClick={() => handleCompleteOrder(order._id)}>Complete</button>
                                <button onClick={() => handleRemoveOrder(order._id)}>Remove</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No orders available.</p>
                )}
            </div>
        </div>
    );
};

export default OrderList;
