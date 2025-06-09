package com.hypertube.auth.service;

import com.hypertube.auth.constant.AuthConstants;
import com.hypertube.auth.entity.User;
import com.hypertube.auth.exception.AuthException;
import com.hypertube.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service spécialisé pour la validation des utilisateurs
 */
@Service
public class UserValidationService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserValidationService.class);
    
    private final UserRepository userRepository;
    
    public UserValidationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * Valide qu'un nom d'utilisateur n'existe pas déjà
     */
    public void validateUsernameNotExists(String username) {
        if (userRepository.existsByUsername(username)) {
            logger.warn("Attempt to register with existing username: {}", username);
            throw new AuthException(AuthConstants.MSG_USERNAME_TAKEN, AuthConstants.USER_ALREADY_EXISTS);
        }
    }
    
    /**
     * Valide qu'un email n'existe pas déjà
     */
    public void validateEmailNotExists(String email) {
        if (userRepository.existsByEmail(email)) {
            logger.warn("Attempt to register with existing email: {}", email);
            throw new AuthException(AuthConstants.MSG_EMAIL_IN_USE, AuthConstants.EMAIL_ALREADY_EXISTS);
        }
    }
    
    /**
     * Valide les données d'enregistrement d'un utilisateur
     */
    public void validateUserRegistration(String username, String email) {
        validateUsernameNotExists(username);
        validateEmailNotExists(email);
    }
    
    /**
     * Trouve un utilisateur par nom d'utilisateur ou lève une exception
     */
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("User not found with username: {}", username);
                    return new AuthException(
                        String.format(AuthConstants.MSG_USER_NOT_FOUND_USERNAME, username), 
                        AuthConstants.USER_NOT_FOUND
                    );
                });
    }
    
    /**
     * Trouve un utilisateur par email ou lève une exception
     */
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found with email: {}", email);
                    return new AuthException(
                        String.format(AuthConstants.MSG_USER_NOT_FOUND_EMAIL, email), 
                        AuthConstants.USER_NOT_FOUND
                    );
                });
    }
    
    /**
     * Trouve un utilisateur par token de vérification email
     */
    public User findUserByEmailVerificationToken(String token) {
        return userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> {
                    logger.warn("Invalid email verification token used");
                    return new AuthException(
                        AuthConstants.MSG_INVALID_VERIFICATION_TOKEN, 
                        AuthConstants.INVALID_TOKEN
                    );
                });
    }
    
    /**
     * Trouve un utilisateur par token de réinitialisation de mot de passe
     */
    public User findUserByPasswordResetToken(String token) {
        return userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> {
                    logger.warn("Invalid password reset token used");
                    return new AuthException(
                        AuthConstants.MSG_INVALID_RESET_TOKEN, 
                        AuthConstants.INVALID_TOKEN
                    );
                });
    }
} 