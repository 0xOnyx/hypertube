package com.hypertube.auth.service;

import com.hypertube.auth.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender emailSender;

    @Value("${hypertube.email.from}")
    private String fromEmail;

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Value("${hypertube.email.verification.enabled:false}")
    private boolean emailVerificationEnabled;

    @Value("${MAIL_USERNAME:}")
    private String mailUsername;

    @Value("${MAIL_PASSWORD:}")
    private String mailPassword;

    public boolean isMailConfigured() {
        return emailVerificationEnabled && 
               emailSender != null && 
               mailUsername != null && !mailUsername.trim().isEmpty() && 
               mailPassword != null && !mailPassword.trim().isEmpty();
    }

    public void sendVerificationEmail(User user) {
        if (!isMailConfigured()) {
            System.out.println("⚠️ Email non configuré - Email de vérification ignoré pour: " + user.getEmail());
            return;
        }

        try {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject("Verify your Hypertube account");
        
        String verificationUrl = frontendUrl + "/verify-email?token=" + user.getEmailVerificationToken();
        
        String text = String.format(
            "Hello %s,\n\n" +
            "Please click the following link to verify your email address:\n" +
            "%s\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you didn't create an account with Hypertube, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The Hypertube Team",
            user.getFirstName(),
            verificationUrl
        );
        
        message.setText(text);
        emailSender.send(message);
            System.out.println("✅ Email de vérification envoyé à: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email de vérification: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(User user, String resetToken) {
        if (!isMailConfigured()) {
            System.out.println("⚠️ Email non configuré - Email de reset ignoré pour: " + user.getEmail());
            return;
        }

        try {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject("Reset your Hypertube password");
        
        String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
        
        String text = String.format(
            "Hello %s,\n\n" +
            "You requested to reset your password. Please click the following link:\n" +
            "%s\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you didn't request a password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The Hypertube Team",
            user.getFirstName(),
            resetUrl
        );
        
        message.setText(text);
        emailSender.send(message);
            System.out.println("✅ Email de reset envoyé à: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email de reset: " + e.getMessage());
        }
    }
} 
