import React, { useEffect, useState } from 'react';
import './Orders.css'; // Ensure your CSS is set up for styling
import axios from 'axios';
import { toast } from 'react-toastify'; // Import react-toastify

const OrderList = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // Function to fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/orders/list`);
      
      if (response.data.success) {
        // Update the orders state with the fetched data
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders"); // Show an error message if unsuccessful
      }
    } catch (error) {
      toast.error("Error fetching orders"); // Handle errors in the API call
    }
  };

  // useEffect to fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

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
        </div>
        {orders.map((order, index) => {
          return (
            <div key={index} className="order-table-format">
              <p>{order.user.name}</p>
              <p>{order.user.address}</p>
              <p>{order.user.phone}</p>
              <div>
                {order.items.map((item, i) => (
                  <p key={i}>
                   Food Name:{item.foodName} - Food ID: {item.foodId} - Quantity: {item.quantity}
                  </p>
                ))}
              </div>
              <p>Rs {order.totalAmount}</p>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderList;
