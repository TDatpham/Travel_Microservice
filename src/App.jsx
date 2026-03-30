import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Layout        from './layouts/Layout';
import HomePage      from './pages/HomePage';
import HotelsPage    from './pages/HotelsPage';
import AboutPage     from './pages/AboutPage';
import ToursPage     from './pages/ToursPage';
import DestinationsPage from './pages/DestinationsPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ContactPage   from './pages/ContactPage';
import SignInPage    from './pages/SignInPage';
import SignUpPage    from './pages/SignUpPage';
import ScrollToTop   from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Home — layout riêng (navbar bên trong hero background) */}
        <Route path="/" element={<HomePage />} />

        {/* Auth Pages (ko dùng chung layout) */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Các trang con — dùng Layout chung (navbar header trắng + footer) */}
        <Route element={<Layout />}>
          <Route path="/hotels"       element={<HotelsPage />} />
          <Route path="/about"        element={<AboutPage />} />
          <Route path="/tours"        element={<ToursPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/activities"   element={<ActivitiesPage />} />
          <Route path="/contact"      element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
