package com.hypertube.gateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;

/**
 * Centralized configuration for Hypertube API Gateway
 * Simplified version with manual getters/setters
 */
@Component
@ConfigurationProperties(prefix = "hypertube.gateway")
public class HypertubeGatewayProperties {

    private JwtConfig jwt = new JwtConfig();
    private ServicesConfig services = new ServicesConfig();
    private RateLimitConfig rateLimit = new RateLimitConfig();
    private CorsConfig cors = new CorsConfig();
    private CircuitBreakerConfig circuitBreaker = new CircuitBreakerConfig();
    private RetryConfig retry = new RetryConfig();

    // Public endpoints - centralized configuration ONLY here
    private List<String> publicEndpoints = List.of(
            "/api/auth/signin",
            "/api/auth/signup",
            "/api/auth/verify-email", 
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/api/movies",
            "/oauth2/**",
            "/login/oauth2/**",
            "/actuator/health",
            "/actuator/info",
            "/fallback/**"
    );

    // Getters and Setters
    public JwtConfig getJwt() { return jwt; }
    public void setJwt(JwtConfig jwt) { this.jwt = jwt; }

    public ServicesConfig getServices() { return services; }
    public void setServices(ServicesConfig services) { this.services = services; }

    public RateLimitConfig getRateLimit() { return rateLimit; }
    public void setRateLimit(RateLimitConfig rateLimit) { this.rateLimit = rateLimit; }

    public CorsConfig getCors() { return cors; }
    public void setCors(CorsConfig cors) { this.cors = cors; }

    public CircuitBreakerConfig getCircuitBreaker() { return circuitBreaker; }
    public void setCircuitBreaker(CircuitBreakerConfig circuitBreaker) { this.circuitBreaker = circuitBreaker; }

    public RetryConfig getRetry() { return retry; }
    public void setRetry(RetryConfig retry) { this.retry = retry; }

    public List<String> getPublicEndpoints() { return publicEndpoints; }
    public void setPublicEndpoints(List<String> publicEndpoints) { this.publicEndpoints = publicEndpoints; }

    public static class JwtConfig {
        private String secret = "hypertubeSecretKeyForDevelopmentOnly";
        private long expiration = 86400000; // 24 hours in ms
        private long refreshExpiration = 604800000; // 7 days in ms
        private String issuer = "hypertube-app";
        private int clockSkewSeconds = 60;

        // Getters and Setters
        public String getSecret() { return secret; }
        public void setSecret(String secret) { this.secret = secret; }

        public long getExpiration() { return expiration; }
        public void setExpiration(long expiration) { this.expiration = expiration; }

        public long getRefreshExpiration() { return refreshExpiration; }
        public void setRefreshExpiration(long refreshExpiration) { this.refreshExpiration = refreshExpiration; }

        public String getIssuer() { return issuer; }
        public void setIssuer(String issuer) { this.issuer = issuer; }

        public int getClockSkewSeconds() { return clockSkewSeconds; }
        public void setClockSkewSeconds(int clockSkewSeconds) { this.clockSkewSeconds = clockSkewSeconds; }
    }

    public static class ServicesConfig {
        private ServiceConfig authService = new ServiceConfig(
                "hypertube-auth-service",
                "http://localhost:8081",
                "/actuator/health",
                Duration.ofSeconds(5),
                3
        );

        private ServiceConfig videoService = new ServiceConfig(
                "hypertube-video-service", 
                "http://localhost:3002",
                "/health",
                Duration.ofSeconds(10),
                3
        );

        // Getters and Setters
        public ServiceConfig getAuthService() { return authService; }
        public void setAuthService(ServiceConfig authService) { this.authService = authService; }

        public ServiceConfig getVideoService() { return videoService; }
        public void setVideoService(ServiceConfig videoService) { this.videoService = videoService; }
    }

    public static class ServiceConfig {
        private String name;
        private String url;
        private String healthPath;
        private Duration timeout;
        private int retryAttempts;
        private boolean circuitBreakerEnabled = true;

        // Constructors
        public ServiceConfig() {}

        public ServiceConfig(String name, String url, String healthPath, Duration timeout, int retryAttempts) {
            this.name = name;
            this.url = url;
            this.healthPath = healthPath;
            this.timeout = timeout;
            this.retryAttempts = retryAttempts;
        }

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }

        public String getHealthPath() { return healthPath; }
        public void setHealthPath(String healthPath) { this.healthPath = healthPath; }

        public Duration getTimeout() { return timeout; }
        public void setTimeout(Duration timeout) { this.timeout = timeout; }

        public int getRetryAttempts() { return retryAttempts; }
        public void setRetryAttempts(int retryAttempts) { this.retryAttempts = retryAttempts; }

        public boolean isCircuitBreakerEnabled() { return circuitBreakerEnabled; }
        public void setCircuitBreakerEnabled(boolean circuitBreakerEnabled) { this.circuitBreakerEnabled = circuitBreakerEnabled; }
    }

    public static class RateLimitConfig {
        private boolean enabled = true;
        private int defaultReplenishRate = 100;
        private int defaultBurstCapacity = 200;
        private int authReplenishRate = 10;
        private int authBurstCapacity = 20;
        private int requestedTokens = 1;

        public RateLimitEndpointConfig getConfigForEndpoint(String endpoint) {
            if (endpoint != null && endpoint.contains("auth")) {
                return new RateLimitEndpointConfig(authReplenishRate, authBurstCapacity, requestedTokens);
            }
            return new RateLimitEndpointConfig(defaultReplenishRate, defaultBurstCapacity, requestedTokens);
        }

        // Getters and Setters
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }

        public int getDefaultReplenishRate() { return defaultReplenishRate; }
        public void setDefaultReplenishRate(int defaultReplenishRate) { this.defaultReplenishRate = defaultReplenishRate; }

        public int getDefaultBurstCapacity() { return defaultBurstCapacity; }
        public void setDefaultBurstCapacity(int defaultBurstCapacity) { this.defaultBurstCapacity = defaultBurstCapacity; }

        public int getAuthReplenishRate() { return authReplenishRate; }
        public void setAuthReplenishRate(int authReplenishRate) { this.authReplenishRate = authReplenishRate; }

        public int getAuthBurstCapacity() { return authBurstCapacity; }
        public void setAuthBurstCapacity(int authBurstCapacity) { this.authBurstCapacity = authBurstCapacity; }

        public int getRequestedTokens() { return requestedTokens; }
        public void setRequestedTokens(int requestedTokens) { this.requestedTokens = requestedTokens; }
    }

    public static class RateLimitEndpointConfig {
        private final int replenishRate;
        private final int burstCapacity;
        private final int requestedTokens;

        public RateLimitEndpointConfig(int replenishRate, int burstCapacity, int requestedTokens) {
            this.replenishRate = replenishRate;
            this.burstCapacity = burstCapacity;
            this.requestedTokens = requestedTokens;
        }

        public int getReplenishRate() { return replenishRate; }
        public int getBurstCapacity() { return burstCapacity; }
        public int getRequestedTokens() { return requestedTokens; }
    }

    public static class CorsConfig {
        private boolean enabled = true;
        private List<String> allowedOriginPatterns = List.of(
                "http://localhost:*",       // Local development with any port
                "https://localhost:*",      // Local HTTPS with any port
                "https://*.hypertube.com",  // Production subdomains
                "https://hypertube.com",    // Production domain
                "https://hypertube.com:*"   // Production domain with any port
        );
        private List<String> allowedMethods = List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        );
        private List<String> allowedHeaders = List.of(
                "Authorization", "Content-Type", "X-Requested-With", 
                "Accept", "Origin", "Access-Control-Request-Method",
                "Access-Control-Request-Headers", "X-User-Id", "X-Trace-Id"
        );
        private List<String> exposedHeaders = List.of(
                "X-Total-Count", "X-Page-Number", "X-Page-Size",
                "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"
        );
        private boolean allowCredentials = true;
        private long maxAge = 3600L;

        // Getters and Setters
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }

        public List<String> getAllowedOriginPatterns() { return allowedOriginPatterns; }
        public void setAllowedOriginPatterns(List<String> allowedOriginPatterns) { this.allowedOriginPatterns = allowedOriginPatterns; }

        public List<String> getAllowedMethods() { return allowedMethods; }
        public void setAllowedMethods(List<String> allowedMethods) { this.allowedMethods = allowedMethods; }

        public List<String> getAllowedHeaders() { return allowedHeaders; }
        public void setAllowedHeaders(List<String> allowedHeaders) { this.allowedHeaders = allowedHeaders; }

        public List<String> getExposedHeaders() { return exposedHeaders; }
        public void setExposedHeaders(List<String> exposedHeaders) { this.exposedHeaders = exposedHeaders; }

        public boolean isAllowCredentials() { return allowCredentials; }
        public void setAllowCredentials(boolean allowCredentials) { this.allowCredentials = allowCredentials; }

        public long getMaxAge() { return maxAge; }
        public void setMaxAge(long maxAge) { this.maxAge = maxAge; }
    }

    public static class CircuitBreakerConfig {
        private boolean enabled = true;
        private int slidingWindowSize = 100;
        private int permittedNumberOfCallsInHalfOpenState = 30;
        private String slidingWindowType = "TIME_BASED";
        private int minimumNumberOfCalls = 20;
        private Duration waitDurationInOpenState = Duration.ofSeconds(50);
        private int failureRateThreshold = 50;
        private int eventConsumerBufferSize = 10;

        // Getters and Setters
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }

        public int getSlidingWindowSize() { return slidingWindowSize; }
        public void setSlidingWindowSize(int slidingWindowSize) { this.slidingWindowSize = slidingWindowSize; }

        public int getPermittedNumberOfCallsInHalfOpenState() { return permittedNumberOfCallsInHalfOpenState; }
        public void setPermittedNumberOfCallsInHalfOpenState(int permittedNumberOfCallsInHalfOpenState) { this.permittedNumberOfCallsInHalfOpenState = permittedNumberOfCallsInHalfOpenState; }

        public String getSlidingWindowType() { return slidingWindowType; }
        public void setSlidingWindowType(String slidingWindowType) { this.slidingWindowType = slidingWindowType; }

        public int getMinimumNumberOfCalls() { return minimumNumberOfCalls; }
        public void setMinimumNumberOfCalls(int minimumNumberOfCalls) { this.minimumNumberOfCalls = minimumNumberOfCalls; }

        public Duration getWaitDurationInOpenState() { return waitDurationInOpenState; }
        public void setWaitDurationInOpenState(Duration waitDurationInOpenState) { this.waitDurationInOpenState = waitDurationInOpenState; }

        public int getFailureRateThreshold() { return failureRateThreshold; }
        public void setFailureRateThreshold(int failureRateThreshold) { this.failureRateThreshold = failureRateThreshold; }

        public int getEventConsumerBufferSize() { return eventConsumerBufferSize; }
        public void setEventConsumerBufferSize(int eventConsumerBufferSize) { this.eventConsumerBufferSize = eventConsumerBufferSize; }
    }

    public static class RetryConfig {
        private boolean enabled = true;
        private int maxAttempts = 3;
        private Duration waitDuration = Duration.ofMillis(500);
        private boolean enableExponentialBackoff = true;
        private int exponentialBackoffMultiplier = 2;
        private Duration firstBackoff = Duration.ofMillis(50);
        private Duration maxBackoff = Duration.ofMillis(500);

        // Getters and Setters
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }

        public int getMaxAttempts() { return maxAttempts; }
        public void setMaxAttempts(int maxAttempts) { this.maxAttempts = maxAttempts; }

        public Duration getWaitDuration() { return waitDuration; }
        public void setWaitDuration(Duration waitDuration) { this.waitDuration = waitDuration; }

        public boolean isEnableExponentialBackoff() { return enableExponentialBackoff; }
        public void setEnableExponentialBackoff(boolean enableExponentialBackoff) { this.enableExponentialBackoff = enableExponentialBackoff; }

        public int getExponentialBackoffMultiplier() { return exponentialBackoffMultiplier; }
        public void setExponentialBackoffMultiplier(int exponentialBackoffMultiplier) { this.exponentialBackoffMultiplier = exponentialBackoffMultiplier; }

        public Duration getFirstBackoff() { return firstBackoff; }
        public void setFirstBackoff(Duration firstBackoff) { this.firstBackoff = firstBackoff; }

        public Duration getMaxBackoff() { return maxBackoff; }
        public void setMaxBackoff(Duration maxBackoff) { this.maxBackoff = maxBackoff; }
    }

    /**
     * Checks if an endpoint is public (does not require authentication)
     */
    public boolean isPublicEndpoint(String path) {
        return publicEndpoints.stream()
                .anyMatch(endpoint -> {
                    if (endpoint.endsWith("/**")) {
                        return path.startsWith(endpoint.substring(0, endpoint.length() - 3));
                    }
                    return path.equals(endpoint) || path.startsWith(endpoint + "/");
                });
    }

    /**
     * Apply production default values
     */
    public void applyProductionDefaults() {
        // Reduce rate limiting in production
        rateLimit.setDefaultReplenishRate(50);
        rateLimit.setDefaultBurstCapacity(100);
        rateLimit.setAuthReplenishRate(5);
        rateLimit.setAuthBurstCapacity(10);

        // CORS configuration for production (including custom ports)
        cors.setAllowedOriginPatterns(List.of(
                "https://*.hypertube.com",
                "https://hypertube.com",
                "https://hypertube.com:*"   // Allow any port for hypertube.com
        ));
    }
} 