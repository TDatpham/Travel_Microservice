package com.travel.authservice.controller;

import com.travel.authservice.dto.AuthResponse;
import com.travel.authservice.dto.LoginRequest;
import com.travel.authservice.dto.RegisterRequest;
import com.travel.authservice.dto.UpdateProfileRequest;
import com.travel.authservice.model.User;
import com.travel.authservice.repository.UserRepository;
import com.travel.authservice.util.JwtUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtility jwtUtility;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email đã tồn tại"));
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .name(request.getName())
                .role(User.Role.USER)
                .build();

        userRepository.save(user);

        String accessToken = jwtUtility.generateToken(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            AuthResponse.builder()
                .accessToken(accessToken)
                .user(AuthResponse.UserDto.builder()
                        .email(user.getEmail())
                        .name(user.getName())
                        .role("USER")
                        .avatar(user.getAvatar())
                        .build())
                .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email không tồn tại"));
        }
        User user = userOpt.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Mật khẩu không đúng"));
        }

        String accessToken = jwtUtility.generateToken(user);
        String refreshToken = jwtUtility.generateRefreshToken(user);

        return ResponseEntity.ok(
            AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(AuthResponse.UserDto.builder()
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole().name())
                        .avatar(user.getAvatar())
                        .build())
                .build()
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(AuthResponse.UserDto.builder()
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole().name())
                        .avatar(user.getAvatar())
                        .build()))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request,
                                            @RequestParam String currentEmail) {
        Optional<User> userOpt = userRepository.findByEmail(currentEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User không tồn tại"));
        }

        User user = userOpt.get();
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(currentEmail)) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Email đã được sử dụng"));
            }
            user.setEmail(request.getEmail());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
 
        userRepository.save(user);
 
        return ResponseEntity.ok(AuthResponse.UserDto.builder()
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .avatar(user.getAvatar())
                .build());
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User không tồn tại"));
        }

        User user = userOpt.get();
        // Skip currentPassword check if user logged in via OAuth2 (password is OAUTH2_USER)
        if (!user.getPassword().equals("OAUTH2_USER") && !user.getPassword().equals(currentPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Mật khẩu hiện tại không đúng"));
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
    }
    public void oauth2Success(org.springframework.security.core.Authentication authentication, 
                             jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        org.springframework.security.oauth2.core.user.OAuth2User principal = (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();
        
        String email = principal.getAttribute("email");
        
        // CustomOAuth2UserService should have saved or updated the user
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.sendRedirect("http://localhost:3000/signin?error=user_not_found");
            return;
        }
        User user = userOpt.get();
        
        String token = jwtUtility.generateToken(user);
        String name = user.getName();
        String avatar = user.getAvatar();

        String redirectUrl = String.format("http://localhost:3000/signin?token=%s&email=%s&name=%s&avatar=%s", 
                                          token, 
                                          java.net.URLEncoder.encode(email, "UTF-8"), 
                                          java.net.URLEncoder.encode(name, "UTF-8"), 
                                          java.net.URLEncoder.encode(avatar, "UTF-8"));
        
        // Using JavaScript redirect to bypass Chrome's cross-origin redirect restrictions
        response.setContentType("text/html");
        response.getWriter().write("<html><script>window.location.href='" + redirectUrl + "';</script></html>");
    }

    @GetMapping("/oauth2/failure")
    public void oauth2Failure(jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        String redirectUrl = "http://localhost:3000/signin?error=social_failed";
        response.setContentType("text/html");
        response.getWriter().write("<html><script>window.location.href='" + redirectUrl + "';</script></html>");
    }
}
