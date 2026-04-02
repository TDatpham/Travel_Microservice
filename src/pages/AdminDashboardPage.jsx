import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Trash2, 
    Edit, 
    Hotel, 
    MapPin, 
    Star, 
    DollarSign,
    MoreVertical,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('hotels');
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    useEffect(() => {
        fetchHotels();
    }, []);

    useEffect(() => {
        if (activeTab === 'bookings' && bookings.length === 0) {
            fetchBookings();
        }
    }, [activeTab]);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/hotels');
            if (response.ok) setHotels(await response.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
            const response = await fetch('/api/v1/bookings');
            if (response.ok) setBookings(await response.json());
        } catch (err) {
            console.error(err);
        } finally {
            setBookingsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const response = await fetch(`/api/v1/hotels/${id}`, { method: 'DELETE' });
            if (response.ok) setHotels(hotels.filter(h => h.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/v1/bookings/${id}/status?status=${status}`, { method: 'PATCH' });
            if (response.ok) {
                setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="admin-dashboard-page" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '6rem 2rem' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '3.2rem', fontWeight: '800', color: '#1a1a1a' }}>Admin Panel</h1>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
                            <button 
                                onClick={() => setActiveTab('hotels')}
                                style={{ 
                                    background: 'none', border: 'none', fontSize: '1.6rem', fontWeight: activeTab === 'hotels' ? '700' : '500', 
                                    color: activeTab === 'hotels' ? '#654cf6' : '#888', cursor: 'pointer', paddingBottom: '0.5rem', borderBottom: activeTab === 'hotels' ? '3px solid #654cf6' : 'none'
                                }}
                            >
                                Properties
                            </button>
                            <button 
                                onClick={() => setActiveTab('bookings')}
                                style={{ 
                                    background: 'none', border: 'none', fontSize: '1.6rem', fontWeight: activeTab === 'bookings' ? '700' : '500', 
                                    color: activeTab === 'bookings' ? '#654cf6' : '#888', cursor: 'pointer', paddingBottom: '0.5rem', borderBottom: activeTab === 'bookings' ? '2px solid #654cf6' : 'none'
                                }}
                            >
                                Bookings
                            </button>
                        </div>
                    </div>
                    {activeTab === 'hotels' && (
                        <Link to="/admin/add-hotel" style={{ backgroundColor: '#654cf6', color: 'white', padding: '1.2rem 2.4rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', fontWeight: '700', fontSize: '1.4rem' }}>
                            <Plus size={20} /> Add Hotel
                        </Link>
                    )}
                </div>

                {activeTab === 'hotels' ? (
                    loading ? <p>Loading hotels...</p> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
                            {hotels.map(hotel => (
                                <div key={hotel.id} style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                                    <img src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    <div style={{ padding: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{hotel.name}</h3>
                                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                <button onClick={() => navigate(`/admin/edit-hotel/${hotel.id}`)} style={{ background: 'none', border: 'none', color: '#654cf6', cursor: 'pointer' }}><Edit size={18} /></button>
                                                <button onClick={() => handleDelete(hotel.id)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                        <p style={{ color: '#888', fontSize: '1.4rem' }}><MapPin size={14} /> {hotel.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    bookingsLoading ? <p>Loading bookings...</p> : (
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            {bookings.map(b => (
                                <div key={b.id} style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '20px', border: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{b.hotel?.name}</h4>
                                        <p style={{ color: '#666', fontSize: '1.4rem' }}>Khách hàng: <strong>{b.userEmail}</strong></p>
                                        <p style={{ color: '#888', fontSize: '1.3rem' }}>Thời gian: {b.checkInDate} → {b.checkOutDate}</p>
                                        <p style={{ color: '#654cf6', fontWeight: '800', marginTop: '0.5rem', fontSize: '1.6rem' }}>${b.totalPrice}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{ 
                                            padding: '0.6rem 1.5rem', borderRadius: '50px', fontWeight: '800', fontSize: '1.2rem',
                                            backgroundColor: b.status === 'CONFIRMED' ? '#e6fffa' : (b.status === 'CANCELLED' ? '#fff5f5' : '#fffaf0'),
                                            color: b.status === 'CONFIRMED' ? '#319795' : (b.status === 'CANCELLED' ? '#e53e3e' : '#d69e2e')
                                        }}>
                                            {b.status}
                                        </span>
                                        {b.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')} style={{ backgroundColor: '#38a169', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Duyệt</button>
                                                <button onClick={() => handleUpdateStatus(b.id, 'CANCELLED')} style={{ backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
