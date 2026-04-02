package com.travel.authservice.security;

import com.travel.authservice.model.User;
import com.travel.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture"); // Google avatar

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        // Save or update user in our database
        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;
        if (userOpt.isEmpty()) {
            user = User.builder()
                    .email(email)
                    .name(name)
                    .password("OAUTH2_USER") // Placeholder
                    .role(User.Role.USER)
                    .avatar(picture) 
                    .build();
            userRepository.save(user);
        } else {
            user = userOpt.get();
            // Update name or avatar if changed
            user.setName(name);
            if (picture != null) user.setAvatar(picture);
            userRepository.save(user);
        }

        return oauth2User;
    }
}
