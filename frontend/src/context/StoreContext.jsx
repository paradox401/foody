import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(""); // Store userId in state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  const [coordinates, setCoordinates] = useState(null);
  const [food_list, setFoodList] = useState([]);

  const clearCart = () => {
    setCartItems({});
  };

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1
    }));
    if (token) {
      await axios.post("http://localhost:4000/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1 < 1 ? undefined : prev[itemId] - 1
    }));
    if (token) {
      await axios.post("http://localhost:4000/api/cart/remove", { itemId }, { headers: { token } });
    }
  };

  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const itemInfo = food_list.find(product => product._id === itemId);
      return itemInfo ? total + itemInfo.price * cartItems[itemId] : total;
    }, 0);
  };

  const fetchFoodList = async () => {
    const response = await axios.get("http://localhost:4000/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post("http://localhost:4000/api/cart/get", {}, { headers: { token } });
    setCartItems(response.data.cartData);
  };

  const loadUserData = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/user/${userId}`, {
        headers: { token },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error loading user data:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        await fetchFoodList();
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
          const decoded = decodeJWT(savedToken);
          if (decoded && decoded.id) {
            setUserId(decoded.id);
            await loadCartData(savedToken);
            await loadUserData(decoded.id, savedToken); // Pass userId for loading user data
          } else {
            // Handle invalid token
            localStorage.removeItem("token");
            setToken("");
            setUserId("");
            setUserData({ name: '', email: '' });
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData();
  }, []); // Load data on initial mount

  useEffect(() => {
    // Load user data whenever the token changes
    if (token && userId) {
      loadUserData(userId, token);
    }
  }, [token, userId]); // Dependencies to re-fetch user data when token or userId changes

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
    token,
    userId,
    userData,
    setUserData,
    setToken,
    coordinates,
    setCoordinates,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
