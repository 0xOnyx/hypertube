package com.hypertube.auth.service;

import com.hypertube.auth.entity.ERole;
import com.hypertube.auth.entity.User;
import com.hypertube.auth.repository.UserRepository;
import com.hypertube.auth.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        
        Map<String, Object> attributes = oauth2User.getAttributes();
        
        // Traiter l'utilisateur selon le provider
        User user = processOAuth2User(registrationId, attributes, userNameAttributeName);
        
        return UserDetailsImpl.create(user, attributes);
    }

    private User processOAuth2User(String registrationId, Map<String, Object> attributes, String userNameAttributeName) {
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, attributes);

        Optional<User> userOptional;

        if (userInfo.getEmail() == null || userInfo.getEmail().isEmpty()) {
            userOptional = userRepository.findByUsername(userInfo.getName());
        }
        else {
            userOptional = userRepository.findByEmail(userInfo.getEmail());
        }

        User user;
        
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getProvider().equals(registrationId)) {
                throw new OAuth2AuthenticationException("Looks like you're signed up with " +
                        user.getProvider() + " account. Please use your " + user.getProvider() +
                        " account to login.");
            }
            user = updateExistingUser(user, userInfo);
        } else {
            user = registerNewUser(registrationId, userInfo);
        }

        return userRepository.save(user);
    }

    private User registerNewUser(String registrationId, OAuth2UserInfo userInfo) {
        User user = new User();
        user.setProvider(registrationId);
        user.setProviderId(userInfo.getId());
        user.setUsername(userInfo.getName());
        user.setEmail(userInfo.getEmail()== null ? userInfo.getName() + "@hypertube.com": userInfo.getEmail());
        user.setFirstName(userInfo.getFirstName());
        user.setLastName(userInfo.getLastName());
        user.setProfilePicture(userInfo.getImageUrl());
        user.setEmailVerified(true); // OAuth emails are considered verified
        user.setRole(ERole.ROLE_USER);
        
        // Générer un mot de passe temporaire pour les utilisateurs OAuth2
        // Ce mot de passe ne sera jamais utilisé mais permet de satisfaire la contrainte @NotBlank
        String temporaryPassword = "OAUTH2_USER_" + UUID.randomUUID().toString();
        user.setPassword(passwordEncoder.encode(temporaryPassword));
        
        return user;
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo userInfo) {
        existingUser.setFirstName(userInfo.getFirstName());
        existingUser.setLastName(userInfo.getLastName());
        existingUser.setProfilePicture(userInfo.getImageUrl());
        return existingUser;
    }
} 