import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material'; // Import Rating from Material UI


export default function Home() {
  const [fiveStarListings, setFiveStarListings] = useState([]);
  const [manaliListings, setManaliListings] = useState([]); // State for Manali listings
  const [maldivesListings, setMaldivesListings] = useState([]); // State for Maldives listings
  
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('https://wanderlust-y0i4.onrender.com/api/listings');
        const listingsWithReviews = await Promise.all(
          response.data.map(async (listing) => {
            const reviewsResponse = await axios.get(`https://wanderlust-y0i4.onrender.com/api/reviews/${listing._id}`);
            return { ...listing, reviews: reviewsResponse.data };
          })
        );

        // Filter out listings with a 5-star average rating
        const fiveStarOnly = listingsWithReviews.filter(
          (listing) => calculateAverageRating(listing.reviews) === 5
        );
        setFiveStarListings(fiveStarOnly.slice(0, 5)); // Limit to top 5 listings

        // Filter for Manali listings using listingsWithReviews
        const manaliOnly = listingsWithReviews.filter((listing) =>
          listing.location && listing.location.toLowerCase().includes('manali')
        );
        setManaliListings(manaliOnly.slice(0, 3)); // Limit to top 3 Manali listings

        // Filter for Maldives listings using listingsWithReviews
        const maldivesOnly = listingsWithReviews.filter((listing) =>
          listing.country && listing.country.toLowerCase().includes('maldives')
        );
        setMaldivesListings(maldivesOnly.slice(0, 3)); // Limit to top 3 Maldives listings
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
    return parseFloat((total / reviews.length).toFixed(1)); // Ensure it's a number
  };

  if (error) return <div>{error}</div>;

  return (
    <div className='mt-4'>
      <div className="relative h-[20rem]">
        <Link to="/listings">
          <img
            src="/img/addlisting.jpg"
            alt="Sample Image"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-start text-center pl-10">
            <p className="text-white text-lg">Best friends, great vacations</p>
            <p className="text-white text-lg">Make your group trip</p>
            <p className="text-white text-lg">Dreams come true</p>
            <p className="text-white text-lg">Break free from your routine and play a little</p>
            <p className="text-white text-3xl font-serif mt-4">Explore the hotels..</p>
          </div>
        </Link>
      </div>

      {/* Display the 5-star listings here */}
      <div className='five-star-rating-hotel mt-10 p-4'>
        <h2 className="text-2xl font-bold mb-4">Top 5-Star Rated Hotels</h2>
        <ul className="flex flex-wrap justify-start gap-y-4 gap-x-12">
          {fiveStarListings.length > 0 ? (
            fiveStarListings.map((listing) => (
              <li key={listing._id} className="border p-4 mb-4 rounded shadow w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <Link to={`/listing/${listing._id}`}>
                  <h3 className="text-lg font-bold">{listing.title}</h3>
                  {listing.image && (
                    <img
                      src={`https://wanderlust-y0i4.onrender.com${listing.image.url}`}
                      alt={listing.title}
                      className="w-full h-40 object-cover mt-2 rounded"
                    />
                  )}
                  <div className='ml-2 space-y-2'>
                    <p className="text-sm mt-2">{listing.location}, {listing.country}</p>
                    <Rating
                      size="small"
                      value={5} // Since this is a 5-star listing, display a rating of 5
                      readOnly
                      precision={0.1} // If you want fractional ratings like 4.5, you can use this
                    />
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <p>No 5-star listings available.</p>
          )}
        </ul>
      </div>

      <div className="relative h-[20rem]">
        <Link to="/add-listing">
          <img
            src="/img/maldives2.jpeg"
            alt="Sample Image"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-start text-center pl-10">
            <p className="text-white text-3xl font-serif mt-4">Register your Hotels OR Resort on WanderLust...</p>
          </div>
        </Link>
      </div>

      {/* Display the top 3 Manali listings here */}
      <div className='manali-listings mt-10 p-4'>
        <h2 className="text-2xl font-bold mb-4">Top Properties in Manali</h2>
        <ul className="flex flex-wrap justify-start gap-y-4 gap-x-12">
          {manaliListings.length > 0 ? (
            manaliListings.map((listing) => (
              <li key={listing._id} className="border p-4 mb-4 rounded shadow w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <Link to={`/listing/${listing._id}`}>
                  <h3 className="text-lg font-bold">{listing.title}</h3>
                  {listing.image && (
                    <img
                      src={`https://wanderlust-y0i4.onrender.com${listing.image.url}`}
                      alt={listing.title}
                      className="w-full h-40 object-cover mt-2 rounded"
                    />
                  )}
                  <div className='ml-2 space-y-2'>
                    <p className="text-sm mt-2">{listing.location}, {listing.country}</p>
                    <Rating
                      size="small"
                      value={calculateAverageRating(listing.reviews)} // Calculate and display the average rating
                      readOnly
                      precision={0.1}
                    />
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <p>No properties available in Manali.</p>
          )}
        </ul>
      </div>

      {/* Display the top 3 Maldives listings here */}
      <div className='maldives-listings mt-8 p-4'>
        <h2 className="text-2xl font-bold mb-4">Top Properties in Maldives</h2>
        <ul className="flex flex-wrap justify-start gap-y-4 gap-x-12">
          {maldivesListings.length > 0 ? (
            maldivesListings.map((listing) => (
              <li key={listing._id} className="border p-4 mb-4 rounded shadow w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <Link to={`/listing/${listing._id}`}>
                  <h3 className="text-lg font-bold">{listing.title}</h3>
                  {listing.image && (
                    <img
                      src={`https://wanderlust-y0i4.onrender.com${listing.image.url}`}
                      alt={listing.title}
                      className="w-full h-40 object-cover mt-2 rounded"
                    />
                  )}
                  <div className='ml-2 space-y-2'>
                    <p className="text-sm mt-2">{listing.location}, {listing.country}</p>
                    <Rating
                      size="small"
                      value={calculateAverageRating(listing.reviews)} // Calculate and display the average rating
                      readOnly
                      precision={0.1}
                    />
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <p>No properties available in Maldives.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
