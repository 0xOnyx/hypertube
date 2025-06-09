package com.hypertube.gateway.filter;

import com.hypertube.gateway.config.HypertubeGatewayProperties;
import com.hypertube.gateway.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Optional;

/**
 * Simplified JWT Authentication Filter
 */
@Component
public class JwtAuthenticationGatewayFilterFactory 
        extends AbstractGatewayFilterFactory<JwtAuthenticationGatewayFilterFactory.Config> {

    private final HypertubeGatewayProperties gatewayProperties;
    private final JwtService jwtService;

    @Autowired
    public JwtAuthenticationGatewayFilterFactory(HypertubeGatewayProperties gatewayProperties, 
                                               JwtService jwtService) {
        super(Config.class);
        this.gatewayProperties = gatewayProperties;
        this.jwtService = jwtService;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();

            // Check if endpoint is public
            if (gatewayProperties.isPublicEndpoint(path)) {
                return chain.filter(exchange);
            }

            // Extract JWT token
            Optional<String> tokenOpt = extractJwtToken(request);
            if (tokenOpt.isEmpty()) {
                return handleUnauthorized(exchange, "Missing or invalid JWT token");
            }

            String token = tokenOpt.get();

            try {
                // Validate token
                if (!jwtService.validateToken(token)) {
                    return handleUnauthorized(exchange, "Invalid JWT token");
                }

                // Extract user information
                String userId = jwtService.extractSubject(token).orElse("");
                String username = jwtService.extractUsername(token).orElse("");
                String email = jwtService.extractEmail(token).orElse("");
                String roles = jwtService.extractRoles(token).orElse("");

                // Enrich request with user information
                ServerHttpRequest modifiedRequest = request.mutate()
                        .header("X-User-Id", userId)
                        .header("X-Username", Optional.ofNullable(username).orElse(""))
                        .header("X-User-Email", Optional.ofNullable(email).orElse(""))
                        .header("X-User-Roles", Optional.ofNullable(roles).orElse(""))
                        .header("X-Auth-Method", "JWT")
                        .header("X-Gateway-Timestamp", String.valueOf(System.currentTimeMillis()))
                        .build();

                return chain.filter(exchange.mutate().request(modifiedRequest).build());

            } catch (JwtException e) {
                return handleUnauthorized(exchange, "JWT validation error: " + e.getMessage());
            } catch (Exception e) {
                return handleInternalError(exchange, "Internal authentication error");
            }
        };
    }

    private Optional<String> extractJwtToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        
        if (!StringUtils.hasText(authHeader)) {
            return Optional.empty();
        }

        if (!authHeader.startsWith("Bearer ")) {
            return Optional.empty();
        }

        String token = authHeader.substring(7).trim();
        return StringUtils.hasText(token) ? Optional.of(token) : Optional.empty();
    }

    private Mono<Void> handleUnauthorized(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        response.getHeaders().add("X-Error-Source", "JWT-Filter");

        String body = String.format("""
            {
                "error": "UNAUTHORIZED",
                "message": "%s",
                "timestamp": "%s",
                "path": "%s",
                "status": 401
            }
            """, 
            message, 
            Instant.now(), 
            exchange.getRequest().getURI().getPath()
        );

        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }

    private Mono<Void> handleInternalError(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        response.getHeaders().add("X-Error-Source", "JWT-Filter");

        String body = String.format("""
            {
                "error": "INTERNAL_ERROR",
                "message": "%s",
                "timestamp": "%s",
                "path": "%s",
                "status": 500
            }
            """, 
            message, 
            Instant.now(), 
            exchange.getRequest().getURI().getPath()
        );

        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }

    public static class Config {
        private boolean enabled = true;
        private String headerPrefix = "X-";
        private boolean logRequests = true;

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }

        public String getHeaderPrefix() { return headerPrefix; }
        public void setHeaderPrefix(String headerPrefix) { this.headerPrefix = headerPrefix; }

        public boolean isLogRequests() { return logRequests; }
        public void setLogRequests(boolean logRequests) { this.logRequests = logRequests; }
    }
} 