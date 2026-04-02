package com.travel.hotelservice.controller;

import com.travel.hotelservice.model.Hotel;
import com.travel.hotelservice.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hotels")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class HotelController {

    private final HotelRepository hotelRepository;

    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addHotel(@RequestBody Hotel hotel) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(hotelRepository.save(hotel));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return hotelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotelDetails) {
        try {
            return hotelRepository.findById(id)
                    .map(hotel -> {
                        hotel.setName(hotelDetails.getName());
                        hotel.setLocation(hotelDetails.getLocation());
                        hotel.setPrice(hotelDetails.getPrice());
                        hotel.setRating(hotelDetails.getRating());
                        hotel.setDescription(hotelDetails.getDescription());
                        hotel.setType(hotelDetails.getType());
                        hotel.setImageUrl(hotelDetails.getImageUrl());
                        return ResponseEntity.ok(hotelRepository.save(hotel));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        if (!hotelRepository.existsById(id)) return ResponseEntity.notFound().build();
        hotelRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
