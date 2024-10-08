import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

export const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    // Optional: Add confirmation dialog
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      setToken("");
      navigate("/foody/");
    }
  };

  return (
    <div className='navbar'>
      <Link to='/foody/'><img className='logo' src={assets.logo} alt="" /></Link>
      <ul className="navbar-menu">
        <Link to='/foody/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>HOME</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>MENU</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>MOBILE APP</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>CONTACT US</a>

        {/* Link to the user profile page */}
        {token && (
          <Link to='/profile' onClick={() => setMenu("profile")} className={menu === "profile" ? "active" : ""}>PROFILE</Link>
        )}
        
        {/* Add FAQ link here */}
        <Link to='/faq' onClick={() => setMenu("faq")} className={menu === "faq" ? "active" : ""}>FAQ</Link>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to='/foody/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar;
