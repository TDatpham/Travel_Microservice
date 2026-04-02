import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Image as ImageIcon, 
  MapPin, 
  Star, 
  DollarSign, 
  FileText, 
  Check,
  ChevronLeft,
  X,
  Save
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminAddHotelPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    rating: '5',
    description: '',
    type: 'Luxury',
    imageUrl: '',
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetch(`/api/v1/hotels/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            name: data.name || '',
            location: data.location || '',
            price: data.price?.toString() || '0',
            rating: data.rating?.toString() || '5',
            description: data.description || '',
            type: data.type || 'Luxury',
            imageUrl: data.imageUrl || '',
            images: []
          });
          if (data.imageUrl) setPreviewImages([data.imageUrl]);
        })
        .catch(err => {
          console.error("Error fetching hotel:", err);
          alert("Không thể tải thông tin khách sạn. Kiểm tra lại ID hoặc server.");
        });
    }
  }, [id, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };
  
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Preview images using object URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
    
    // Priority: Newest uploaded image becomes the primary imageUrl
    try {
      const base64Images = await Promise.all(files.map(f => fileToBase64(f)));
      setFormData(prev => {
        const updatedImages = [...prev.images, ...base64Images];
        return { 
          ...prev, 
          images: updatedImages,
          imageUrl: base64Images[0] // Make the newly uploaded image the primary one
        };
      });
    } catch (err) {
      console.error("Error encoding image:", err);
    }
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        imageUrl: prev.imageUrl === prev.images[index] ? (newImages[0] || '') : prev.imageUrl
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const price = parseFloat(formData.price);
    const rating = parseInt(formData.rating);

    if (isNaN(price) || price < 0) {
      alert("Vui lòng nhập giá hợp lệ!");
      setIsSubmitting(false);
      return;
    }

    try {
      const url = isEditing ? `/api/v1/hotels/${id}` : '/api/v1/hotels';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          price: price,
          rating: rating,
          description: formData.description,
          type: formData.type,
          imageUrl: formData.imageUrl
        })
      });

      if (response.ok) {
        setIsSubmitting(false);
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        let errorMessage = 'Failed to save hotel';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          const textError = await response.text();
          errorMessage = textError.substring(0, 100) || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi lưu khách sạn: ' + error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-header"
        >
          <button onClick={() => navigate(-1)} className="back-btn">
            <ChevronLeft size={20} />
            <span>Quay lại</span>
          </button>
          <h1 className="admin-title">{isEditing ? 'Chỉnh Sửa Khách Sạn' : 'Thêm Khách Sạn Mới'}</h1>
          <p className="admin-subtitle">
            {isEditing 
              ? `Đang cập nhật thông tin cho khách sạn ID: ${id}` 
              : 'Điền thông tin bên dưới để đăng tải khách sạn mới lên hệ thống Travel.'}
          </p>
        </motion.div>

        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="admin-form-card"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              
              {/* Left Column: Basic Info */}
              <div className="form-column">
                <div className="form-group">
                  <label><FileText size={18} /> Tên Khách Sạn</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="VD: Grand Luxe Resort & Spa"
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label><MapPin size={18} /> Địa Điểm</label>
                  <input 
                    type="text" 
                    name="location" 
                    placeholder="VD: Phú Quốc, Việt Nam"
                    value={formData.location}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label><DollarSign size={18} /> Giá Một Đêm ($)</label>
                    <input 
                      type="number" 
                      name="price" 
                      placeholder="VD: 250"
                      value={formData.price}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label><Star size={18} /> Đánh Giá</label>
                    <select 
                      name="rating" 
                      value={formData.rating}
                      onChange={handleInputChange}
                    >
                      <option value="5">5 Sao</option>
                      <option value="4">4 Sao</option>
                      <option value="3">3 Sao</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Mô Tả Chi Tiết</label>
                  <textarea 
                    name="description" 
                    rows="5"
                    placeholder="Hãy mô tả về khách sạn, tiện nghi và những điểm đặc biệt..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Right Column: Images & Meta */}
              <div className="form-column">
                <div className="form-group">
                  <label><ImageIcon size={18} /> Hình Ảnh Khách Sạn</label>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Hoặc nhập URL Hình Ảnh</label>
                    <input 
                      type="text" 
                      name="imageUrl" 
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="image-upload-zone">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      id="hotel-images"
                      className="hidden-input"
                    />
                    <label htmlFor="hotel-images" className="upload-placeholder">
                      <div className="upload-icon-circle">
                        <Plus size={24} />
                      </div>
                      <p>Nhấp để tải lên hoặc kéo thả ảnh</p>
                      <span>Hỗ trợ: JPEG, PNG, GIF (Tối đa 5MB)</span>
                    </label>
                  </div>

                  {/* Image Preview Grid */}
                  <div className="preview-grid">
                    {previewImages.map((src, idx) => (
                      <motion.div 
                        key={idx}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="preview-item"
                      >
                        <img src={src} alt={`Preview ${idx}`} />
                        <button type="button" onClick={() => removeImage(idx)} className="delete-img">
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Loại Hình Khách Sạn</label>
                  <div className="radio-group">
                    {['Luxury', 'Boutique', 'Resort', 'Budget'].map(type => (
                      <label key={type} className={`radio-item ${formData.type === type ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="type" 
                          value={type} 
                          checked={formData.type === type}
                          onChange={handleInputChange}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'loading' : ''} ${success ? 'success' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loader"></span>
                ) : success ? (
                  <>
                    <Check size={20} />
                    <span>Đã lưu thành công!</span>
                  </>
                ) : (
                  <>
                    {isEditing ? <Save size={20} /> : <Plus size={20} />}
                    <span>{isEditing ? 'Lưu Thay Đổi' : 'Thêm Khách Sạn'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-container {
          background-color: #fcfbff;
          min-height: 100vh;
        }

        .admin-header {
          margin-bottom: 4rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: none;
          border: none;
          color: #666;
          font-size: 1.4rem;
          cursor: pointer;
          margin-bottom: 2rem;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: var(--primary-color);
        }

        .admin-title {
          font-size: 3.2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .admin-subtitle {
          font-size: 1.6rem;
          color: #666;
        }

        .admin-form-card {
          background: white;
          border-radius: 24px;
          padding: 4rem;
          box-shadow: 0 10px 40px rgba(123, 97, 255, 0.05);
          border: 1px solid #f0f0f0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }

        .form-group {
          margin-bottom: 2.4rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 1.4rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
        }

        .form-group input, 
        .form-group select, 
        .form-group textarea {
          width: 100%;
          padding: 1.4rem 1.8rem;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
          background: #fdfdfd;
          font-family: inherit;
          font-size: 1.5rem;
          transition: all 0.2s;
          outline: none;
        }

        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(123, 97, 255, 0.1);
          background: #fff;
        }

        .form-row {
          display: flex;
          gap: 2rem;
        }

        .flex-1 { flex: 1; }

        .image-upload-zone {
          border: 2px dashed #d0d0d0;
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #fafafa;
        }

        .image-upload-zone:hover {
          border-color: var(--primary-color);
          background: rgba(123, 97, 255, 0.02);
        }

        .hidden-input {
          display: none;
        }

        .upload-icon-circle {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .upload-placeholder p {
          font-size: 1.5rem;
          font-weight: 500;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .upload-placeholder span {
          font-size: 1.2rem;
          color: #888;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 1.2rem;
          margin-top: 2rem;
        }

        .preview-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 10px;
          overflow: hidden;
        }

        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .delete-img {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .radio-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        .radio-item {
          padding: 1.2rem;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          font-size: 1.4rem;
          transition: all 0.2s;
        }

        .radio-item input {
          width: auto;
          margin: 0;
        }

        .radio-item.active {
          border-color: var(--primary-color);
          background: rgba(123, 97, 255, 0.05);
          color: var(--primary-color);
          font-weight: 600;
        }

        .form-actions {
          margin-top: 4rem;
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid #f0f0f0;
          padding-top: 3rem;
        }

        .submit-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 1.6rem 4rem;
          border-radius: 100px;
          font-size: 1.6rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          min-width: 220px;
          justify-content: center;
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(123, 97, 255, 0.3);
          background: #654cf6;
        }

        .submit-btn.success {
          background: #00c853;
        }

        .loader {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      ` }} />
    </div>
  );
};

export default AdminAddHotelPage;
