import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    Star, 
    Wifi, 
    Coffee, 
    Tv, 
    Wind, 
    ShieldCheck, 
    ChevronLeft, 
    Calendar, 
    Users,
    MessageSquare,
    Send,
    User as UserIcon,
    Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HotelDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Hotel Details
                const hotelRes = await fetch(`/api/v1/hotels/${id}`);
                const hotelData = await hotelRes.json();
                setHotel(hotelData);

                // Fetch Reviews
                const reviewsRes = await fetch(`/api/v1/reviews/hotel/${id}`);
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handlePostReview = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Vui lòng đăng nhập để bình luận!");
            return;
        }
        if (!newComment.trim()) return;

        setSubmittingReview(true);
        try {
            const res = await fetch('/api/v1/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hotelId: id,
                    userName: user.name,
                    userEmail: user.email,
                    userAvatar: user.avatar,
                    content: newComment,
                    rating: newRating
                })
            });

            if (res.ok) {
                const updatedReview = await res.json();
                setReviews([updatedReview, ...reviews]);
                setNewComment('');
                setNewRating(5);
            }
        } catch (err) {
            console.error("Error posting review:", err);
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
        try {
            const res = await fetch(`/api/v1/reviews/${reviewId}`, { method: 'DELETE' });
            if (res.ok) {
                setReviews(reviews.filter(r => r.id !== reviewId));
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #654cf6', borderRadius: '50%' }}></div>
            </motion.div>
        </div>
    );

    if (!hotel) return (
        <div style={{ textAlign: 'center', padding: '10rem' }}>
            <h2>Không tìm thấy khách sạn!</h2>
            <Link to="/hotels" style={{ color: '#654cf6', marginTop: '2rem', display: 'inline-block' }}>Quay lại danh sách</Link>
        </div>
    );

    return (
        <div className="hotel-detail-page" style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                
                {/* Header Navigation */}
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', fontWeight: '600', color: '#666' }}>
                        <ChevronLeft size={20} /> Quay lại trang trước
                    </button>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span style={{ backgroundColor: hotel.type === 'Luxury' ? '#fff7ed' : '#f0f9ff', color: hotel.type === 'Luxury' ? '#c2410c' : '#0369a1', padding: '0.6rem 1.4rem', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '700' }}>
                            {hotel.type}
                        </span>
                    </div>
                </div>

                <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '5rem' }}>
                    
                    {/* Left Column: Image & Details */}
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            style={{ borderRadius: '24px', overflow: 'hidden', height: '500px', marginBottom: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        >
                            <img 
                                src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'} 
                                alt={hotel.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        </motion.div>

                        <div style={{ marginBottom: '4rem' }}>
                            <h1 style={{ fontSize: '3.6rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '1.5rem', lineHeight: '1.2' }}>{hotel.name}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: '#666', fontSize: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MapPin size={18} color="#654cf6" /> {hotel.location}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Star size={18} fill="#ffb800" color="#ffb800" /> 
                                    {reviews.length > 0 
                                      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
                                      : hotel.rating}/5 ({reviews.length} đánh giá)
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '4rem', marginBottom: '4rem' }}>
                            <h3 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '2rem' }}>Mô tả khách sạn</h3>
                            <p style={{ fontSize: '1.6rem', lineHeight: '1.8', color: '#555', whiteSpace: 'pre-line' }}>{hotel.description}</p>
                        </div>

                        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '4rem' }}>
                            <h3 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '2.5rem' }}>Tiện ích nổi bật</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                {[
                                    { icon: Wifi, label: 'Free Wifi' },
                                    { icon: Coffee, label: 'Breakfast included' },
                                    { icon: Tv, label: 'Smart TV' },
                                    { icon: Wind, label: 'Air conditioning' },
                                    { icon: ShieldCheck, label: '24/7 Security' },
                                    { icon: Calendar, label: 'Booking flexible' }
                                ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.5rem', border: '1px solid #f0f0f0', borderRadius: '16px' }}>
                                        <item.icon size={20} color="#654cf6" />
                                        <span style={{ fontSize: '1.4rem', color: '#333', fontWeight: '600' }}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Card & Reviews */}
                    <aside>
                        {/* Booking Summary Box */}
                        <div style={{ position: 'sticky', top: '100px', backgroundColor: 'white', borderRadius: '24px', padding: '3.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0', marginBottom: '4rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                                <div>
                                    <p style={{ color: '#888', fontSize: '1.4rem', marginBottom: '0.5rem' }}>Giá từ</p>
                                    <p style={{ fontSize: '3rem', fontWeight: '800', color: '#654cf6' }}>${hotel.price} <span style={{ fontSize: '1.4rem', color: '#888', fontWeight: '400' }}>/ đêm</span></p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#27ae60', fontSize: '1.3rem', fontWeight: '700', background: '#ecfdf5', padding: '0.5rem 1rem', borderRadius: '8px' }}>Free Cancellation</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.6rem', background: '#f8f9ff', borderRadius: '14px' }}>
                                    <Calendar size={20} color="#654cf6" />
                                    <div>
                                        <p style={{ fontSize: '1.2rem', color: '#888' }}>Check-in / Out</p>
                                        <p style={{ fontSize: '1.4rem', fontWeight: '700' }}>Chọn ngày đặt phòng</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.6rem', background: '#f8f9ff', borderRadius: '14px' }}>
                                    <Users size={20} color="#654cf6" />
                                    <div>
                                        <p style={{ fontSize: '1.2rem', color: '#888' }}>Guests</p>
                                        <p style={{ fontSize: '1.4rem', fontWeight: '700' }}>2 Adults, 1 Child</p>
                                    </div>
                                </div>
                            </div>

                            <button style={{ width: '100%', padding: '1.8rem', background: 'linear-gradient(135deg, #654cf6, #8e78ff)', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.6rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 25px rgba(101,76,246,0.3)', transition: 'all 0.3s' }}>
                                Book your stay now
                            </button>
                            <p style={{ textAlign: 'center', color: '#888', fontSize: '1.3rem', marginTop: '2rem' }}>You won't be charged yet</p>
                        </div>

                        {/* Reviews Section */}
                        <div style={{ backgroundColor: '#fcfbff', borderRadius: '24px', padding: '3.5rem', border: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.5rem' }}>
                                <MessageSquare size={24} color="#654cf6" />
                                <h3 style={{ fontSize: '2rem', fontWeight: '800' }}>Đánh giá & Bình luận</h3>
                            </div>
                            
                            {/* Average Rating Summary */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', padding: '1.5rem 2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                <div style={{ textAlign: 'center', paddingRight: '2rem', borderRight: '1px solid #eee' }}>
                                    <p style={{ fontSize: '3.6rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
                                        {reviews.length > 0 
                                          ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
                                          : hotel.rating}
                                    </p>
                                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '0.5rem' }}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star 
                                                key={s} size={15} 
                                                fill={s <= (reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length) : hotel.rating) ? "#ffb800" : "none"} 
                                                color={s <= (reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length) : hotel.rating) ? "#ffb800" : "#ddd"} 
                                            />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '1.2rem', color: '#888', marginTop: '0.5rem' }}>{reviews.length} đánh giá</p>
                                </div>
                                <div style={{ flex: 1 }}>
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const count = reviews.filter(r => r.rating === star).length;
                                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                        return (
                                            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '1.2rem', color: '#666', width: '20px' }}>{star}★</span>
                                                <div style={{ flex: 1, height: '6px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${percentage}%`, height: '100%', background: '#ffb800' }}></div>
                                                </div>
                                                <span style={{ fontSize: '1.2rem', color: '#aaa', width: '30px' }}>{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Post Review Form */}
                            {user ? (
                                <form onSubmit={handlePostReview} style={{ marginBottom: '4rem', background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#654cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                            {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon color="white" size={20} />}
                                        </div>
                                        <div style={{ width: '100%' }}>
                                            <p style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>Viết trải nghiệm của bạn</p>
                                            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem' }}>
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star 
                                                        key={s} size={18} 
                                                        fill={s <= newRating ? "#ffb800" : "none"} 
                                                        color={s <= newRating ? "#ffb800" : "#ddd"} 
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setNewRating(s)}
                                                    />
                                                ))}
                                            </div>
                                            <textarea 
                                                value={newComment} onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Khách sạn thế nào?..."
                                                style={{ width: '100%', minHeight: '100px', padding: '1.5rem', borderRadius: '14px', border: '1px solid #eee', fontSize: '1.4rem', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                            />
                                            <button 
                                                type="submit" disabled={submittingReview}
                                                style={{ marginTop: '1.5rem', padding: '1rem 2.5rem', backgroundColor: '#654cf6', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.3rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(101,76,246,0.2)' }}
                                            >
                                                {submittingReview ? 'Gửi...' : <><Send size={16} /> Gửi bình luận</>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '20px', marginBottom: '4rem', border: '1px dashed #ddd' }}>
                                    <p style={{ fontSize: '1.4rem', color: '#666', marginBottom: '1.5rem' }}>Bạn cần đăng nhập để bình luận</p>
                                    <Link to="/signin" style={{ display: 'inline-block', padding: '1rem 2.5rem', border: '2px solid #654cf6', color: '#654cf6', borderRadius: '50px', fontWeight: '700', textDecoration: 'none', fontSize: '1.3rem' }}>Đăng nhập ngay</Link>
                                </div>
                            )}

                            {/* Reviews List */}
                            <div style={{ display: 'grid', gap: '2rem' }}>
                                {reviews.length > 0 ? reviews.map(review => (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        key={review.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '2rem' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                    {review.userAvatar ? <img src={review.userAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon color="#999" size={18} />}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '1.4rem', fontWeight: '700' }}>{review.userName}</p>
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <Star key={s} size={12} fill={s <= review.rating ? "#ffb800" : "none"} color={s <= review.rating ? "#ffb800" : "#ddd"} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {(user && (user.email === review.userEmail || user.role === 'ADMIN')) && (
                                                <button onClick={() => handleDeleteReview(review.id)} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '1.4rem', color: '#555', lineHeight: '1.6' }}>{review.content}</p>
                                        <p style={{ fontSize: '1.1rem', color: '#aaa', marginTop: '0.8rem' }}>
                                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </motion.div>
                                )) : (
                                    <p style={{ textAlign: 'center', color: '#aaa', padding: '2rem', fontSize: '1.4rem' }}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                                )}
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
};

export default HotelDetailPage;
