import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
    const [userProfile, setUserProfile] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const userId = localStorage.getItem('userId');
            try {
                const response = await axios.get(`http://localhost:3000/api/users/userProfile/${userId}`);
                setUserProfile(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching profile');
                console.error('Fetching error:', err);
            }
        };
        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/auth');
    };

    const handleDeleteProfile = async () => {
        const userId = localStorage.getItem('userId');
        if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            try {
                await axios.delete(`http://localhost:3000/api/users/deleteProfile/${userId}`);
                alert("Profile deleted successfully.");
                handleLogout();
            } catch (err) {
                setError('Error deleting profile');
                console.error('Deletion error:', err);
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
