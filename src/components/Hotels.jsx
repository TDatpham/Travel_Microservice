import React, { useState } from 'react';
import { Search, Home, DollarSign, Star, RotateCcw } from 'lucide-react';

const hotelsData = [
  { id: 1, name: 'Monastero Santa Rosa Hotel & Spa', location: 'Salerno, Italy', rating: 5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80', off: false, price: 350, type: 'Spa' },
  { id: 2, name: 'Grand Hotel Tremezzo', location: 'Lake Como, Italy', rating: 4, img: 'https://images.unsplash.com/photo-1586974726316-c6302de6a160?ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80', off: false, price: 500, type: 'Hotel' },
  { id: 3, name: 'The Oberoi Udaivilas, Udaipur', location: 'Udaipur, India', rating: 2, img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80', off: false, price: 150, type: 'Hotel' },
  { id: 4, name: 'AKA Beverly Hills', location: 'Los Angeles, United States', rating: 5, img: 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80', off: false, price: 450, type: 'Villa' },
  { id: 5, name: 'Majestic Elegance', location: 'Dominican Republic', rating: 4, img: 'https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-1.2.1&auto=format&fit=crop&w=1964&q=80', off: true, price: 200, type: 'Resort' },
  { id: 6, name: 'Dreams Watervilla', location: 'Meeru Island, Maldives', rating: 5, img: 'https://images.unsplash.com/photo-1586495985096-787fb4a54ac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1974&q=80', off: true, price: 600, type: 'Villa' },
  { id: 7, name: 'Waldorf Astoria', location: 'Rome, Italy', rating: 3, img: 'https://images.unsplash.com/photo-1594741158704-5a784b8e59fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80', off: true, price: 180, type: 'Hotel' },
  { id: 8, name: 'Gilli Air', location: 'Indonesia', rating: 4, img: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80', off: true, price: 120, type: 'Resort' },
];

const Hotels = () => {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const resetFilters = () => {
    setSearchQuery('');
    setFilterRating('All');
    setFilterPrice('All');
    setFilterType('All');
  };

  const filteredHotels = hotelsData.filter((hotel) => {
    const matchSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchRating = true;
    if (filterRating !== 'All') {
      if (filterRating === '3') matchRating = hotel.rating <= 3;
      else matchRating = hotel.rating === parseInt(filterRating);
    }

    let matchPrice = true;
    if (filterPrice !== 'All') {
      if (filterPrice === 'Low') matchPrice = hotel.price < 200;
      else if (filterPrice === 'Mid') matchPrice = hotel.price >= 200 && hotel.price <= 400;
      else if (filterPrice === 'High') matchPrice = hotel.price > 400;
    }

    let matchType = true;
    if (filterType !== 'All') {
      matchType = hotel.type === filterType;
    }

    return matchSearch && matchRating && matchPrice && matchType;
  });

  const hasActiveFilter = searchQuery !== '' || filterRating !== 'All' || filterPrice !== 'All' || filterType !== 'All';
  const displayedHotels = filteredHotels.filter(hotel => hasActiveFilter || !hotel.off || showAll);

  return (
    <section className="hotel-restaurants" id="hotels">
      <div className="container">
        <div className="hotels-filter-bar">
          <div className="hotels-search-wrapper">
            <Search size={20} className="filter-icon" />
            <input 
              type="text" 
              placeholder="Search destination or hotel..." 
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
                <option value="3">3 Stars & Below</option>
              </select>
            </div>
            {hasActiveFilter && (
              <button className="hotels-reset-btn" onClick={resetFilters} title="Reset Filters">
                <RotateCcw size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="title-container">
          <h2 className="section-title">Hotels</h2>
          <div className="section-button hotel-button" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'less' : 'view all'} <img src="/Imgs/icons/bleft.png" alt="" />
          </div>
        </div>
        
        <div className="hotel-card">
          {displayedHotels.length === 0 ? (
            <p className="no-hotels-msg">No properties match your filters.</p>
          ) : (
            displayedHotels.map((hotel) => (
              <div className="hotel-cards" key={hotel.id}>
                <img src={hotel.img} alt={hotel.name} width="320" height="380" />
                <div className="hotel-meta">
                  <span className="hotel-type-badge">{hotel.type}</span>
                  <span className="hotel-price-badge">${hotel.price}/night</span>
                </div>
                <h5>{hotel.name}</h5>
                <h6>
                  <img src="/Imgs/icons/map-pin-line.png" alt="" /> {hotel.location}
                </h6>
                <div className="ratings">
                  <img src={`/Imgs/icons/rating=${hotel.rating}.png`} alt={`${hotel.rating} stars`} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Hotels;
