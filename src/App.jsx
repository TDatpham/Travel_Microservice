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
import AdminAddHotelPage from './pages/AdminAddHotelPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HotelDetailPage from './pages/HotelDetailPage';
import ScrollToTop   from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
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
            <Route path="/hotels/:id"   element={<HotelDetailPage />} />
            <Route path="/about"        element={<AboutPage />} />
            <Route path="/tours"        element={<ToursPage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/activities"   element={<ActivitiesPage />} />
            <Route path="/contact"      element={<ContactPage />} />
            
            {/* User Protected Routes */}
            <Route element={<ProtectedRoute roles={['USER', 'ADMIN']} />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/cart"    element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="/admin/add-hotel" element={<AdminAddHotelPage />} />
              <Route path="/admin/edit-hotel/:id" element={<AdminAddHotelPage />} />
              <Route path="/admin"        element={<AdminDashboardPage />} />
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
