package com.hypertube.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Fallback controller for circuit breaker responses
 */
@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @RequestMapping("/auth")
    public ResponseEntity<Map<String, Object>> authFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "error", "SERVICE_UNAVAILABLE",
                        "message", "Authentication service is temporarily unavailable",
                        "timestamp", Instant.now(),
                        "status", 503
                ));
    }

    @RequestMapping("/users")
    public ResponseEntity<Map<String, Object>> usersFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "error", "SERVICE_UNAVAILABLE", 
                        "message", "User service is temporarily unavailable",
                        "timestamp", Instant.now(),
                        "status", 503
                ));
    }

    @RequestMapping("/movies")
    public ResponseEntity<Map<String, Object>> moviesFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "error", "SERVICE_UNAVAILABLE",
                        "message", "Movie service is temporarily unavailable", 
                        "timestamp", Instant.now(),
                        "status", 503
                ));
    }

    @RequestMapping("/stream")
    public ResponseEntity<Map<String, Object>> streamFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "error", "SERVICE_UNAVAILABLE",
                        "message", "Streaming service is temporarily unavailable",
                        "timestamp", Instant.now(),
                        "status", 503
                ));
    }

    @RequestMapping("/comments")
    public ResponseEntity<Map<String, Object>> commentsFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "error", "SERVICE_UNAVAILABLE",
                        "message", "Comments service is temporarily unavailable",
                        "timestamp", Instant.now(), 
                        "status", 503
                ));
    }
} 