import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
    const [userProfile, setUserProfile] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            const userId = localStorage.getItem('userId');
            
            if (!userId) {
                setError("User ID not found");
                setLoading(false);
                return;
            }

            try {
                // Fetch user profile
                const response = await axios.get(`https://wanderlust-y0i4.onrender.com/api/users/userProfile/${userId}`);
                setUserProfile(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching profile');
                setLoading(false);
                console.error('Fetching error:', err);
            }
        };

        fetchUserProfile();
    }, []);

    // Handle logout and clear local storage
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/auth');
    };

    // Handle profile deletion
    const handleDeleteProfile = async () => {
        const userId = localStorage.getItem('userId');
        if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            try {
                await axios.delete(`https://wanderlust-y0i4.onrender.com/api/users/deleteProfile/${userId}`);
                alert("Profile deleted successfully.");
                handleLogout();
            } catch (err) {
                setError('Error deleting profile');
                console.error('Deletion error:', err);
            }
        }
    };

    return (
        <div className="flex justify-center p-4">
            <div className="border p-6 rounded shadow-lg w-full max-w-lg">
                {/* Conditional Rendering based on loading or error */}
                {loading ? (
                    <p>Loading profile...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <>
                        {/* Profile Information */}
                        <div className="mt-4 space-y-3">
                            <p className="text-lg">
                                <span className="font-bold">Username: </span>
                                <span>{userProfile.username}</span>
                            </p>
                            <p className="text-lg">
                                <span className="font-bold">Email: </span>
                                <span>{userProfile.email}</span>
                            </p>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
                    </>
                )}
            </div>
        </div>
    );
}
