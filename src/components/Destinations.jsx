import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const destinations = [
  { id: 1, title: 'Big sur', location: 'Califonia USA', img: 'https://images.unsplash.com/photo-1581790061118-2cd9a40164b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2071&q=80' },
  { id: 2, title: 'Prescott', location: 'Arizona, USA', img: 'https://images.unsplash.com/photo-1527824404775-dce343118ebc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80' },
  { id: 3, title: 'Fort Mayers', location: 'Florida, USA', img: 'https://images.unsplash.com/photo-1512936702668-1ab037aced2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80' },
  { id: 4, title: 'Tucson', location: 'Arizona, USA', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=1121&q=80' },
  { id: 5, title: 'St. Joseph', location: 'Michigan, USA', img: 'https://images.unsplash.com/photo-1601425262040-ba23fe84f701?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80' },
  { id: 6, title: 'Madrid', location: 'Spain', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80' },
  { id: 7, title: 'Senja Island', location: 'Norway', img: 'https://images.unsplash.com/photo-1542321993-8fc36217e26d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80' },
  { id: 8, title: 'Eiffel Tower', location: 'Paris France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1173&q=80' },
];

const Destinations = () => {
  return (
    <section className="destinations" id="destinations">
      <div className="container">
        <h2 className="section-title">Popular Destinations</h2>
        
        <Swiper
          spaceBetween={10}
          slidesPerView={2}
          loop={true}
          breakpoints={{
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
          }}
        >
          {destinations.map((dest) => (
            <SwiperSlide key={dest.id}>
              <div className="destination-card">
                <img src={dest.img} alt={dest.title} width="203" height="181" />
                <h5>{dest.title}</h5>
                <h6>{dest.location}</h6>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Destinations;
