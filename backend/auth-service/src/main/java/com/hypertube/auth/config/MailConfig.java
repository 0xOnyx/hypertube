package com.hypertube.auth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Value("${MAIL_HOST:smtp.gmail.com}")
    private String host;

    @Value("${MAIL_PORT:587}")
    private int port;

    @Value("${MAIL_USERNAME:}")
    private String username;

    @Value("${MAIL_PASSWORD:}")
    private String password;

    @Bean
    @ConditionalOnProperty(name = "hypertube.email.verification.enabled", havingValue = "true", matchIfMissing = false)
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        // Seulement configurer si username et password sont fournis
        if (username != null && !username.trim().isEmpty() && 
            password != null && !password.trim().isEmpty()) {
            
            mailSender.setHost(host);
            mailSender.setPort(port);
            mailSender.setUsername(username);
            mailSender.setPassword(password);

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.debug", "false");
        }
        
        return mailSender;
    }

    @Bean
    @ConditionalOnProperty(name = "hypertube.email.verification.enabled", havingValue = "false", matchIfMissing = true)
    public JavaMailSender dummyMailSender() {
        // Retourner un sender factice si l'email n'est pas activé
        return new JavaMailSenderImpl();
    }

    public boolean isMailConfigured() {
        return username != null && !username.trim().isEmpty() && 
               password != null && !password.trim().isEmpty();
    }
} 