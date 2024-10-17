import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material'; // Import MUI Rating
import Home from '../Home/Home'; // Import Home Component

const Listing = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredListings, setFilteredListings] = useState([]);
  const [fiveStarListings, setFiveStarListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/listings');
        const listingsWithReviews = await Promise.all(
          response.data.map(async (listing) => {
            const reviewsResponse = await axios.get(`http://localhost:3000/api/reviews/${listing._id}`);
            return { ...listing, reviews: reviewsResponse.data };
          })
        );
        setListings(listingsWithReviews);
        setFilteredListings(listingsWithReviews);

        // Filter listings with an average rating of 5
        const fiveStarOnly = listingsWithReviews.filter(
          (listing) => Math.round(calculateAverageRating(listing.reviews)) === 5
        );
        setFiveStarListings(fiveStarOnly);
        
      } catch (err) {
        setError('Error fetching listings');
        console.error('Fetching error:', err);
      }
    };

    fetchListings();
  }, []);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1)); // Return a number
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const lowerCaseQuery = query.toLowerCase();
    const results = listings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(lowerCaseQuery) ||
        listing.location.toLowerCase().includes(lowerCaseQuery) ||
        listing.country.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredListings(results);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className='p-10'>
      <div className="mb-16 flex justify-center">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border rounded w-1/2"
        />
      </div>

      {filteredListings.length === 0 && searchQuery && (
        <div>No listings found for "{searchQuery}". Please try again.</div>
      )}

      <ul className="flex flex-wrap justify-start gap-y-4 gap-x-12">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <li
              key={listing._id}
              className="border p-4 mb-4 rounded shadow w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <Link to={`/listing/${listing._id}`}>
                <h2 className="text-xl font-bold text-hc font-serif">{listing.title}</h2>
                {listing.image && (
                  <img
                    src={`http://localhost:3000${listing.image.url}`}
                    alt={listing.title}
                    className="w-full h-40 object-cover mt-2 rounded "
                  />
                )}
                <p className='text-pc text-sm mt-2 font-mono'>
                  <strong className='text-hc text-sm font-bold'>Location:</strong> {listing.location}, {listing.country}
                </p>
                <p className='text-pc text-sm mt-2 font-mono'>
                  <strong className='text-hc text-sm font-bold'>Price:</strong> ${listing.price} per/N
                </p>
                <p className='mt-2 flex items-center font-mono'>
                  <strong className='text-hc mr-2 text-sm font-bold'>Rating:</strong>
                  <Rating size='small' value={calculateAverageRating(listing.reviews)} readOnly precision={0.1} />
                </p>
              </Link>
            </li>
          ))
        ) : (
          <li>No listings available</li>
        )}
      </ul>
    </div>
  );
};

export default Listing;
