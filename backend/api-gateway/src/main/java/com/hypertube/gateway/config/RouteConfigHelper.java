package com.hypertube.gateway.config;

import com.hypertube.gateway.filter.JwtAuthenticationGatewayFilterFactory;
import com.hypertube.gateway.filter.LoggingGatewayFilterFactory;
import com.hypertube.gateway.filter.RequestHeaderGatewayFilterFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.RequestRateLimiterGatewayFilterFactory;
import org.springframework.cloud.gateway.route.builder.GatewayFilterSpec;
import org.springframework.cloud.gateway.route.builder.UriSpec;
import org.springframework.stereotype.Component;

import java.util.function.Function;

/**
 * Helper pour simplifier la configuration des routes et éliminer la redondance
 */
@Component
public class RouteConfigHelper {

    private final HypertubeGatewayProperties gatewayProperties;
    private final JwtAuthenticationGatewayFilterFactory jwtAuthFilter;
    private final LoggingGatewayFilterFactory loggingFilter;
    private final RequestHeaderGatewayFilterFactory requestHeaderFilter;

    public RouteConfigHelper(HypertubeGatewayProperties gatewayProperties,
                           JwtAuthenticationGatewayFilterFactory jwtAuthFilter,
                           LoggingGatewayFilterFactory loggingFilter,
                           RequestHeaderGatewayFilterFactory requestHeaderFilter) {
        this.gatewayProperties = gatewayProperties;
        this.jwtAuthFilter = jwtAuthFilter;
        this.loggingFilter = loggingFilter;
        this.requestHeaderFilter = requestHeaderFilter;
    }

    /**
     * Configuration des filtres pour routes publiques
     */
    public Function<GatewayFilterSpec, UriSpec> publicRoute(String logPrefix) {
        return filters -> filters
                .filter(createLoggingFilter(logPrefix))
                .requestRateLimiter(this::configureDefaultRateLimit);
    }

    /**
     * Configuration des filtres pour routes protégées
     */
    public Function<GatewayFilterSpec, UriSpec> protectedRoute(String logPrefix, String serviceName) {
        return filters -> filters
                .filter(createJwtAuthFilter())
                .filter(createLoggingFilter(logPrefix))
                .filter(createRequestHeaderFilter())
                .circuitBreaker(config -> config
                        .setName(serviceName + "-circuit-breaker")
                        .setFallbackUri("forward:/fallback/" + serviceName.toLowerCase()))
                .retry(config -> config
                        .setRetries(gatewayProperties.getRetry().getMaxAttempts()));
    }

    /**
     * Configuration simple avec logging uniquement
     */
    public Function<GatewayFilterSpec, UriSpec> healthRoute(String logPrefix) {
        return filters -> filters.filter(createLoggingFilter(logPrefix));
    }

    /**
     * Services URLs centralisés
     */
    public String getAuthServiceUrl() {
        return gatewayProperties.getServices().getAuthService().getUrl();
    }

    public String getVideoServiceUrl() {
        return gatewayProperties.getServices().getVideoService().getUrl();
    }

    public String getAuthHealthPath() {
        return gatewayProperties.getServices().getAuthService().getHealthPath();
    }

    public String getVideoHealthPath() {
        return gatewayProperties.getServices().getVideoService().getHealthPath();
    }

    // ====================== Méthodes privées ======================

    private GatewayFilter createLoggingFilter(String prefix) {
        return loggingFilter.apply(new LoggingGatewayFilterFactory.Config(prefix));
    }

    private GatewayFilter createJwtAuthFilter() {
        return jwtAuthFilter.apply(new JwtAuthenticationGatewayFilterFactory.Config());
    }

    private GatewayFilter createRequestHeaderFilter() {
        return requestHeaderFilter.apply(new RequestHeaderGatewayFilterFactory.Config());
    }

    private void configureDefaultRateLimit(RequestRateLimiterGatewayFilterFactory.Config config) {
        // Configuration par défaut du rate limiting
    }
} 