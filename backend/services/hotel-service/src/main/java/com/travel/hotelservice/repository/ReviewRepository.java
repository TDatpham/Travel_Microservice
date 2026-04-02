package com.travel.hotelservice.repository;

import com.travel.hotelservice.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByHotelId(Long hotelId);
    List<Review> findByHotelIdOrderByCreatedAtDesc(Long hotelId);
}
