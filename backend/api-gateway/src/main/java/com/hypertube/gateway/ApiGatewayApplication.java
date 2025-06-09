package com.hypertube.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Main Application class for Hypertube API Gateway
 * 
 * Single entry point for all Hypertube application requests.
 * Provides authentication, routing, resilience and observability.
 * 
 * Main features:
 * - JWT Authentication
 * - Smart routing to microservices
 * - Circuit breakers and retry
 * - Rate limiting
 * - Logging and tracing
 * - CORS and security
 * - Health checks and metrics
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableConfigurationProperties
@EnableCaching
public class ApiGatewayApplication {

    private static final Logger log = LoggerFactory.getLogger(ApiGatewayApplication.class);

    public static void main(String[] args) {
        try {
            log.info("🚀 Starting Hypertube API Gateway...");
            
            SpringApplication app = new SpringApplication(ApiGatewayApplication.class);
            
            // System properties configuration for better startup
            System.setProperty("spring.application.name", "hypertube-api-gateway");
            System.setProperty("server.shutdown", "graceful");
            
            var context = app.run(args);
            
            // Display startup information
            String port = context.getEnvironment().getProperty("server.port", "8080");
            String profiles = String.join(", ", context.getEnvironment().getActiveProfiles());
            
            log.info("✅ Hypertube API Gateway started successfully!");
            log.info("🌐 Server available on port: {}", port);
            log.info("📋 Active profiles: {}", profiles.isEmpty() ? "default" : profiles);
            log.info("🔧 Actuator available on: http://localhost:{}/actuator", port);
            log.info("📊 Prometheus metrics: http://localhost:{}/actuator/prometheus", port);
            log.info("❤️ Health check: http://localhost:{}/actuator/health", port);
            log.info("🛣️ Gateway routes: http://localhost:{}/actuator/gateway/routes", port);
            
        } catch (Exception e) {
            log.error("❌ Error starting API Gateway", e);
            System.exit(1);
        }
    }
} 