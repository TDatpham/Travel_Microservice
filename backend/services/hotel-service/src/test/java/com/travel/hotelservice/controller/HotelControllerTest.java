package com.travel.hotelservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travel.hotelservice.model.Hotel;
import com.travel.hotelservice.repository.HotelRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class HotelControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HotelRepository hotelRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllHotels() throws Exception {
        Hotel hotel1 = new Hotel();
        hotel1.setId(1L);
        hotel1.setName("Hotel One");

        Hotel hotel2 = new Hotel();
        hotel2.setId(2L);
        hotel2.setName("Hotel Two");

        when(hotelRepository.findAll()).thenReturn(Arrays.asList(hotel1, hotel2));

        mockMvc.perform(get("/api/v1/hotels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Hotel One"))
                .andExpect(jsonPath("$[1].name").value("Hotel Two"));
    }

    @Test
    public void testGetHotelById() throws Exception {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Premium Hotel");

        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));

        mockMvc.perform(get("/api/v1/hotels/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Premium Hotel"));
    }

    @Test
    public void testGetHotelById_NotFound() throws Exception {
        when(hotelRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/hotels/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testAddHotel() throws Exception {
        Hotel hotel = new Hotel();
        hotel.setName("New Hotel");
        hotel.setPrice(java.math.BigDecimal.valueOf(100.0));

        when(hotelRepository.save(any(Hotel.class))).thenReturn(hotel);

        mockMvc.perform(post("/api/v1/hotels")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(hotel)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Hotel"));
    }

    @Test
    public void testUpdateHotel() throws Exception {
        Hotel existingHotel = new Hotel();
        existingHotel.setId(1L);
        existingHotel.setName("Old Name");

        Hotel updatedDetails = new Hotel();
        updatedDetails.setName("New Name");

        when(hotelRepository.findById(1L)).thenReturn(Optional.of(existingHotel));
        when(hotelRepository.save(any(Hotel.class))).thenReturn(existingHotel);

        mockMvc.perform(put("/api/v1/hotels/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Name"));
    }

    @Test
    public void testDeleteHotel() throws Exception {
        when(hotelRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/v1/hotels/1"))
                .andExpect(status().isNoContent());
    }
}
