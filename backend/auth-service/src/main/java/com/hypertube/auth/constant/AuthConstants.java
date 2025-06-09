package com.hypertube.auth.constant;

/**
 * Constantes pour le service d'authentification
 */
public final class AuthConstants {
    
    // Codes d'erreur
    public static final String USER_NOT_FOUND = "USER_NOT_FOUND";
    public static final String USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS";
    public static final String EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS";
    public static final String INVALID_TOKEN = "INVALID_TOKEN";
    public static final String TOKEN_EXPIRED = "TOKEN_EXPIRED";
    public static final String INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
    
    // Messages d'erreur
    public static final String MSG_USERNAME_TAKEN = "Username is already taken!";
    public static final String MSG_EMAIL_IN_USE = "Email is already in use!";
    public static final String MSG_USER_NOT_FOUND_USERNAME = "User not found with username: %s";
    public static final String MSG_USER_NOT_FOUND_EMAIL = "User not found with email: %s";
    public static final String MSG_INVALID_VERIFICATION_TOKEN = "Invalid verification token";
    public static final String MSG_VERIFICATION_TOKEN_EXPIRED = "Email verification token has expired";
    public static final String MSG_INVALID_RESET_TOKEN = "Invalid password reset token";
    public static final String MSG_RESET_TOKEN_EXPIRED = "Password reset token has expired";
    public static final String MSG_REFRESH_TOKEN_NOT_FOUND = "Refresh token is not in database!";
    public static final String MSG_REFRESH_TOKEN_EXPIRED = "Refresh token was expired. Please make a new signin request";
    
    // Messages de succès
    public static final String MSG_USER_REGISTERED_EMAIL_ENABLED = "User registered successfully! Please check your email to verify your account.";
    public static final String MSG_USER_REGISTERED_EMAIL_DISABLED = "User registered successfully! Email verification disabled.";
    public static final String MSG_EMAIL_VERIFIED = "Email verified successfully!";
    public static final String MSG_PASSWORD_RESET_EMAIL_SENT = "Password reset email sent!";
    public static final String MSG_PASSWORD_RESET_SUCCESS = "Password reset successfully!";
    public static final String MSG_LOGOUT_SUCCESS = "Log out successful!";
    
    // Durées (en jours)
    public static final int EMAIL_VERIFICATION_EXPIRY_DAYS = 1;
    public static final int PASSWORD_RESET_EXPIRY_HOURS = 24;
    public static final int REFRESH_TOKEN_EXPIRY_DAYS = 30;
    
    private AuthConstants() {
        // Empêcher l'instanciation
    }
} 