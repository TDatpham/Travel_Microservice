import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const Hero = () => {
  return (
    <>
      <main className="main" id="home">
        {/* Navbar nằm bên trong main để có background showcase */}
        <Navbar />

        <motion.div
          className="showcase-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Discover the most engaging places</h1>
          <a
            href="https://earth.google.com/web/"
            target="_blank"
            rel="noopener noreferrer"
            className="showcase-button"
          >
            <img src="/Imgs/icons/globe.png" alt="" /> Discover on 3D globe
          </a>
        </motion.div>

      </main>
    </>
  );
};

export default Hero;
