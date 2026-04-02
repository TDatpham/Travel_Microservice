import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Calendar, Users, AlertCircle, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCart();
    }, [user.email]);

    const fetchCart = async () => {
        try {
            const response = await fetch(`/api/v1/bookings/user?email=${user.email}&status=PENDING`);
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                setError('Failed to fetch your cart.');
            }
        } catch (err) {
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            const response = await fetch(`/api/v1/bookings/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setBookings(bookings.filter(b => b.id !== id));
            }
        } catch (err) {
            alert('Failed to remove item.');
        }
    };

    const handleCheckout = () => {
        if (bookings.length > 0) {
            navigate('/checkout');
        }
    };

    if (loading) return <div className="loading-container" style={{ padding: '4rem', textAlign: 'center' }}>Loading your cart...</div>;

    return (
        <div className="cart-page container" style={{ padding: '6rem 2rem', minHeight: '80vh' }}>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ maxWidth: '900px', margin: '0 auto' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    <div style={{ backgroundColor: '#ff7e5f', padding: '0.8rem', borderRadius: '12px', color: 'white' }}>
                        <ShoppingCart size={28} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, background: 'linear-gradient(45deg, #2D3436, #ff7e5f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>My Booking Cart</h1>
                        <p style={{ color: '#666', marginTop: '0.2rem' }}>You have {bookings.length} hotel(s) pending in your cart.</p>
                    </div>
                </div>

                {error && (
                    <div style={{ padding: '1rem', backgroundColor: '#fff5f5', color: '#c53030', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #feb2b2' }}>
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <AnimatePresence>
                    {bookings.length > 0 ? (
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {bookings.map((booking) => (
                                <motion.div 
                                    key={booking.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    style={{ 
                                        display: 'flex', 
                                        backgroundColor: 'white', 
                                        borderRadius: '20px', 
                                        padding: '1.5rem', 
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                        border: '1px solid #f0f0f0',
                                        gap: '2rem',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ width: '180px', height: '120px', borderRadius: '15px', overflow: 'hidden', flexShrink: 0 }}>
                                        <img 
                                            src={booking.hotel?.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'} 
                                            alt={booking.hotel?.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    <div style={{ flexGrow: 1 }}>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.8rem', color: '#2d3436' }}>{booking.hotel?.name || 'Hotel Name'}</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#636e72', fontSize: '0.95rem' }}>
                                                <Calendar size={16} />
                                                {booking.checkInDate} to {booking.checkOutDate}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#636e72', fontSize: '0.95rem' }}>
                                                <Users size={16} />
                                                {booking.adults} Adults, {booking.children} Children
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ff7e5f', marginBottom: '0.8rem' }}>
                                            ${booking.totalPrice || 0}
                                        </div>
                                        <button 
                                            onClick={() => handleRemove(booking.id)}
                                            style={{ 
                                                backgroundColor: '#fff', 
                                                color: '#ff4757', 
                                                border: '1px solid #ff4757', 
                                                padding: '0.6rem 1rem', 
                                                borderRadius: '10px', 
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.9rem',
                                                fontWeight: '600',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {e.target.style.backgroundColor = '#fff5f5'}}
                                            onMouseLeave={(e) => {e.target.style.backgroundColor = '#fff'}}
                                        >
                                            <Trash2 size={16} /> Remove
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            <motion.div 
                                layout
                                style={{ 
                                    marginTop: '2rem', 
                                    padding: '2rem', 
                                    backgroundColor: '#2d3436', 
                                    borderRadius: '20px', 
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <p style={{ opacity: 0.8, marginBottom: '0.3rem' }}>Total Estimate</p>
                                    <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>
                                        ${bookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)}
                                    </h2>
                                </div>
                                <button 
                                    onClick={handleCheckout}
                                    style={{ 
                                        backgroundColor: '#ff7e5f', 
                                        color: 'white', 
                                        padding: '1rem 2.5rem', 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        fontWeight: '700', 
                                        fontSize: '1.1rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 20px rgba(255, 126, 95, 0.3)'
                                    }}
                                >
                                    Proceed to Checkout
                                </button>
                            </motion.div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: '#f8f9fa', borderRadius: '30px', border: '2px dashed #dee2e6' }}>
                            <div style={{ color: '#ccc', marginBottom: '1.5rem' }}>
                                <ShoppingBag size={80} strokeWidth={1} />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2d3436' }}>Your cart is empty</h2>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>You haven't bookmarked any hotels yet. Start exploring now!</p>
                            <Link 
                                to="/hotels" 
                                style={{ 
                                    display: 'inline-block',
                                    padding: '1rem 2rem', 
                                    backgroundColor: '#2d3436', 
                                    color: 'white', 
                                    borderRadius: '12px', 
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}
                            >
                                Browse Hotels
                            </Link>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default CartPage;
