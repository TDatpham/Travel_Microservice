package com.travel.hotelservice;

import com.travel.hotelservice.model.Hotel;
import com.travel.hotelservice.repository.HotelRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.util.List;

@SpringBootApplication
@EnableDiscoveryClient
public class HotelServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HotelServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedData(HotelRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                List<Hotel> hotels = List.of(
                    Hotel.builder().name("Monastero Santa Rosa Hotel & Spa").location("Salerno, Italy").rating(5).price(new BigDecimal(350)).type("Spa").description("Luxury spa hotel").imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800").build(),
                    Hotel.builder().name("Grand Hotel Tremezzo").location("Lake Como, Italy").rating(4).price(new BigDecimal(500)).type("Hotel").description("Historic lakefront hotel").imageUrl("https://images.unsplash.com/photo-1586974726316-c6302de6a160?w=800").build(),
                    Hotel.builder().name("The Oberoi Udaivilas").location("Udaipur, India").rating(2).price(new BigDecimal(150)).type("Hotel").description("Elegant resort").imageUrl("https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800").build()
                );
                repository.saveAll(hotels);
                System.out.println("[Hotel-Service] Seeding successful!");
            }
        };
    }
}
