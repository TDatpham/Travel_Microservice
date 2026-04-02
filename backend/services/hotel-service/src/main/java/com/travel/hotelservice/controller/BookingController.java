package com.travel.hotelservice.controller;

import com.travel.hotelservice.model.Booking;
import com.travel.hotelservice.model.Hotel;
import com.travel.hotelservice.repository.BookingRepository;
import com.travel.hotelservice.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        if (booking.getHotel() != null && booking.getHotel().getId() != null) {
            Hotel hotel = hotelRepository.findById(booking.getHotel().getId()).orElse(null);
            if (hotel == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hotel not found");
            }
            booking.setHotel(hotel);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingRepository.save(booking));
    }

    @GetMapping("/user")
    public List<Booking> getUserBookings(@RequestParam String email, @RequestParam(required = false) String status) {
        if (status != null) {
            return bookingRepository.findByUserEmailAndStatus(email, status);
        }
        return bookingRepository.findByUserEmail(email);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        if (!bookingRepository.existsById(id)) return ResponseEntity.notFound().build();
        bookingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    booking.setStatus(status);
                    return ResponseEntity.ok(bookingRepository.save(booking));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
