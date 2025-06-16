package com.hypertube.auth.service;

import com.hypertube.auth.constant.AuthConstants;
import com.hypertube.auth.dto.*;
import com.hypertube.auth.entity.ERole;
import com.hypertube.auth.entity.User;
import com.hypertube.auth.entity.UserSession;
import com.hypertube.auth.exception.AuthException;
import com.hypertube.auth.repository.UserRepository;
import com.hypertube.auth.security.UserDetailsImpl;
import com.hypertube.auth.security.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service principal d'authentification refactorisé pour une meilleure maintenabilité
 */
@Service
@Transactional
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final TokenService tokenService;
    private final UserValidationService userValidationService;
    private final JwtUtils jwtUtils;
    
    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            TokenService tokenService,
            UserValidationService userValidationService,
            JwtUtils jwtUtils) {
        
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.tokenService = tokenService;
        this.userValidationService = userValidationService;
        this.jwtUtils = jwtUtils;
    }
    
    /**
     * Authentifie un utilisateur et génère les tokens
     */
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        logger.debug("Authenticating user: {}", loginRequest.getUsernameOrEmail());
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsernameOrEmail(), 
                    loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        String jwt = jwtUtils.generateJwtToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);
        
        logger.info("User {} authenticated successfully", userDetails.getUsername());
        
        return new JwtResponse(
            jwt,
            refreshToken,
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList())
        );
    }
    
    /**
     * Enregistre un nouveau utilisateur
     */
    public MessageResponse registerUser(SignupRequest signUpRequest) {
        logger.debug("Registering new user: {}", signUpRequest.getUsername());
        
        // Validation
        userValidationService.validateUserRegistration(
            signUpRequest.getUsername(), 
            signUpRequest.getEmail()
        );
        
        // Création de l'utilisateur
        User user = createNewUser(signUpRequest);
        configureEmailVerification(user);
        
        userRepository.save(user);
        
        // Envoi email si configuré
        boolean isEmailConfigured = emailService.isMailConfigured();
        if (isEmailConfigured) {
            emailService.sendVerificationEmail(user);
            logger.info("User {} registered with email verification", user.getUsername());
            return new MessageResponse(AuthConstants.MSG_USER_REGISTERED_EMAIL_ENABLED);
        } else {
            logger.info("User {} registered without email verification", user.getUsername());
            return new MessageResponse(AuthConstants.MSG_USER_REGISTERED_EMAIL_DISABLED);
        }
    }
    
    /**
     * Renouvelle un access token à partir d'un refresh token
     */
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        logger.debug("Refreshing token");
        
        String newAccessToken = tokenService.renewAccessToken(request.getRefreshToken());
        
        return new TokenRefreshResponse(newAccessToken, request.getRefreshToken());
    }
    
    /**
     * Déconnecte un utilisateur
     */
    public MessageResponse logoutUser() {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        tokenService.deactivateAllUserSessions(userDetails.getId());
        
        logger.info("User {} logged out", userDetails.getUsername());
        return new MessageResponse(AuthConstants.MSG_LOGOUT_SUCCESS);
    }
    
    /**
     * Vérifie l'email d'un utilisateur
     */
    public MessageResponse verifyEmail(String token) {
        logger.debug("Verifying email with token");
        
        User user = userValidationService.findUserByEmailVerificationToken(token);
        
        if (user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new AuthException(
                AuthConstants.MSG_VERIFICATION_TOKEN_EXPIRED, 
                AuthConstants.TOKEN_EXPIRED
            );
        }
        
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);
        userRepository.save(user);
        
        logger.info("Email verified for user: {}", user.getUsername());
        return new MessageResponse(AuthConstants.MSG_EMAIL_VERIFIED);
    }
    
    /**
     * Initie la procédure de mot de passe oublié
     */
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        logger.debug("Processing forgot password for email: {}", request.getEmail());
        
        User user = userValidationService.findUserByEmail(request.getEmail());
        
        String resetToken = tokenService.generatePasswordResetToken();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(AuthConstants.PASSWORD_RESET_EXPIRY_HOURS));
        userRepository.save(user);
        
        emailService.sendPasswordResetEmail(user, resetToken);
        
        logger.info("Password reset email sent to: {}", request.getEmail());
        return new MessageResponse(AuthConstants.MSG_PASSWORD_RESET_EMAIL_SENT);
    }
    
    /**
     * Réinitialise le mot de passe d'un utilisateur
     */
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        logger.debug("Resetting password");
        
        User user = userValidationService.findUserByPasswordResetToken(request.getToken());
        
        if (user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new AuthException(
                AuthConstants.MSG_RESET_TOKEN_EXPIRED, 
                AuthConstants.TOKEN_EXPIRED
            );
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
        
        // Déconnecter toutes les sessions
        tokenService.deactivateAllUserSessions(user.getId());
        
        logger.info("Password reset successfully for user: {}", user.getUsername());
        return new MessageResponse(AuthConstants.MSG_PASSWORD_RESET_SUCCESS);
    }
    
    /**
     * Trouve un utilisateur par nom d'utilisateur
     */
    public User findByUsername(String username) {
        return userValidationService.findUserByUsername(username);
    }
    
    // Méthodes utilitaires privées
    
    private User createNewUser(SignupRequest signUpRequest) {
        return new User(
            signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            passwordEncoder.encode(signUpRequest.getPassword()),
            signUpRequest.getFirstName(),
            signUpRequest.getLastName()
        );
    }
    
    private void configureEmailVerification(User user) {
        boolean isEmailConfigured = emailService.isMailConfigured();
        
        if (isEmailConfigured) {
            user.setEmailVerificationToken(tokenService.generateEmailVerificationToken());
            user.setEmailVerificationTokenExpiry(
                LocalDateTime.now().plusDays(AuthConstants.EMAIL_VERIFICATION_EXPIRY_DAYS)
            );
            user.setEmailVerified(false);
        } else {
            user.setEmailVerified(true);
            user.setEmailVerificationToken(null);
            user.setEmailVerificationTokenExpiry(null);
        }
        
        user.setLanguage(user.getLanguage() != null ? user.getLanguage() : "en");
        user.setRole(ERole.ROLE_USER);
    }
    
    private UserDetailsImpl getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }
} 