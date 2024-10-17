import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { useAuth } from '../../AuthContext';
import { Typography, Rating, Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(1);
  const [coordinates, setCoordinates] = useState([51.505, -0.09]); // Default to London coordinates
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // OpenCage API Key (You should sign up to get your key)
  const GEOCODING_API_KEY = '4ad131c26029450eacec35d8b5431380';

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/listings/${id}`);
        setListing(response.data);

        // Fetch coordinates using geocoding API for the location and country
        const locationString = `${response.data.location}, ${response.data.country}`;
        const geocodingResponse = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationString)}&key=${GEOCODING_API_KEY}`
        );

        // Update the map coordinates with the fetched latitude and longitude
        if (geocodingResponse.data.results.length > 0) {
          const { lat, lng } = geocodingResponse.data.results[0].geometry;
          setCoordinates([lat, lng]);
        }

        // Fetch reviews after getting the listing
        const reviewsResponse = await axios.get(`http://localhost:3000/api/reviews/${id}`);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError('Error fetching listing details');
        console.error('Fetching error:', err);
      }
    };

    fetchListing();
  }, [id]);

  const handleDeleteListing = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/listings');
    } catch (err) {
      setError('Error deleting the listing');
      console.error('Delete error:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment || !reviewRating) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing, please login.');
        return;
      }

      const newReview = {
        comment: reviewComment,
        rating: reviewRating,
        listing: id,
        user: currentUser,
      };

      await axios.post(`http://localhost:3000/api/reviews`, newReview, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const reviewsResponse = await axios.get(`http://localhost:3000/api/reviews/${id}`);
      setReviews(reviewsResponse.data);
      setReviewComment('');
      setReviewRating(1);
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing, please login.');
        return;
      }

      await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  // Component to update the map view when coordinates change
  const SetViewOnCoordinatesChange = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(coordinates, 13); // Set the view to the fetched coordinates
    }, [coordinates, map]);
    return null;
  };

  if (error) return <div>{error}</div>;

  return (
    <div className='flex flex-col  items-center mb-8'>
      {listing ? (
        <div className='w-1/2'>
          {/* Listing Details Section */}
          <div className="border p-8 rounded shadow w-full max-w-4xl mb-8">
            <Link to="/listings"> <IoMdArrowBack size={24} /></Link>
            <h1 className="text-2xl font-bold space-x-1 mt-3">{listing.title}</h1>
            <p className='font-thin text-pc'>{listing.description}</p>
            {listing.image && (
              <img
                src={`http://localhost:3000${listing.image.url}`}
                alt={listing.title}
                className="w-full bg-cover h-60 mt-4 rounded object-cover"
              />
            )}
            <p className='mt-2'><strong className='mr-2'>Location:</strong> {listing.location}</p>
            <p className='mt-2'><strong className='mr-2'>Country:</strong> {listing.country}</p>
            <p className='mt-2'><strong className='mr-2'>Price:</strong> ${listing.price} Per/Night</p>
            <p className='mt-2'><strong className='mr-2'>Created By:</strong> {listing.user.username}</p>
            {/* <p className='mt-2'><strong className='mr-2'>Your User ID (Logged-in):</strong> {currentUser}</p> */}


            {/* Map Section */}
            <MapContainer center={coordinates} zoom={13} scrollWheelZoom={false} className="h-60 mt-4">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={coordinates}>
                <Popup>
                  {listing.title} <br /> {listing.location}, {listing.country}
                </Popup>
              </Marker>
              <SetViewOnCoordinatesChange />
            </MapContainer>

            {listing.user._id === currentUser && (
              <div className="my-5 space-x-4 flex">
                <button onClick={handleDeleteListing} className="bg-mc text-white px-4 py-1 rounded">Delete</button>
                <button onClick={() => navigate(`/listing/${id}/edit`)} className="bg-pc text-white px-4 py-1 rounded">Edit</button>
              </div>
            )}
            {/* Book Now button */}
            {listing.user._id !== currentUser && (
            <div className="my-2">
              <Link to={`/listing/${id}/book`}>
                <button className="bg-blue-500 text-white px-4 py-1 rounded">Book Now</button>
              </Link>
              </div>
            )}



          </div>

          {/* Review Form and Reviews Section */}
          <div className="w-full max-w-4xl">
            {/* Review Form */}
            <form onSubmit={handleReviewSubmit} className="my-4">
              <h2 className="text-xl">Leave a Review</h2>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your review..."
                className="w-full border-2 border-gray-300 rounded-lg p-3 my-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out resize-none shadow-md"
                rows="5"
                required
              />
              <div className='flex items-center space-x-4'>
                <div className="mb-2">
                  <Typography component="legend">Rating</Typography>
                  <Rating
                    name="simple-controlled"
                    value={reviewRating}
                    onChange={(event, newValue) => {
                      setReviewRating(newValue);
                    }}
                    precision={0.5}
                  />
                </div>
                <Button
                  size='small'
                  type='submit'
                  className='review-btn'
                  variant="contained">Submit Review
                </Button>
              </div>
            </form>

            {/* Reviews Section */}
            <div className='border-t-2'>
              <h2 className="text-xl mt-4">Reviews</h2>
              {reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                <ul className='grid grid-cols-2 gap-1'>
                  {reviews.map((review) => (
                    <li key={review._id} className="border p-3 my-2 rounded max-h-32 overflow-auto break-words">
                      <p><strong>{review.user.username}</strong></p>
                      <Rating value={review.rating} readOnly precision={0.5} className='mr-3' />
                      <p className='text-wrap'>{review.comment}</p>
                      {review.user._id === currentUser && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading listing...</p>
      )}
    </div>
  );
};

export default ListingDetail;
