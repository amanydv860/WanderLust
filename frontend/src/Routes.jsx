// src/ProjectRoutes.jsx
import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

// Pages List
import Home from "./components/Home/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Listing from "./components/AllListings/Listing";
import ListingDetail from "./components/ListingDetail/ListingDetail";
import AddListing from "./components/ListingFrom/AddListing";
import EditListing from "./components/EditListing/EditListing";
import Booking from "./components/booking/Booking";
import UserBookings from "./components/booking/UserBooking"
// Auth Context
import { useAuth } from "./AuthContext";
import Layout from "./components/Layouts/Layout"; // Import the Layout component
import Profile from "./components/Profile/Profile";


const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
      navigate("/auth");
    }

    if (userIdFromStorage && window.location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    {
      path: "/",
      element: <Layout><Home /></Layout>, // Wrap with Layout
    },
    {
      path: "/listings",
      element: <Layout><Listing /></Layout>, // Wrap with Layout
    },
    {
      path: "/listing/:id",
      element: <Layout><ListingDetail /></Layout>, // Wrap with Layout
    },
    {
      path: "/add-listing",
      element: <Layout><AddListing /></Layout>, // Wrap with Layout
    },
    {
      path: "/auth",
      element: <Layout><Login /></Layout>, // Wrap with Layout
    },
    {
      path: "/signup",
      element: <Layout><Signup /></Layout>, // Wrap with Layout
    },
    {
      path: "/listing/:id/edit",
      element: <Layout><EditListing /></Layout>, // Wrap with Layout like others
    },
    {
      path: "/profile",
      element: <Layout><Profile /></Layout>, // Wrap with Layout like others
    },
    {
      path:"/listing/:id/book",
      element:<Layout><Booking /></Layout>, // Wrap with Layout like others
    },
    {
      path:"/bookings",
      element: <Layout> <UserBookings /> </Layout>
    }
   
  ]);

  return element;
};

export default ProjectRoutes;