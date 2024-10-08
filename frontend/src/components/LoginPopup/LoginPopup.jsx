import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(""); // Error state

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true

        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        try {
            const response = await axios.post(newUrl, data);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
                setError(""); // Clear any previous errors
            } else {
                setError(response.data.message); // Set error message from response
            }
        } catch (error) {
            console.error("Error during login or registration:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? null : (
                        <input
                            name='name'
                            onChange={onChangeHandler}
                            value={data.name}
                            type='text'
                            placeholder='Your Name'
                            required
                        />
                    )}
                    <input
                        name='email'
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder='Your Email'
                        required
                    />
                    <input
                        name='password'
                        onChange={onChangeHandler}
                        value={data.password}
                        type="password"
                        placeholder='Password'
                        required
                    />
                </div>
                <button type='submit' disabled={loading}>
                    {loading ? "Loading..." : (currState === "Sign Up" ? "Create Account" : "Login")}
                </button>
                {error && <p className="error-message">{error}</p>} {/* Show error message if exists */}
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>
                {currState === "Login" ? (
                    <p>Create a new account?<span onClick={() => setCurrState("Sign Up")}> Click here</span></p>
                ) : (
                    <p>Already have an account?<span onClick={() => setCurrState("Login")}> Login here</span></p>
                )}
            </form>
        </div>
    );
}

export default LoginPopup;
