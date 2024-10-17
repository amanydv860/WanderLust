import React from 'react'
import { Link} from 'react-router-dom';
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    
      <footer className="pt-3  " style={{ boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)'}}>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 px-2">
          {/* Logo & Branding */}
          <div>
          <h1 className="font-serif text-3xl text-mc">WanderLust</h1>
            <p className="text-pc text-sm mt-2">Your ideal stay is just a click away.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className='text-xs space-y-2'>
              <li><Link to="/" className="text-pc hover:text-hc">Home</Link></li>
              <li><Link to="/listings" className="text-pc hover:text-hc">All Hotels</Link></li>
              <li><Link  className="text-pc hover:text-hc">Blog</Link></li>
              <li><Link className="text-pc hover:text-hc">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div >
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
           <div className='text-xs text-pc hover:text-hc space-y-2'>
           <p className=''>Email: support@wanderlust.com</p>
           <p className=''>Phone: +1 800 123 4567</p>
           </div>
          </div>

          {/* Social Links & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              {/* Add social media icons here */}
              <a href="#" className='className= text-pc hover:text-hc'><FaFacebook  size={22}/></a>
              <a href="#" className='className= text-pc hover:text-hc'><FaInstagram size={22}/></a>
              <a href="#" className='className= text-pc hover:text-hc'><FaXTwitter  size={22}/></a>
            </div>
            
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 py-4 text-center text-gray-400">
          <p>© 2024 WanderLust Hotels. All rights reserved.</p>
        </div>
      </footer>
  )
}
