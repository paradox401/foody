import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img id='logo' src={assets.logo} alt="" />
            <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque ipsa cum harum est non mollitia, deserunt laudantium dolorem, quaerat dignissimos omnis asperiores odit eligendi sapiente, enim laboriosam impedit tenetur iusto delectus earum expedita autem quibusdam reprehenderit. Illum consectetur amet perspiciatis veniam distinctio ratione nobis, architecto omnis doloribus quo quasi saepe.
            </p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
              <li>Home</li>
              <li>About Us</li>
              <li>Delivery</li>
              <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+977-9800000000</li>
            <li>contact@foody.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className='footer-copyright'>Copyright 2024 © Foody.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
