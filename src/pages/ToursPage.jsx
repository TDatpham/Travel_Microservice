import React from 'react';
import { motion } from 'framer-motion';
import Tours from '../components/Tours';

const ToursPage = () => {
  return (
    <div className="page-content">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Tours />
      </motion.div>
    </div>
  );
};

export default ToursPage;
