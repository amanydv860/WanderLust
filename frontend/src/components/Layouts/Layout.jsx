// src/components/Layout/Layout.jsx
import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className='mb-24'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
