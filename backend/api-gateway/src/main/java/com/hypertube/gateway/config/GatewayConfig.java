package com.hypertube.gateway.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

/**
 * Configuration simplifiée et propre de la Gateway API
 * Toute la logique complexe est déléguée au RouteConfigHelper
 */
@Configuration
public class GatewayConfig {

    private static final Logger log = LoggerFactory.getLogger(GatewayConfig.class);

    private final HypertubeGatewayProperties gatewayProperties;
    private final RouteConfigHelper routeHelper;

    @Autowired
    public GatewayConfig(HypertubeGatewayProperties gatewayProperties, RouteConfigHelper routeHelper) {
        this.gatewayProperties = gatewayProperties;
        this.routeHelper = routeHelper;
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        log.info("Configuration des routes de la Gateway API");
        
        return builder.routes()
                // === Authentification publique ===
                .route("auth-public", r -> r
                        .path("/auth/signin", "/auth/signup")
                        .filters(routeHelper.publicRoute("AUTH-PUBLIC"))
                        .uri(routeHelper.getAuthServiceUrl()))
                        
                // === OAuth2 providers endpoint (public) ===
                .route("oauth2-providers", r -> r
                        .path("/auth/oauth2/providers")
                        .filters(routeHelper.publicRoute("OAUTH2-PROVIDERS"))
                        .uri(routeHelper.getAuthServiceUrl()))
                        
                .route("oauth2", r -> r
                        .path("/oauth2/**", "/login/oauth2/**")
                        .filters(routeHelper.publicRoute("OAUTH2"))
                        .uri(routeHelper.getAuthServiceUrl()))
                        
                // === Authentification protégée ===
                .route("auth-protected", r -> r
                        .predicate(exchange -> {
                                String path = exchange.getRequest().getURI().getPath();
                                return path.startsWith("/auth/")
                                && !path.equals("/auth/signin")
                                && !path.equals("/auth/signup")
                                && !path.equals("/auth/oauth2/providers");
                        })
                        .filters(routeHelper.protectedRoute("AUTH", "auth"))
                        .uri(routeHelper.getAuthServiceUrl()))

                .route("users", r -> r
                        .path("/users/**")
                        .filters(routeHelper.protectedRoute("USERS", "auth"))
                        .uri(routeHelper.getAuthServiceUrl()))

                // === Films ===
                .route("movies-public", r -> r
                        .path("/movies")
                        .and().method("GET")
                        .filters(routeHelper.publicRoute("MOVIES-PUBLIC"))
                        .uri(routeHelper.getVideoServiceUrl()))

                .route("movies-protected", r -> r
                        .path("/movies/**")
                        .filters(routeHelper.protectedRoute("MOVIES", "video"))
                        .uri(routeHelper.getVideoServiceUrl()))

                // === Services vidéo protégés ===
                .route("stream", r -> r
                        .path("/stream/**")
                        .filters(routeHelper.protectedRoute("STREAM", "video"))
                        .uri(routeHelper.getVideoServiceUrl()))

                .route("subtitles", r -> r
                        .path("/subtitles/**")
                        .filters(routeHelper.protectedRoute("SUBTITLES", "video"))
                        .uri(routeHelper.getVideoServiceUrl()))

                .route("comments", r -> r
                        .path("/comments/**")
                        .filters(routeHelper.protectedRoute("COMMENTS", "video"))
                        .uri(routeHelper.getVideoServiceUrl()))

                // === Santé des services ===
                .route("health-auth", r -> r
                        .path("/health/auth")
                        .filters(routeHelper.healthRoute("HEALTH-AUTH"))
                        .uri(routeHelper.getAuthServiceUrl() + routeHelper.getAuthHealthPath()))
                        
                .route("health-video", r -> r
                        .path("/health/video")
                        .filters(routeHelper.healthRoute("HEALTH-VIDEO"))
                        .uri(routeHelper.getVideoServiceUrl() + routeHelper.getVideoHealthPath()))

                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        log.info("Configuration CORS pour la Gateway API");
        
        var corsConfig = new CorsConfiguration();
        var corsProps = gatewayProperties.getCors();
        
        corsConfig.setAllowedOriginPatterns(corsProps.getAllowedOriginPatterns());
        corsConfig.setAllowedMethods(corsProps.getAllowedMethods());
        corsConfig.setAllowedHeaders(corsProps.getAllowedHeaders());
        corsConfig.setExposedHeaders(corsProps.getExposedHeaders());
        corsConfig.setAllowCredentials(corsProps.isAllowCredentials());
        corsConfig.setMaxAge(corsProps.getMaxAge());

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }

    @Bean
    public org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter redisRateLimiter() {
        var defaultConfig = gatewayProperties.getRateLimit().getConfigForEndpoint("default");
        return new org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter(
                defaultConfig.getReplenishRate(), 
                defaultConfig.getBurstCapacity(),
                defaultConfig.getRequestedTokens()
        );
    }

    @Bean
    public org.springframework.cloud.gateway.filter.ratelimit.KeyResolver keyResolver() {
        return exchange -> reactor.core.publisher.Mono.just("global");
    }
} 