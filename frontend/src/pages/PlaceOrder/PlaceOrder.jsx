import React, { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

const PlaceOrder = () => {
  const { cartItems, food_list, getTotalCartAmount,getTotalCartAmountWithDP, clearCart, url, userId, coordinates } = useContext(StoreContext); // Fetch coordinates from context
  const [userData, setUserData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Prefill address field with coordinates if available
  useEffect(() => {
    if (coordinates) {
      setUserData((prevData) => ({
        ...prevData,
        address: `Lat: ${coordinates.latitude}, Lon: ${coordinates.longitude}` // Set coordinates as address
      }));
    }
  }, [coordinates]);

  // Handle input changes for user data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handlePlaceOrder = async () => {
    console.log("handlePlaceOrder called"); // Confirm the function is triggered
  
    if (!userData.name || !userData.address || !userData.phone) {
      alert("Please fill in all the fields!");
      return;
    }
  
    const orderDetails = {
      userId: userId,
      user: {
        name: userData.name,
        address: userData.address,
        phone: userData.phone,
      },
      items: food_list
        .filter(item => cartItems[item._id] > 0)
        .map(item => ({
          foodName: item.name,
          foodId: item._id,
          quantity: cartItems[item._id],
        })),
      totalAmount: getTotalCartAmountWithDP(),
    };
  
    console.log("Order Details being sent:", orderDetails); // Log the order details
  
    try {
      const response = await axios.post('http://localhost:4000/api/orders', orderDetails);
      setIsModalOpen(true);
      clearCart();
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response) {
        console.error('Response data:', error.response.data); // Log response data for more details
        console.error('Response status:', error.response.status); // Log response status
      } else {
        console.error('Error message:', error.message); // Log any other error messages
      }
      alert("There was an error placing your order. Please try again.");
    }
  };
  
  

  return (
    <div className="place-order-container">
      <div className="order-summary">
        <h3>Order Summary</h3>
        {food_list.map(item => (
          cartItems[item._id] > 0 && (
            <div key={item._id} className="order-item">
              <img src={url + "/images/" + item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>Quantity: {cartItems[item._id]}</p>
              <p>Price: Rs{item.price * cartItems[item._id]}</p>
            </div>
          )
        ))}
        <hr />
        <h4>Total Amount: Rs{getTotalCartAmountWithDP()}</h4>
      </div>

      <div className="user-details">
        <h3>Your Details</h3>
        <label>
          Name:
          <input type="text" name="name" value={userData.name} onChange={handleInputChange} required placeholder='Please enter you valid name' />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={userData.address} onChange={handleInputChange} required placeholder='please enter your valid address' />
        </label>
        <label>
          Phone:
          <input type="text" name="phone" value={userData.phone} onChange={handleInputChange} required placeholder='please enter your valid phone number' />
        </label>
      </div>

      <button className="place-order-button" onClick={handlePlaceOrder}>Place Order</button>

      {/* Modal for order confirmation */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} ariaHideApp={false}>
  <h2 className="modal-title">Your Order Has Been Placed Successfully!</h2>
  <p className="modal-message">You will be redirected to the home page shortly.</p>
  <button className="modal-close-button" onClick={() => setIsModalOpen(false)}>Close</button>
</Modal>

    </div>
  );
};

export default PlaceOrder;
