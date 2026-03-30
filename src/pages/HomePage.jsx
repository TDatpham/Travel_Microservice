import React from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      {/* Hero (bao gồm cả Navbar bên trong main background) */}
      <Hero />

      <Footer className="home-footer" />
    </>
  );
};

export default HomePage;
