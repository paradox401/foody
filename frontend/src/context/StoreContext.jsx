import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { totalmem } from 'os';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(""); // Store userId in state
  const [coordinates, setCoordinates] = useState(null);
  const [food_list, setFoodList] = useState([]);

  const clearCart = () => {
    setCartItems({});
  };
  const decodeJWT = (token) => {
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
  };

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item] ;
      }
    }
    return totalAmount;
  };
  const getTotalCartAmountWithDP = ()=> {
    let finalAmount = getTotalCartAmount;
    let totalItem = 0;
    for (const item in cartItems)
    {
      totalItem += cartItems[item];
    }
    if (totalItem > 0){
      if (Object.keys(cartItems).length > 0){
        finalAmount = getTotalCartAmount() + 100;
      }
    }
    else{
      finalAmount = 0;
    }
      return finalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        const savedToken = localStorage.getItem("token");
        setToken(savedToken);

        // Decode user ID from the token and set it
        const decoded = decodeJWT(savedToken);
        setUserId(decoded.id);

        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartAmountWithDP,
    clearCart,
    url,
    token,
    userId, // Provide userId in the context
    setToken,
    coordinates,           // Expose coordinates to other components
    setCoordinates 
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
