package com.hypertube.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class GatewayConfig {

    @Value("${hypertube.services.auth-service.url:http://auth-service:8081}")
    private String authServiceUrl;

    @Value("${hypertube.services.video-service.url:http://video-service:3002}")
    private String videoServiceUrl;

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Auth Service Routes
                .route("auth-signin", r -> r.path("/api/auth/signin")
                        .uri(authServiceUrl))
                .route("auth-signup", r -> r.path("/api/auth/signup")
                        .uri(authServiceUrl))
                .route("auth-refresh", r -> r.path("/api/auth/refreshtoken")
                        .uri(authServiceUrl))
                .route("auth-signout", r -> r.path("/api/auth/signout")
                        .uri(authServiceUrl))
                .route("auth-verify-email", r -> r.path("/api/auth/verify-email")
                        .uri(authServiceUrl))
                .route("auth-forgot-password", r -> r.path("/api/auth/forgot-password")
                        .uri(authServiceUrl))
                .route("auth-reset-password", r -> r.path("/api/auth/reset-password")
                        .uri(authServiceUrl))
                .route("auth-validate", r -> r.path("/api/auth/validate")
                        .uri(authServiceUrl))
                .route("oauth2", r -> r.path("/oauth2/**")
                        .uri(authServiceUrl))
                .route("login-oauth2", r -> r.path("/login/oauth2/**")
                        .uri(authServiceUrl))

                // User Routes (Auth Service)
                .route("users", r -> r.path("/api/users", "/api/users/**")
                        .uri(authServiceUrl))

                // Video Service Routes
                .route("movies-search", r -> r.path("/api/movies/search")
                        .uri(videoServiceUrl))
                .route("movies", r -> r.path("/api/movies", "/api/movies/**")
                        .uri(videoServiceUrl))
                .route("stream", r -> r.path("/api/stream/**")
                        .uri(videoServiceUrl))
                .route("download", r -> r.path("/api/download/**")
                        .uri(videoServiceUrl))
                .route("subtitles", r -> r.path("/api/subtitles/**")
                        .uri(videoServiceUrl))

                // Comments Routes (Video Service)
                .route("comments", r -> r.path("/api/comments", "/api/comments/**")
                        .uri(videoServiceUrl))

                // Health checks
                .route("auth-health", r -> r.path("/health/auth")
                        .uri(authServiceUrl + "/actuator/health"))
                .route("video-health", r -> r.path("/health/video")
                        .uri(videoServiceUrl + "/health"))

                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOriginPatterns(Arrays.asList("*"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
} 