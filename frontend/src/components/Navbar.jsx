import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAccountCircle } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // For mobile menu

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="font-serif text-3xl text-mc">WanderLust</h1>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-pc hover:text-hc px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link
              to="/listings"
              className="text-pc hover:text-hc px-3 py-2 rounded-md text-sm font-medium"
            >
              All Hotels
            </Link>
            <Link
              to="/add-listing"
              className="text-pc hover:text-hc px-3 py-2 rounded-md text-sm font-medium"
            >
              Register Your Hotel
            </Link>

            <Link
            to="/bookings"
            className="block text-pc hover:text-hc px-4 py-2 rounded-md text-sm font-medium"
            onClick={toggleMobileMenu}
          >
            Your Booking
          </Link>

            <Link
              to="/profile"
              className="text-pc hover:text-hc px-3 py-2 rounded-md text-sm font-medium"
            >
             <MdOutlineAccountCircle size={24} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-pc hover:text-hc focus:outline-none focus:text-gray-500"
              aria-label="toggle menu"
              onClick={toggleMobileMenu}
            >
             <IoMdMenu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Links */}
      {isMobileMenuOpen && (
        <div className="md:hidden transition-all transform duration-300 ease-in-out" id="mobile-menu">
          <Link
            to="/"
            className="block text-pc hover:text-hc px-4 py-2 rounded-md text-base font-medium"
            onClick={toggleMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/listings"
            className="block text-pc hover:text-hc px-4 py-2 rounded-md text-base font-medium"
            onClick={toggleMobileMenu}
          >
            All Listings
          </Link>
          <Link
            to="/add-listing"
            className="block text-pc hover:text-hc px-4 py-2 rounded-md text-base font-medium"
            onClick={toggleMobileMenu}
          >
            Add Listing
          </Link>
          <Link
            to="/bookings"
            className="block text-pc hover:text-hc px-4 py-2 rounded-md text-base font-medium"
            onClick={toggleMobileMenu}
          >
            Booking
          </Link>

          <Link
            to="/profile"
            className="block text-pc hover:text-hc px-4 py-2 rounded-md text-base font-medium"
          >
            <MdOutlineAccountCircle size={24} />
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
