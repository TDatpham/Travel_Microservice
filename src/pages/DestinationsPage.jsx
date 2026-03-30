import React from 'react';
import { motion } from 'framer-motion';
import Destinations from '../components/Destinations';

const DestinationsPage = () => {
  return (
    <div className="page-content">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Destinations />
      </motion.div>
    </div>
  );
};

export default DestinationsPage;
