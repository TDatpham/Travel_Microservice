package com.travel.hotelservice.repository;

import com.travel.hotelservice.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserEmailAndStatus(String userEmail, String status);
    List<Booking> findByUserEmail(String userEmail);
}
