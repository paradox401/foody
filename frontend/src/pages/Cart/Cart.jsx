import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import OpenStreetMap from '../../components/OpenStreetMap/OpenStreetMap'; // Import your OpenStreetMap component
import LoginPopup from '../../components/LoginPopup/LoginPopup';


const Cart = () => {
  const { cartItems, token,food_list, removeFromCart, getTotalCartAmount, getTotalCartAmountWithDP, url, setCoordinates } = useContext(StoreContext);
  const navigate = useNavigate();
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const handleLocationSelect = (location) => {
    const latitude = location[1]; // Assuming the second value is latitude
    const longitude = location[0]; // Assuming the first value is longitude

    setSelectedLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
    setCoordinates({ latitude, longitude }); // Correctly setting the coordinates
    console.log("Selected Coordinates:", { latitude, longitude }); // Log selected coordinates

  };
  const handleProceedToCheckout = () => {
    const hasItemsInCart = Object.keys(cartItems).length > 0; // Check if cart has items
    
    if (hasItemsInCart) {
      console.log(token)
      if (token) {
        navigate('/order'); // If logged in, navigate to order page
      } else {
        setShowLogin(true); // If not logged in, show login popup
      }
    } else {
      alert('Your cart is empty. Please add items to proceed.');
    }
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>Rs{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>Rs{item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>X</p>
                </div>
                <hr />
              </div>
            );
          }
          return null; // Ensure the function returns something in all cases
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>RS{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>100</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>RS {getTotalCartAmountWithDP()}</b>
            </div>
            <div className="cart-location">
              <p><b>Selected Location:</b> {selectedLocation || 'Not selected'}</p>
            </div>
          </div>
          <button onClick={() => setShowLocationPopup(true)}>Select Location</button>
          <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
          
        </div>
        
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='Promo Code' />
              <button>Apply</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for selecting location */}
      <div className='cart-map'>
        <Modal isOpen={showLocationPopup} onRequestClose={() => setShowLocationPopup(false)} ariaHideApp={false}>
          <h2>Select Your Location</h2>
          <OpenStreetMap center={[0, 0]} onLocationSelect={handleLocationSelect} />
          <button className='close-button' onClick={() => setShowLocationPopup(false)}>Close</button>
        </Modal>
      </div>
        <div className="cart-login">
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
        </div>

    </div>
  );
};

export default Cart;
