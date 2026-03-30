import React from 'react';
import { motion } from 'framer-motion';
import Hotels from '../components/Hotels';

const HotelsPage = () => {
  return (
    <div className="page-content">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Hotels />
      </motion.div>
    </div>
  );
};

export default HotelsPage;
