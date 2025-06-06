package com.hypertube.auth.service;

import com.hypertube.auth.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Value("${hypertube.email.from}")
    private String fromEmail;

    @Value("${hypertube.frontend.url}")
    private String frontendUrl;

    public void sendVerificationEmail(User user) {
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
    }

    public void sendPasswordResetEmail(User user, String resetToken) {
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
    }
} 