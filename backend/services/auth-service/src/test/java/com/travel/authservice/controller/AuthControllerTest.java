package com.travel.authservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travel.authservice.dto.LoginRequest;
import com.travel.authservice.dto.RegisterRequest;
import com.travel.authservice.model.User;
import com.travel.authservice.repository.UserRepository;
import com.travel.authservice.util.JwtUtility;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtUtility jwtUtility;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testRegister_Success() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");
        request.setName("Test User");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(jwtUtility.generateToken(any(User.class))).thenReturn("fake-token");

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("fake-token"))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    public void testRegister_ExistingEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email đã tồn tại"));
    }

    @Test
    public void testLogin_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("password123");

        User user = User.builder()
                .email("user@example.com")
                .password("password123")
                .name("Test User")
                .role(User.Role.USER)
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(jwtUtility.generateToken(any(User.class))).thenReturn("access-token");
        when(jwtUtility.generateRefreshToken(any(User.class))).thenReturn("refresh-token");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token"))
                .andExpect(jsonPath("$.refreshToken").value("refresh-token"))
                .andExpect(jsonPath("$.user.name").value("Test User"));
    }

    @Test
    public void testLogin_WrongPassword() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("wrong-password");

        User user = User.builder()
                .email("user@example.com")
                .password("correct-password")
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Mật khẩu không đúng"));
    }

    @Test
    public void testGetCurrentUser_Success() throws Exception {
        User user = User.builder()
                .email("user@example.com")
                .name("Test User")
                .role(User.Role.USER)
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/v1/auth/me")
                .param("email", "user@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.name").value("Test User"));
    }
}
