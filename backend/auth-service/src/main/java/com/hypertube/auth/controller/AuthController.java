package com.hypertube.auth.controller;

import com.hypertube.auth.dto.*;
import com.hypertube.auth.entity.User;
import com.hypertube.auth.service.AuthService;
import com.hypertube.auth.service.TokenService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur REST pour l'authentification - refactorisé pour une meilleure maintenabilité
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final AuthService authService;
    private final TokenService tokenService;
    
    public AuthController(AuthService authService, TokenService tokenService) {
        this.authService = authService;
        this.tokenService = tokenService;
    }
    
    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.debug("Authentication request for: {}", loginRequest.getUsernameOrEmail());
        
        JwtResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        logger.debug("Registration request for: {}", signUpRequest.getUsername());
        
        MessageResponse response = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        logger.debug("Forgot password request for: {}", request.getEmail());
        
        MessageResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        logger.debug("Reset password request");
        
        MessageResponse response = authService.resetPassword(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam String token) {
        logger.debug("Email verification request");
        
        MessageResponse response = authService.verifyEmail(token);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh-token")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        logger.debug("Token refresh request");
        
        TokenRefreshResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/signout")
    public ResponseEntity<MessageResponse> logoutUser() {
        logger.debug("Logout request");
        
        MessageResponse response = authService.logoutUser();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<MessageResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Error: Unauthorized"));
        }
        
        String username = authentication.getName();
        logger.debug("User info request for: {}", username);
        
        return ResponseEntity.ok(new MessageResponse("User info: " + username));
    }
    
    @GetMapping("/validate")
    public ResponseEntity<MessageResponse> validateToken(@RequestParam String token) {
        logger.debug("Token validation request");
        
        if (tokenService.validateToken(token)) {
            String username = tokenService.getUsernameFromToken(token);
            User user = authService.findByUsername(username);
            
            return ResponseEntity.ok(new MessageResponse("Token valid for user: " + user.getUsername()));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Invalid token"));
    }
} 