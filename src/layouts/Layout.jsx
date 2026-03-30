import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = () => {
  return (
    <>
      <div className="page-header">
        <Navbar variant="page" />
      </div>
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
