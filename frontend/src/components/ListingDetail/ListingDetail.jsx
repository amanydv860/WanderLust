import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { useAuth } from '../../AuthContext';
import { Typography, Rating, Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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

  const GEOCODING_API_KEY = '4ad131c26029450eacec35d8b5431380';

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`https://wanderlust-y0i4.onrender.com/api/listings/${id}`);
        setListing(response.data);

        const locationString = `${response.data.location}, ${response.data.country}`;
        const geocodingResponse = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationString)}&key=${GEOCODING_API_KEY}`
        );

        if (geocodingResponse.data.results.length > 0) {
          const { lat, lng } = geocodingResponse.data.results[0].geometry;
          setCoordinates([lat, lng]);
        }

        const reviewsResponse = await axios.get(`https://wanderlust-y0i4.onrender.com/api/reviews/${id}`);
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
      await axios.delete(`https://wanderlust-y0i4.onrender.com/api/listings/${id}`, {
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

      await axios.post(`https://wanderlust-y0i4.onrender.com/api/reviews`, newReview, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const reviewsResponse = await axios.get(`https://wanderlust-y0i4.onrender.com/api/reviews/${id}`);
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

      await axios.delete(`https://wanderlust-y0i4.onrender.com/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const SetViewOnCoordinatesChange = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(coordinates, 13);
    }, [coordinates, map]);
    return null;
  };

  if (error) return <div>{error}</div>;

  return (
    <div className='flex flex-col items-center mb-8'>
      {listing ? (
        <div className='w-full sm:w-4/5 lg:w-3/5 xl:w-2/5'>
          {/* Listing Details Section */}
          <div className="border p-8 rounded shadow w-full mb-8">
            <Link to="/listings"><IoMdArrowBack size={24} /></Link>
            <h1 className="text-2xl font-bold space-x-1 mt-3">{listing.title}</h1>
            <p className='font-thin text-pc'>{listing.description}</p>
            {listing.image && (
              <img
                src={`https://wanderlust-y0i4.onrender.com${listing.image.url}`}
                alt={listing.title}
                className="w-full bg-cover h-60 mt-4 rounded object-cover"
              />
            )}
            <p className='mt-2'><strong className='mr-2'>Location:</strong> {listing.location}</p>
            <p className='mt-2'><strong className='mr-2'>Country:</strong> {listing.country}</p>
            <p className='mt-2'><strong className='mr-2'>Price:</strong> ${listing.price} Per/Night</p>
            <p className='mt-2'><strong className='mr-2'>Created By:</strong> {listing.user.username}</p>

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
                <button onClick={handleDeleteListing} className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
                <button onClick={() => navigate(`/listing/${id}/edit`)} className="bg-blue-500 text-white px-4 py-1 rounded">Edit</button>
              </div>
            )}
            {/* Book Now button */}
            {listing.user._id !== currentUser && (
              <div className="my-2">
                <Link to={`/listing/${id}/book`}>
                  <button className="bg-green-500 text-white px-4 py-1 rounded">Book Now</button>
                </Link>
              </div>
            )}
          </div>

          {/* Review Form and Reviews Section */}
          <div className="w-full max-w-4xl">
            <h2 className="text-xl font-semibold mb-3">Reviews</h2>
            {reviews.map((review) => (
              <div key={review._id} className="border p-4 rounded shadow mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="subtitle1" className='text-lg font-bold'>{review.user.username}</Typography>
                    <Rating value={review.rating} precision={0.5} readOnly />
                    <Typography variant="body1">{review.comment}</Typography>
                  </div>
                  {currentUser === review.user._id && (
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteReview(review._id)}>Delete</Button>
                  )}
                </div>
              </div>
            ))}
            <form onSubmit={handleReviewSubmit} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-3">Add a Review</h2>
              <Rating
                value={reviewRating}
                onChange={(e, newValue) => setReviewRating(newValue)}
              />
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-2 mt-2 border rounded"
                placeholder="Write your review here"
              />
              <Button variant="contained" color="primary" type="submit" className="mt-3">Submit Review</Button>
            </form>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ListingDetail;
