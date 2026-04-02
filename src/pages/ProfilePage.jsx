import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    Save, 
    AlertCircle, 
    Shield, 
    Camera, 
    AtSign, 
    Key, 
    Bell, 
    CheckCircle,
    UserCircle,
    Upload,
    X
} from 'lucide-react';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('profile');
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const fileInputRef = useRef(null);

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`/api/v1/auth/update-profile?currentEmail=${user.email}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    avatar: avatarPreview // Gửi chuỗi base64 lên server
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Backend trả về UserDto đã bao gồm avatar mới
                updateUser(data);
                setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Cập nhật thất bại.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Lỗi kết nối đến máy chủ.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Vui lòng chọn tệp hình ảnh.' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Kích thước ảnh phải dưới 5MB.' });
            return;
        }

        setAvatarUploading(true);
        const reader = new FileReader();
        reader.onload = (ev) => {
            const base64 = ev.target.result;
            setAvatarPreview(base64);
            setAvatarUploading(false);
            setShowAvatarModal(false);
            setMessage({ type: 'success', text: 'Đã chọn ảnh mới. Hãy nhấn "Update Profile" để lưu lại.' });
        };
        reader.onerror = () => {
            setAvatarUploading(false);
            setMessage({ type: 'error', text: 'Không thể đọc tệp ảnh.' });
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveAvatar = () => {
        setAvatarPreview(null);
        setShowAvatarModal(false);
        setMessage({ type: 'success', text: 'Đã gỡ ảnh. Hãy nhấn "Update Profile" để lưu lại.' });
    };

    const getInitials = (n) => n ? n.charAt(0).toUpperCase() : '?';

    const AvatarDisplay = ({ size = 80, fontSize = '2.8rem', showBorder = true }) => (
        <div style={{
            width: `${size}px`, height: `${size}px`, borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff7e5f, #654cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize, fontWeight: '700', overflow: 'hidden',
            border: showBorder ? '3px solid white' : 'none',
            boxShadow: showBorder ? '0 4px 15px rgba(101,76,246,0.3)' : 'none',
            flexShrink: 0
        }}>
            {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : getInitials(user?.name)
            }
        </div>
    );

    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/v1/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                setPasswords({ current: '', new: '', confirm: '' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Đổi mật khẩu thất bại.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Lỗi kết nối server.' });
        } finally {
            setLoading(false);
        }
    };

    const [userBookings, setUserBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    const fetchUserBookings = async () => {
        setBookingsLoading(true);
        try {
            const response = await fetch(`/api/v1/bookings/user?email=${user.email}`);
            if (response.ok) {
                const data = await response.json();
                setUserBookings(data);
            }
        } catch (err) {
            console.error("Error fetching bookings:", err);
        } finally {
            setBookingsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'bookings') {
            fetchUserBookings();
        }
    }, [activeTab]);

    const sidebarItems = [
        { id: 'profile', icon: User, label: 'Thông tin cá nhân' },
        { id: 'bookings', icon: Bell, label: 'Lịch sử đặt hàng' },
        { id: 'security', icon: Shield, label: 'Bảo mật & Mật khẩu' },
    ];

    return (
        <div className="profile-page" style={{ backgroundColor: '#fcfbff', minHeight: '100vh', padding: '6rem 2rem' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 style={{ fontSize: '3.2rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '4rem' }}>Cài đặt tài khoản</h1>

                    <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '4rem' }}>
                        
                        <aside style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', height: 'fit-content', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
                            <div style={{ padding: '0 1rem 2rem', borderBottom: '1px solid #f0f0f0', marginBottom: '2rem', textAlign: 'center' }}>
                                <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.5rem', cursor: 'pointer' }}
                                     onClick={() => setShowAvatarModal(true)}
                                     title="Thay đổi ảnh đại diện"
                                >
                                    <AvatarDisplay size={80} />
                                    <div style={{
                                        position: 'absolute', bottom: 0, right: 0,
                                        backgroundColor: '#654cf6', border: '2px solid white',
                                        borderRadius: '50%', padding: '0.5rem', color: 'white',
                                        cursor: 'pointer', boxShadow: '0 4px 10px rgba(101,76,246,0.4)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'transform 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <Camera size={13} />
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.2rem' }}>{user?.name}</h3>
                                <p style={{ fontSize: '1.2rem', color: '#888' }}>{user?.role} Account</p>
                                <button
                                    onClick={() => setShowAvatarModal(true)}
                                    style={{
                                        marginTop: '1rem', fontSize: '1.2rem', color: '#654cf6',
                                        background: 'rgba(101,76,246,0.06)', border: '1px solid rgba(101,76,246,0.15)',
                                        borderRadius: '20px', padding: '0.6rem 1.4rem', cursor: 'pointer',
                                        fontWeight: '600', transition: 'all 0.2s'
                                    }}
                                >
                                    Đổi ảnh
                                </button>
                            </div>
                            
                            <nav style={{ display: 'grid', gap: '0.8rem' }}>
                                {sidebarItems.map(item => (
                                    <button 
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        style={{ 
                                            display: 'flex', alignItems: 'center', gap: '1.2rem', 
                                            padding: '1.2rem 1.6rem', borderRadius: '12px', border: 'none', 
                                            background: activeTab === item.id ? 'rgba(101, 76, 246, 0.08)' : 'transparent',
                                            color: activeTab === item.id ? '#654cf6' : '#666',
                                            cursor: 'pointer', fontSize: '1.4rem',
                                            fontWeight: activeTab === item.id ? '700' : '500',
                                            transition: 'all 0.2s', textAlign: 'left'
                                        }}
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        <main style={{ backgroundColor: 'white', borderRadius: '24px', padding: '4rem', boxShadow: '0 4px 40px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
                            <AnimatePresence mode="wait">
                                {activeTab === 'profile' && (
                                    <motion.div
                                        key="profile"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #f5f5f5' }}>
                                            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowAvatarModal(true)}>
                                                <AvatarDisplay size={72} fontSize='2.4rem' />
                                                <div style={{
                                                    position: 'absolute', bottom: 0, right: 0,
                                                    backgroundColor: '#654cf6', border: '2px solid white',
                                                    borderRadius: '50%', padding: '0.4rem',
                                                    color: 'white', display: 'flex', cursor: 'pointer',
                                                    boxShadow: '0 2px 8px rgba(101,76,246,0.4)',
                                                }}>
                                                    <Camera size={12} />
                                                </div>
                                            </div>
                                            <div>
                                                <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '0.4rem' }}>Thông tin cá nhân</h2>
                                                <p style={{ color: '#888', fontSize: '1.4rem' }}>Cập nhật thông tin cơ bản và ảnh đại diện của bạn.</p>
                                            </div>
                                        </div>

                                        {message.text && (
                                            <motion.div 
                                                initial={{ scale: 0.95, opacity: 0 }} 
                                                animate={{ scale: 1, opacity: 1 }}
                                                style={{ 
                                                    padding: '1.5rem', borderRadius: '16px', marginBottom: '3rem', 
                                                    backgroundColor: message.type === 'success' ? '#f0fff4' : '#fff5f5',
                                                    color: message.type === 'success' ? '#276749' : '#c53030',
                                                    display: 'flex', alignItems: 'center', gap: '1.2rem',
                                                    border: `1px solid ${message.type === 'success' ? '#c6f6d5' : '#feb2b2'}`,
                                                    fontSize: '1.4rem'
                                                }}
                                            >
                                                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                                {message.text}
                                            </motion.div>
                                        )}

                                        <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '2.5rem', maxWidth: '500px' }}>
                                            <div className="input-field">
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                                                    <UserCircle size={18} color="#666" /> Họ và tên
                                                </label>
                                                <input 
                                                    type="text" value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required 
                                                    style={{ width: '100%', padding: '1.4rem 1.8rem', borderRadius: '14px', border: '1px solid #e2e2e2', fontSize: '1.4rem', outline: 'none', background: '#fdfdfd', boxSizing: 'border-box' }}
                                                />
                                            </div>

                                            <div className="input-field">
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                                                    <AtSign size={18} color="#666" /> Địa chỉ Email
                                                </label>
                                                <input 
                                                    type="email" value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required 
                                                    style={{ width: '100%', padding: '1.4rem 1.8rem', borderRadius: '14px', border: '1px solid #e2e2e2', fontSize: '1.4rem', outline: 'none', background: '#fdfdfd', boxSizing: 'border-box' }}
                                                />
                                            </div>

                                            <button 
                                                type="submit" 
                                                disabled={loading}
                                                style={{ 
                                                    backgroundColor: '#654cf6', color: 'white', 
                                                    padding: '1.6rem 3rem', borderRadius: '50px', border: 'none', 
                                                    fontWeight: '700', fontSize: '1.4rem', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                                    justifyContent: 'center', boxShadow: '0 8px 25px rgba(101, 76, 246, 0.3)',
                                                    marginTop: '1.5rem', width: 'fit-content'
                                                }}
                                            >
                                                {loading ? 'Đang xử lý...' : <><Save size={20} /> Cập nhật Profile</>}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {activeTab === 'bookings' && (
                                    <motion.div
                                        key="bookings"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '2.5rem' }}>Lịch sử đặt hàng</h2>
                                        {bookingsLoading ? <p>Đang tải...</p> : (
                                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                                {userBookings.length === 0 ? <p style={{ color: '#888' }}>Bạn chưa có đơn đặt hàng nào.</p> : (
                                                    userBookings.map(b => (
                                                        <div key={b.id} style={{ padding: '2rem', border: '1px solid #f0f0f0', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div>
                                                                <h4 style={{ fontWeight: '700', fontSize: '1.6rem' }}>{b.hotel?.name}</h4>
                                                                <p style={{ fontSize: '1.2rem', color: '#888' }}>{b.checkInDate} đến {b.checkOutDate}</p>
                                                                <p style={{ fontWeight: '700', color: '#654cf6', marginTop: '0.4rem' }}>${b.totalPrice}</p>
                                                            </div>
                                                            <div style={{ 
                                                                padding: '0.6rem 1.2rem', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '800',
                                                                backgroundColor: b.status === 'CONFIRMED' ? '#e6fffa' : (b.status === 'CANCELLED' ? '#fff5f5' : '#fffaf0'),
                                                                color: b.status === 'CONFIRMED' ? '#319795' : (b.status === 'CANCELLED' ? '#e53e3e' : '#d69e2e')
                                                            }}>
                                                                {b.status}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'security' && (
                                    <motion.div
                                        key="security"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '2.5rem' }}>Bảo mật tài khoản</h2>
                                        
                                        {message.text && (
                                            <div style={{ padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', backgroundColor: message.type === 'success' ? '#f0fff4' : '#fff5f5', color: message.type === 'success' ? '#276749' : '#c53030', fontSize: '1.4rem' }}>
                                                {message.text}
                                            </div>
                                        )}

                                        <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '2rem', maxWidth: '400px' }}>
                                            <div className="input-field">
                                                <label style={{ display: 'block', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.8rem' }}>Mật khẩu hiện tại</label>
                                                <input 
                                                    type="password" value={passwords.current}
                                                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '10px', border: '1px solid #ddd' }}
                                                    required
                                                />
                                            </div>
                                            <div className="input-field">
                                                <label style={{ display: 'block', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.8rem' }}>Mật khẩu mới</label>
                                                <input 
                                                    type="password" value={passwords.new}
                                                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '10px', border: '1px solid #ddd' }}
                                                    required
                                                />
                                            </div>
                                            <div className="input-field">
                                                <label style={{ display: 'block', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.8rem' }}>Xác nhận mật khẩu mới</label>
                                                <input 
                                                    type="password" value={passwords.confirm}
                                                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '10px', border: '1px solid #ddd' }}
                                                    required
                                                />
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={loading}
                                                style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '1.4rem', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer', marginTop: '1rem' }}
                                            >
                                                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </main>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showAvatarModal && (
                    <motion.div
                        key="avatar-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAvatarModal(false)}
                        style={{
                            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 9999, backdropFilter: 'blur(4px)'
                        }}
                    >
                        <motion.div
                            key="avatar-modal"
                            initial={{ opacity: 0, scale: 0.85, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            style={{
                                background: 'white', borderRadius: '28px',
                                padding: '4rem', width: '90%', maxWidth: '420px',
                                boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
                                textAlign: 'center', position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setShowAvatarModal(false)}
                                style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#f5f5f5', border: 'none', borderRadius: '50%', padding: '0.8rem', cursor: 'pointer', color: '#666', display: 'flex' }}
                            >
                                <X size={18} />
                            </button>

                            <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.8rem' }}>Ảnh đại diện</h3>
                            <p style={{ color: '#888', fontSize: '1.3rem', marginBottom: '3rem' }}>Chọn ảnh mới hoặc gỡ ảnh hiện tại.</p>

                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                                <AvatarDisplay size={120} fontSize="4rem" />
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarFileChange}
                            />

                            <div style={{ display: 'grid', gap: '1.2rem' }}>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={avatarUploading}
                                    style={{
                                        background: 'linear-gradient(135deg, #654cf6, #ff7e5f)',
                                        color: 'white', border: 'none', borderRadius: '16px',
                                        padding: '1.6rem 2rem', fontSize: '1.4rem', fontWeight: '700',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '1rem',
                                        boxShadow: '0 8px 25px rgba(101,76,246,0.35)',
                                    }}
                                >
                                    <Upload size={18} />
                                    {avatarUploading ? 'Đang tải...' : 'Tải lên ảnh mới'}
                                </button>

                                {avatarPreview && (
                                    <button
                                        onClick={handleRemoveAvatar}
                                        style={{
                                            background: '#fff5f5', color: '#c53030', border: '1px solid #feb2b2',
                                            borderRadius: '16px', padding: '1.4rem 2rem', fontSize: '1.4rem',
                                            fontWeight: '600', cursor: 'pointer', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', gap: '1rem',
                                        }}
                                    >
                                        <X size={16} />
                                        Gỡ ảnh hiện tại
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
