package com.hypertube.auth.service;

import com.hypertube.auth.constant.AuthConstants;
import com.hypertube.auth.entity.User;
import com.hypertube.auth.entity.UserSession;
import com.hypertube.auth.exception.AuthException;
import com.hypertube.auth.repository.UserSessionRepository;
import com.hypertube.auth.security.JwtUtils;
import com.hypertube.auth.security.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service spécialisé pour la gestion des tokens et sessions
 */
@Service
@Transactional
public class TokenService {
    
    private static final Logger logger = LoggerFactory.getLogger(TokenService.class);
    
    private final UserSessionRepository sessionRepository;
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;
    
    public TokenService(UserSessionRepository sessionRepository, JwtUtils jwtUtils, UserDetailsService userDetailsService) {
        this.sessionRepository = sessionRepository;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }
    
    /**
     * Crée une nouvelle session utilisateur avec refresh token
     */
    public UserSession createUserSession(User user) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(user.getUsername());
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(AuthConstants.REFRESH_TOKEN_EXPIRY_DAYS);
        
        UserSession session = new UserSession(user, refreshToken, expiresAt);
        sessionRepository.save(session);
        
        logger.debug("Created new session for user: {}", user.getUsername());
        return session;
    }
    
    /**
     * Génère un nouveau JWT pour l'utilisateur
     */
    public String generateAccessToken(String username) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(username);
        return jwtUtils.generateJwtToken(userDetails);
    }
    
    /**
     * Valide et renouvelle un refresh token
     */
    public String renewAccessToken(String refreshToken) {
        UserSession session = sessionRepository.findByToken(refreshToken)
                .orElseThrow(() -> new AuthException(
                    AuthConstants.MSG_REFRESH_TOKEN_NOT_FOUND, 
                    AuthConstants.INVALID_TOKEN
                ));
        
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            sessionRepository.delete(session);
            throw new AuthException(
                AuthConstants.MSG_REFRESH_TOKEN_EXPIRED, 
                AuthConstants.TOKEN_EXPIRED
            );
        }
        
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(session.getUser().getUsername());
        String newAccessToken = jwtUtils.generateJwtToken(userDetails);
        logger.debug("Renewed access token for user: {}", session.getUser().getUsername());
        
        return newAccessToken;
    }
    
    /**
     * Génère un token de vérification email
     */
    public String generateEmailVerificationToken() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Génère un token de réinitialisation de mot de passe
     */
    public String generatePasswordResetToken() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Désactive toutes les sessions d'un utilisateur
     */
    public void deactivateAllUserSessions(Long userId) {
        sessionRepository.deactivateAllUserSessions(userId);
        logger.debug("Deactivated all sessions for user ID: {}", userId);
    }
    
    /**
     * Valide un JWT token
     */
    public boolean validateToken(String token) {
        return jwtUtils.validateJwtToken(token);
    }
    
    /**
     * Extrait le nom d'utilisateur d'un JWT token
     */
    public String getUsernameFromToken(String token) {
        return jwtUtils.getUserNameFromJwtToken(token);
    }
} 