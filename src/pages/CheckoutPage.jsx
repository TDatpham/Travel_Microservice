import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CreditCard, 
    ShieldCheck, 
    Calendar, 
    Users, 
    ArrowRight, 
    ChevronLeft, 
    Lock,
    CheckCircle2,
    Clock,
    ShoppingBag
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const CheckoutPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processed, setProcessed] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    useEffect(() => {
        fetchCart();
    }, [user.email]);

    const fetchCart = async () => {
        try {
            const response = await fetch(`/api/v1/bookings/user?email=${user.email}&status=PENDING`);
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate payment processing
        setTimeout(async () => {
            // Update all pending bookings to CONFIRMED
            for (const b of bookings) {
                await fetch(`/api/v1/bookings/${b.id}/status?status=CONFIRMED`, {
                    method: 'PATCH'
                });
            }
            setProcessed(true);
            setLoading(false);
        }, 2000);
    };

    const total = bookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

    if (processed) {
        return (
            <div className="checkout-success" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div style={{ backgroundColor: '#27ae60', color: 'white', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Payment Successful!</h1>
                    <p style={{ color: '#636e72', fontSize: '1.4rem', marginBottom: '3rem' }}>Your hotel rooms have been reserved. You will receive a confirmation email shortly.</p>
                    <Link to="/" style={{ backgroundColor: '#ff7e5f', color: 'white', padding: '1.2rem 3rem', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', fontSize: '1.4rem' }}>Return to Homepage</Link>
                </motion.div>
            </div>
        );
    }

    if (bookings.length === 0 && !loading) {
        return (
            <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <ShoppingBag size={60} style={{ color: '#ccc', marginBottom: '2rem' }} />
                <h2>No items to checkout</h2>
                <Link to="/hotels" style={{ color: '#ff7e5f', fontWeight: '600', marginTop: '1rem', display: 'inline-block' }}>Explore Hotels</Link>
            </div>
        );
    }

    return (
        <div className="checkout-page" style={{ padding: '4rem 2rem', backgroundColor: '#f9f9f9', minHeight: '90vh' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#636e72', textDecoration: 'none', marginBottom: '3rem', fontSize: '1.4rem', fontWeight: '500' }}>
                    <ChevronLeft size={20} /> Back to Cart
                </Link>

                <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
                    
                    {/* Left: Payment Form */}
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        style={{ backgroundColor: 'white', borderRadius: '24px', padding: '4rem', boxShadow: '0 4px 30px rgba(0,0,0,0.03)' }}
                    >
                        <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <CreditCard size={28} color="#ff7e5f" /> Payment Details
                        </h2>
                        <p style={{ color: '#636e72', marginBottom: '3rem', fontSize: '1.4rem' }}>Safe and secure payment powered by 2rism SecurePay.</p>

                        <form onSubmit={handlePayment} style={{ display: 'grid', gap: '2rem' }}>
                            <div className="form-item">
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: '#2d3436' }}>Cardholder Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your name" 
                                    required 
                                    style={{ width: '100%', padding: '1.4rem', borderRadius: '12px', border: '1px solid #e0e0e0', fontSize: '1.4rem', outline: 'none' }}
                                    value={cardDetails.name}
                                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                                />
                            </div>

                            <div className="form-item">
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: '#2d3436' }}>Card Number</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="text" 
                                        placeholder="0000 0000 0000 0000" 
                                        required 
                                        maxLength="16"
                                        style={{ width: '100%', padding: '1.4rem 1.4rem 1.4rem 4.5rem', borderRadius: '12px', border: '1px solid #e0e0e0', fontSize: '1.4rem', outline: 'none' }}
                                        value={cardDetails.number}
                                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                                    />
                                    <Lock size={18} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: '#95a5a6' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div className="form-item">
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: '#2d3436' }}>Expiry Date</label>
                                    <input 
                                        type="text" 
                                        placeholder="MM / YY" 
                                        required 
                                        maxLength="5"
                                        style={{ width: '100%', padding: '1.4rem', borderRadius: '12px', border: '1px solid #e0e0e0', fontSize: '1.4rem', outline: 'none' }}
                                        value={cardDetails.expiry}
                                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                    />
                                </div>
                                <div className="form-item">
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: '#2d3436' }}>CVC / CVV</label>
                                    <input 
                                        type="password" 
                                        placeholder="***" 
                                        required 
                                        maxLength="3"
                                        style={{ width: '100%', padding: '1.4rem', borderRadius: '12px', border: '1px solid #e0e0e0', fontSize: '1.4rem', outline: 'none' }}
                                        value={cardDetails.cvc}
                                        onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', backgroundColor: '#f0fff4', borderRadius: '12px', display: 'flex', gap: '1rem', border: '1px solid #c6f6d5', marginTop: '2rem' }}>
                                <ShieldCheck color="#27ae60" />
                                <p style={{ fontSize: '1.2rem', color: '#276749' }}>Your transaction is encrypted with 256-bit SSL security.</p>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{ 
                                    backgroundColor: '#2d3436', 
                                    color: 'white', 
                                    padding: '1.6rem', 
                                    borderRadius: '50px', 
                                    border: 'none', 
                                    fontWeight: '800', 
                                    fontSize: '1.6rem', 
                                    marginTop: '2rem', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                            >
                                {loading ? 'Processing Payment...' : <>Pay Now (${total}) <ArrowRight size={20} /></>}
                            </button>
                        </form>
                    </motion.div>

                    {/* Right: Summary */}
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        style={{ backgroundColor: '#2d3436', borderRadius: '24px', padding: '4rem', color: 'white', alignSelf: 'flex-start' }}
                    >
                        <h3 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>Summary</h3>
                        
                        <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem' }}>
                            {bookings.map(b => (
                                <div key={b.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <img src={b.hotel?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt="" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                                    <div style={{ flexGrow: 1 }}>
                                        <h4 style={{ fontSize: '1.4rem' }}>{b.hotel?.name}</h4>
                                        <div style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={12} /> {b.checkInDate}</span>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '700' }}>${b.totalPrice}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'grid', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
                                <span>Subtotal</span>
                                <span>${total}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
                                <span>Service Fee</span>
                                <span>$0</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2.2rem', fontWeight: '800', marginTop: '1rem' }}>
                                <span>Total</span>
                                <span style={{ color: '#ff7e5f' }}>${total}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                            <Clock size={20} color="#ff7e5f" />
                            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)' }}>Booking reserved for the next 15 minutes.</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
