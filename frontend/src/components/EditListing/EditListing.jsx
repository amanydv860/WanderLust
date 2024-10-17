import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditListing = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    image: null,
  });
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`https://wanderlust-y0i4.onrender.com/api/listings/${id}`);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          price: response.data.price,
          location: response.data.location,
          country: response.data.country,
          image: null,
        });
        setCurrentImage(response.data.image ? response.data.image.url : null);
      } catch (err) {
        setError('Error fetching listing details');
        console.error('Fetching error:', err);
      }
    };
    fetchListing();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // console.log(`Updating listing with ID: ${id}`); // Debug log
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('country', formData.country);
    
    if (formData.image) {
      data.append('image', formData.image);
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login...");
        navigate("/auth");
        return;
      }

      await axios.put(`https://wanderlust-y0i4.onrender.com/api/listings/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Add your token here
        },
      });
      navigate(`/listing/${id}`);
    } catch (err) {
      setError('Error updating the listing');
      console.error('Update error:', err);
    }
  };
  

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <form onSubmit={handleEditSubmit}>
        <h1 className="text-2xl font-semibold mb-4 text-hc">Edit Your Hotel Detail</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {currentImage && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Current Image:</p>
            <img src={`https://wanderlust-y0i4.onrender.com${currentImage}`} alt="Current Listing" 
            className="mt-2 max-w-full h-60 object-cover rounded-md shadow-sm" />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Upload New Image (optional):</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate(`/listing/${id}`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListing;
