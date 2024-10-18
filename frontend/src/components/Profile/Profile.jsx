import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // Corrected import

export default function Profile() {
    const [userProfile, setUserProfile] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            // Check if the token exists
            if (!token) {
                handleLogout();
                return;
            }

            try {
                // Decode the token to check its expiration
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Current time in seconds

                if (decodedToken.exp < currentTime) {
                    // Token has expired, auto-logout the user
                    handleLogout();
                } else {
                    // Fetch the user profile if the token is valid
                    const response = await axios.get(`https://wanderlust-y0i4.onrender.com/api/users/userProfile/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserProfile(response.data);

                    // Optionally set a timeout to auto-logout when the token expires
                    const timeUntilExpiry = decodedToken.exp * 1000 - Date.now();
                    setTimeout(() => {
                        handleLogout();
                    }, timeUntilExpiry);
                }
            } catch (err) {
                console.error('Fetching error:', err); // Log detailed error
                setError(err.response?.data?.message || 'Error fetching profile');
            }
        };
        fetchUserProfile();
    }, []); // Empty dependency array, no need for navigate

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/auth');
    };

    const handleDeleteProfile = async () => {
        const userId = localStorage.getItem('userId');
        if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            try {
                await axios.delete(`https://wanderlust-y0i4.onrender.com/api/users/deleteProfile/${userId}`);
                alert("Profile deleted successfully.");
                handleLogout();
            } catch (err) {
                console.error('Deletion error:', err); // Log detailed error
                setError('Error deleting profile');
            }
        }
    };

    return (
        <div className="flex justify-end p-4">
            <div className="border p-6 rounded shadow">
                {/* Profile Information */}
                <div className="mt-4 space-y-3">
                    {userProfile.username ? (
                        <>
                            <p className="text-lg">
                                <span className="font-bold">Username: </span>
                                <span>{userProfile.username}</span>
                            </p>
                            <p className="text-lg">
                                <span className="font-bold">Email: </span>
                                <span>{userProfile.email}</span>
                            </p>
                        </>
                    ) : (
                        <p>Loading profile...</p>
                    )}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="mt-6 px-4 py-2 m-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>

                {/* Delete Profile Button */}
                <button
                    onClick={handleDeleteProfile}
                    className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Delete Profile
                </button>

                {/* Error Message */}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
}
