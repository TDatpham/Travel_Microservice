package com.travel.authservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import com.travel.authservice.model.User;
import com.travel.authservice.repository.UserRepository;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedAdmin(UserRepository userRepository) {
        return args -> {
            if (!userRepository.existsByEmail("admin@travel.com")) {
                User admin = User.builder()
                        .email("admin@travel.com")
                        .password("admin123") // Should be hashed in real app
                        .name("System Admin")
                        .role(User.Role.ADMIN)
                        .build();
                userRepository.save(admin);
                System.out.println("SEED: Default admin user (admin@travel.com / admin123) created.");
            }
        };
    }
}
