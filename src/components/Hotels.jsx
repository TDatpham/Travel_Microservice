import React, { useState, useEffect } from 'react';
import { Search, Home, DollarSign, Star, RotateCcw, ShoppingCart, MapPin, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const initialHotels = [
  { id: 1, name: 'Monastero Santa Rosa Hotel & Spa', location: 'Salerno, Italy', rating: 5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', off: false, price: 350, type: 'Spa' },
  { id: 2, name: 'Grand Hotel Tremezzo', location: 'Lake Como, Italy', rating: 4, img: 'https://images.unsplash.com/photo-1586974726316-c6302de6a160?auto=format&fit=crop&w=800&q=80', off: false, price: 500, type: 'Hotel' },
  { id: 3, name: 'The Oberoi Udaivilas, Udaipur', location: 'Udaipur, India', rating: 3, img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80', off: false, price: 150, type: 'Hotel' },
  { id: 4, name: 'AKA Beverly Hills', location: 'Los Angeles, United States', rating: 5, img: 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&w=800&q=80', off: false, price: 450, type: 'Villa' },
  { id: 5, name: 'Majestic Elegance', location: 'Dominican Republic', rating: 4, img: 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=800&q=80', off: true, price: 200, type: 'Resort' },
  { id: 6, name: 'Dreams Watervilla', location: 'Meeru Island, Maldives', rating: 5, img: 'https://images.unsplash.com/photo-1586495985096-787fb4a54ac0?auto=format&fit=crop&w=800&q=80', off: true, price: 600, type: 'Villa' },
  { id: 7, name: 'Waldorf Astoria', location: 'Rome, Italy', rating: 3, img: 'https://images.unsplash.com/photo-1594741158704-5a784b8e59fb?auto=format&fit=crop&w=800&q=80', off: true, price: 180, type: 'Hotel' },
  { id: 8, name: 'Gilli Air', location: 'Indonesia', rating: 4, img: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?auto=format&fit=crop&w=800&q=80', off: true, price: 120, type: 'Resort' },
];

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map(n => (
      <Star
        key={n}
        size={14}
        fill={n <= rating ? '#f1c40f' : 'none'}
        color={n <= rating ? '#f1c40f' : '#ccc'}
      />
    ))}
  </div>
);

const Hotels = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState(initialHotels);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [addingId, setAddingId] = useState(null);

  const handleBookNow = async (hotel) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setAddingId(hotel.id);
    try {
      const response = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          hotel: { id: hotel.id },
          adults: 2,
          children: 0,
          checkInDate: new Date().toISOString().split('T')[0],
          checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          totalPrice: hotel.price,
          status: 'PENDING'
        })
      });
      if (response.ok) {
        alert(`✅ ${hotel.name} đã được thêm vào giỏ hàng!`);
      } else {
        alert('Không thể thêm vào giỏ hàng.');
      }
    } catch (err) {
      alert('Lỗi kết nối đến hotel service.');
    } finally {
      setAddingId(null);
    }
  };

  useEffect(() => {
    fetch('/api/v1/hotels')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const processed = data.map(h => ({
            ...h,
            img: h.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            price: h.price ? Number(h.price) : 0
          }));
          setHotels(processed);
        }
      })
      .catch(() => {});
  }, []);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterRating('All');
    setFilterPrice('All');
    setFilterType('All');
  };

  const filteredHotels = hotels.filter((hotel) => {
    const matchSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    let matchRating = true;
    if (filterRating !== 'All') {
      matchRating = hotel.rating === parseInt(filterRating);
    }
    let matchPrice = true;
    if (filterPrice === 'Low') matchPrice = hotel.price < 200;
    else if (filterPrice === 'Mid') matchPrice = hotel.price >= 200 && hotel.price <= 400;
    else if (filterPrice === 'High') matchPrice = hotel.price > 400;

    let matchType = true;
    if (filterType !== 'All') matchType = hotel.type === filterType;

    return matchSearch && matchRating && matchPrice && matchType;
  });

  const hasActiveFilter = searchQuery !== '' || filterRating !== 'All' || filterPrice !== 'All' || filterType !== 'All';
  const displayedHotels = hasActiveFilter ? filteredHotels : (showAll ? filteredHotels : filteredHotels.slice(0, 4));

  return (
    <section id="hotels" style={{ padding: '2rem 0 6rem' }}>
      <div className="container" style={{ padding: '0 2rem' }}>

        {/* Filter Bar */}
        <div className="hotels-filter-bar">
          <div className="hotels-search-wrapper">
            <Search size={20} className="filter-icon" />
            <input
              type="text"
              placeholder="Search hotel or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hotels-search-input"
            />
          </div>
          <div className="hotels-filter-dropdowns">
            <div className="hotels-select-wrapper">
              <Home size={18} className="filter-icon" />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="hotels-rating-select">
                <option value="All">All Types</option>
                <option value="Hotel">Hotel</option>
                <option value="Resort">Resort</option>
                <option value="Villa">Villa</option>
                <option value="Spa">Spa</option>
              </select>
            </div>
            <div className="hotels-select-wrapper">
              <DollarSign size={18} className="filter-icon" />
              <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)} className="hotels-rating-select">
                <option value="All">Any Price</option>
                <option value="Low">Under $200</option>
                <option value="Mid">$200 - $400</option>
                <option value="High">Above $400</option>
              </select>
            </div>
            <div className="hotels-select-wrapper">
              <Star size={18} className="filter-icon" />
              <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="hotels-rating-select">
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>
            {hasActiveFilter && (
              <button className="hotels-reset-btn" onClick={resetFilters} title="Reset Filters">
                <RotateCcw size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '3.2rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>Featured Hotels</h2>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: '1px solid #e0e0e0',
              padding: '0.8rem 1.8rem', borderRadius: '50px', cursor: 'pointer', fontSize: '1.4rem',
              fontWeight: '600', color: '#666', transition: 'all 0.2s'
            }}
          >
            {showAll ? 'Show Less' : 'View All'} <ChevronRight size={16} />
          </button>
        </div>

        {/* Grid */}
        <AnimatePresence>
          {displayedHotels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 0', color: '#aaa' }}>
              <Search size={60} strokeWidth={1} />
              <p style={{ marginTop: '2rem', fontSize: '1.6rem' }}>No hotels match your filters.</p>
              <button onClick={resetFilters} style={{ marginTop: '1.5rem', background: '#654cf6', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '1.4rem' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2.4rem',
            }}>
              {displayedHotels.map((hotel, idx) => (
                <motion.div
                  key={hotel.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                    border: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                    cursor: 'default'
                  }}
                  whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}
                >
                  {/* Image */}
                  <div 
                    onClick={() => navigate(`/hotels/${hotel.id}`)}
                    style={{ position: 'relative', height: '220px', overflow: 'hidden', cursor: 'pointer' }}
                  >
                    <img
                      src={hotel.img}
                      alt={hotel.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    {/* Type badge - top left */}
                    <span style={{
                      position: 'absolute', top: '1.2rem', left: '1.2rem',
                      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
                      color: '#654cf6', fontWeight: '700', fontSize: '1.1rem',
                      padding: '0.4rem 1rem', borderRadius: '50px',
                    }}>
                      {hotel.type}
                    </span>
                    {/* Price badge - top right */}
                    <span style={{
                      position: 'absolute', top: '1.2rem', right: '1.2rem',
                      background: '#2d3436', color: 'white',
                      fontWeight: '800', fontSize: '1.3rem',
                      padding: '0.4rem 1.2rem', borderRadius: '50px',
                    }}>
                      ${hotel.price}<span style={{ fontSize: '1rem', fontWeight: '400' }}>/night</span>
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 
                      onClick={() => navigate(`/hotels/${hotel.id}`)}
                      style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.8rem', lineHeight: '1.3', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.target.style.color = '#654cf6'}
                      onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}
                    >
                      {hotel.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
                      <MapPin size={14} /> {hotel.location}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #f5f5f5' }}>
                      <StarRating rating={hotel.rating} />
                      <button
                        onClick={() => handleBookNow(hotel)}
                        disabled={addingId === hotel.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.6rem',
                          padding: '0.8rem 1.6rem', borderRadius: '10px',
                          backgroundColor: addingId === hotel.id ? '#aaa' : '#ff7e5f',
                          color: 'white', border: 'none', cursor: 'pointer',
                          fontWeight: '700', fontSize: '1.3rem', transition: 'all 0.2s'
                        }}
                      >
                        <ShoppingCart size={16} />
                        {addingId === hotel.id ? 'Đang thêm...' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hotels;
