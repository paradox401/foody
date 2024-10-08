import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './UserProfile.css'; // Import the CSS file for styling

const UserProfile = () => {
  const { userId, token, userData, setUserData } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
        if (!userId) {
          setLoading(false);
          return; // Exit early if userId is not available
        }
        try {
          const response = await axios.get(`http://localhost:4000/api/user/${userId}`, {
            headers: { token },
          });
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          console.error('Error response:', error.response); // Log full error response
          const errorMessage = error.response?.data?.message || 'Failed to load user data. Please try again.';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      
    fetchUserData();
  }, [userId, token, setUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/user/${userId}`, userData, {
        headers: { token },
      });
      // Optionally show a success message after successful update
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update user data. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const { name = '', email = '' } = userData || {};

  return (
    <div className="user-profile-container">
      <h2 className="user-profile-header">User Profile</h2>
      <form className="user-profile-form" onSubmit={handleSubmit}>
        <input
          className="user-profile-input"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          className="user-profile-input"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
        />
        {/* Phone number field commented out for now */}
        {/* <input
          className="user-profile-input"
          type="tel"
          name="phone"
          value={phone}
          onChange={handleChange}
          placeholder="Phone"
        /> */}
        <button className="user-profile-button" type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default UserProfile;
