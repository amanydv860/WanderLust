import React, { useState } from "react";

const ListingForm = ({ onSubmit }) => {
  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    image: null, // Handle image uploads
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing({ ...listing, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setListing({ ...listing, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(listing).forEach((key) => {
      formData.append(key, listing[key]);
    });
    onSubmit(formData); // Pass the formData instead of a simple object
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md mt-3"
    >
       <h1 className="text-2xl font-serif text-center text-hc mb-6">Register Your Hotel On WanderLust</h1>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={listing.title}
        onChange={handleChange}
        required
        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={listing.description}
        onChange={handleChange}
        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={listing.price}
        onChange={handleChange}
        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={listing.location}
        onChange={handleChange}
        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="country"
        placeholder="Country"
        value={listing.country}
        onChange={handleChange}
        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="file"
        name="image"
        onChange={handleImageChange}
        className="mb-4 p-3"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Submit
      </button>
    </form>
  );
};

export default ListingForm;
