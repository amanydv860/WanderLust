import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ListingForm from "./ListingForm";

const AddListing = () => {
  const navigate = useNavigate(); // For navigation after creating a listing
  const [error, setError] = useState(null);


  const handleCreateListing = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login...");
        navigate("/auth");
        return;
      }

      // console.log("Token being sent:", token); // Debug log to check token

      const response = await axios.post("https://wanderlust-y0i4.onrender.com/api/listings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Make sure this header is included
        },
      });

      navigate(`/listings`);
    } catch (err) {
      setError("Error creating listing");
      console.error("Create error:", err);
    }
  };

  return (
    <div className="mb-4">
      {error && <p className="text-red-500">{error}</p>}
      <ListingForm onSubmit={handleCreateListing} />
    </div>
  );
};

export default AddListing;