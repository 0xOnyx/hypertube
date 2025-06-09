package com.hypertube.auth.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import jakarta.annotation.PostConstruct;

/**
 * Configuration centralisée du logging pour améliorer la traçabilité
 */
@Configuration
public class LoggingConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingConfig.class);
    
    private final Environment environment;
    
    public LoggingConfig(Environment environment) {
        this.environment = environment;
    }
    
    @PostConstruct
    public void logConfiguration() {
        String[] activeProfiles = environment.getActiveProfiles();
        
        logger.info("=== HYPERTUBE AUTH SERVICE STARTED ===");
        logger.info("Active profiles: {}", String.join(", ", activeProfiles));
        logger.info("Server port: {}", environment.getProperty("server.port", "8081"));
        logger.info("Database URL: {}", environment.getProperty("spring.datasource.url", "Not configured"));
        logger.info("Redis host: {}", environment.getProperty("spring.redis.host", "Not configured"));
        logger.info("Email verification enabled: {}", environment.getProperty("EMAIL_VERIFICATION_ENABLED", "false"));
        logger.info("JWT expiration: {} ms", environment.getProperty("JWT_EXPIRATION", "86400000"));
        logger.info("Frontend URL: {}", environment.getProperty("FRONTEND_URL", "Not configured"));
        
        // Log OAuth2 configuration status
        boolean googleConfigured = isProviderConfigured("GOOGLE");
        boolean githubConfigured = isProviderConfigured("GITHUB");
        boolean fortyTwoConfigured = isProviderConfigured("FORTYTWO");
        
        logger.info("OAuth2 Providers - Google: {}, GitHub: {}, 42: {}", 
            googleConfigured, githubConfigured, fortyTwoConfigured);
        
        logger.info("========================================");
    }
    
    private boolean isProviderConfigured(String provider) {
        String clientId = environment.getProperty(provider + "_CLIENT_ID");
        String clientSecret = environment.getProperty(provider + "_CLIENT_SECRET");
        
        return clientId != null && !clientId.trim().isEmpty() && 
               clientSecret != null && !clientSecret.trim().isEmpty();
    }
} 