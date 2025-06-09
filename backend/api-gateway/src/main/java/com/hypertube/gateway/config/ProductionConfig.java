package com.hypertube.gateway.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Configuration automatique pour l'environnement de production
 * Applique les bonnes valeurs par défaut sans duplication dans application.yml
 */
@Configuration
@Profile("production")
public class ProductionConfig {

    private static final Logger log = LoggerFactory.getLogger(ProductionConfig.class);

    private final HypertubeGatewayProperties gatewayProperties;

    @Autowired
    public ProductionConfig(HypertubeGatewayProperties gatewayProperties) {
        this.gatewayProperties = gatewayProperties;
    }

    @PostConstruct
    public void applyProductionSettings() {
        log.info("🚀 Application des paramètres de production...");
        
        // Appliquer les valeurs par défaut de production
        gatewayProperties.applyProductionDefaults();
        
        log.info("✅ Paramètres de production appliqués :");
        log.info("   - Rate limiting auth: {}/{}", 
                gatewayProperties.getRateLimit().getAuthReplenishRate(),
                gatewayProperties.getRateLimit().getAuthBurstCapacity());
        log.info("   - Rate limiting default: {}/{}", 
                gatewayProperties.getRateLimit().getDefaultReplenishRate(),
                gatewayProperties.getRateLimit().getDefaultBurstCapacity());
        log.info("   - CORS origins: {}", gatewayProperties.getCors().getAllowedOriginPatterns());
    }
} 