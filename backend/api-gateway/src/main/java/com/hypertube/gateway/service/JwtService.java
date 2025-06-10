package com.hypertube.gateway.service;

import com.hypertube.gateway.config.HypertubeGatewayProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

/**
 * Service JWT compatible JJWT 0.12.6
 * Utilise la nouvelle API avec parseSignedClaims et getPayload
 */
@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final HypertubeGatewayProperties gatewayProperties;
    private final String secretKey;

    @Autowired
    public JwtService(HypertubeGatewayProperties gatewayProperties) {
        this.gatewayProperties = gatewayProperties;
        this.secretKey = gatewayProperties.getJwt().getSecret();
        
        log.info("Service JWT initialisé avec issuer: {}", 
                gatewayProperties.getJwt().getIssuer());
    }

    /**
     * Convertit la clé secrète string en SecretKey pour JJWT 0.12.6
     * Supporte les clés en Base64 et en texte brut
     */
    private SecretKey getSignInKey() {
        try {
            // Essaie d'abord le décodage Base64
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            // Si le décodage Base64 échoue, utilise la clé comme texte brut
            log.debug("Clé JWT non Base64 détectée, utilisation en texte brut");
            byte[] keyBytes = secretKey.getBytes();
            
            // Assure-toi que la clé fait au moins 256 bits (32 bytes) pour HMAC-SHA256
            if (keyBytes.length < 32) {
                // Rembourre la clé si elle est trop courte
                byte[] paddedKey = new byte[32];
                System.arraycopy(keyBytes, 0, paddedKey, 0, Math.min(keyBytes.length, 32));
                keyBytes = paddedKey;
            }
            
            return Keys.hmacShaKeyFor(keyBytes);
        }
    }

    /**
     * Valide un token JWT avec la nouvelle API
     */
    public boolean validateToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return false;
            }

            // Utilise la nouvelle API JJWT 0.12.6
            Claims claims = Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            // Validations de base
            if (claims.getSubject() == null || claims.getSubject().trim().isEmpty()) {
                log.debug("Token JWT sans subject valide");
                return false;
            }

            // Vérifier l'expiration
            if (claims.getExpiration() != null && claims.getExpiration().before(new Date())) {
                log.debug("Token JWT expiré");
                return false;
            }

            return true;

        } catch (ExpiredJwtException e) {
            log.debug("Token JWT expiré: {}", e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            log.warn("Token JWT non supporté: {}", e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            log.warn("Token JWT malformé: {}", e.getMessage());
            return false;
        } catch (SignatureException e) {
            log.warn("Signature JWT invalide: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Erreur inattendue lors de la validation JWT", e);
            return false;
        }
    }

    /**
     * Extrait tous les claims d'un token JWT
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extrait les claims d'un token JWT valide
     */
    public Optional<Claims> extractClaims(String token) {
        if (token == null || token.trim().isEmpty()) {
            return Optional.empty();
        }

        try {
            Claims claims = extractAllClaims(token);
            return Optional.of(claims);
        } catch (JwtException e) {
            log.debug("Impossible d'extraire les claims du token: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Extrait le subject (ID utilisateur) du token
     */
    public Optional<String> extractSubject(String token) {
        return extractClaims(token)
                .map(Claims::getSubject)
                .filter(subject -> subject != null && !subject.trim().isEmpty());
    }

    /**
     * Extrait le nom d'utilisateur du token
     */
    public Optional<String> extractUsername(String token) {
        return extractClaims(token)
                .map(claims -> claims.get("username", String.class))
                .filter(username -> username != null && !username.trim().isEmpty());
    }

    /**
     * Extrait l'email du token
     */
    public Optional<String> extractEmail(String token) {
        return extractClaims(token)
                .map(claims -> claims.get("email", String.class))
                .filter(email -> email != null && !email.trim().isEmpty());
    }

    /**
     * Extrait les rôles du token
     */
    public Optional<String> extractRoles(String token) {
        return extractClaims(token)
                .map(claims -> claims.get("roles", String.class))
                .filter(roles -> roles != null && !roles.trim().isEmpty());
    }
} 