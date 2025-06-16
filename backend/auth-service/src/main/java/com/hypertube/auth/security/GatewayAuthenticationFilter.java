package com.hypertube.auth.security;

import com.hypertube.auth.entity.User;
import com.hypertube.auth.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class GatewayAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(GatewayAuthenticationFilter.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String userId = request.getHeader("X-User-Id");
        String username = request.getHeader("X-Username");
        String email = request.getHeader("X-User-Email");
        String roles = request.getHeader("X-User-Roles");
        String authMethod = request.getHeader("X-Auth-Method");

        logger.debug("Gateway headers - UserId: {}, Username: {}, Email: {}, Roles: {}, AuthMethod: {}", 
            userId, username, email, roles, authMethod);

        if (userId != null && !userId.isEmpty() && "JWT".equals(authMethod)) {
            try {
                Optional<User> userOpt = userRepository.findById(Long.parseLong(userId));
                
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    
                    // Ajouter le rôle de l'utilisateur depuis la base de données
                    authorities.add(new SimpleGrantedAuthority(user.getRole().name()));
                    
                    // Ajouter les rôles supplémentaires si présents
                    if (roles != null && !roles.trim().isEmpty()) {
                        authorities.addAll(
                            Stream.of(roles.split(","))
                                .map(String::trim)
                                .filter(role -> !role.isEmpty())
                                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList())
                        );
                    }

                    UserDetailsImpl userDetails = new UserDetailsImpl(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPassword(),
                        authorities
                    );

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        authorities
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("Authentication set from database for user: {} with roles: {}", 
                        user.getUsername(), authorities.stream().map(auth -> auth.getAuthority()).collect(Collectors.joining(", ")));
                } else {
                    logger.warn("User not found in database for ID: {}", userId);
                }
            } catch (NumberFormatException e) {
                logger.error("Invalid user ID format: {}", userId, e);
            } catch (Exception e) {
                logger.error("Error retrieving user from database", e);
            }
        }

        filterChain.doFilter(request, response);
    }
} 