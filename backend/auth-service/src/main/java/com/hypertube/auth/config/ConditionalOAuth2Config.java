package com.hypertube.auth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class ConditionalOAuth2Config {

    @Value("${GOOGLE_CLIENT_ID:}")
    private String googleClientId;
    
    @Value("${GOOGLE_CLIENT_SECRET:}")
    private String googleClientSecret;
    
    @Value("${GITHUB_CLIENT_ID:}")
    private String githubClientId;
    
    @Value("${GITHUB_CLIENT_SECRET:}")
    private String githubClientSecret;
    
    @Value("${FORTYTWO_CLIENT_ID:}")
    private String fortyTwoClientId;
    
    @Value("${FORTYTWO_CLIENT_SECRET:}")
    private String fortyTwoClientSecret;
    
    @Value("${FRONTEND_URL}" + "/api")
    private String authBaseUrl;

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        List<ClientRegistration> registrations = new ArrayList<>();
        
        // Add Google only if configured
        if (isProviderConfigured(googleClientId, googleClientSecret)) {
            registrations.add(createGoogleRegistration());
        }
        
        // Add GitHub only if configured
        if (isProviderConfigured(githubClientId, githubClientSecret)) {
            registrations.add(createGithubRegistration());
        }
        
        // Add 42 only if configured
        if (isProviderConfigured(fortyTwoClientId, fortyTwoClientSecret)) {
            registrations.add(createFortyTwoRegistration());
        }
        
        // If no provider is configured, create a dummy provider to avoid errors
        if (registrations.isEmpty()) {
            registrations.add(createDummyRegistration());
        }
        
        return new InMemoryClientRegistrationRepository(registrations);
    }

    private boolean isProviderConfigured(String clientId, String clientSecret) {
        return clientId != null && !clientId.trim().isEmpty() && 
               clientSecret != null && !clientSecret.trim().isEmpty();
    }

    private ClientRegistration createDummyRegistration() {
        return ClientRegistration.withRegistrationId("dummy")
                .clientId("dummy-client-id")
                .clientSecret("dummy-client-secret")
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri(authBaseUrl + "/login/oauth2/code/dummy")
                .scope("read")
                .authorizationUri("https://example.com/oauth/authorize")
                .tokenUri("https://example.com/oauth/token")
                .userInfoUri("https://example.com/user")
                .userNameAttributeName("id")
                .clientName("Dummy")
                .build();
    }

    private ClientRegistration createFortyTwoRegistration() {
        return ClientRegistration.withRegistrationId("fortytwo")
                .clientId(fortyTwoClientId)
                .clientSecret(fortyTwoClientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri(authBaseUrl + "/login/oauth2/code/fortytwo")
                .scope("public")
                .authorizationUri("https://api.intra.42.fr/oauth/authorize")
                .tokenUri("https://api.intra.42.fr/oauth/token")
                .userInfoUri("https://api.intra.42.fr/v2/me")
                .userNameAttributeName("login")
                .clientName("42")
                .build();
    }

    private ClientRegistration createGoogleRegistration() {
        return ClientRegistration.withRegistrationId("google")
                .clientId(googleClientId)
                .clientSecret(googleClientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri(authBaseUrl + "/login/oauth2/code/google")
                .scope("openid", "profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://www.googleapis.com/oauth2/v4/token")
                .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
                .userNameAttributeName(IdTokenClaimNames.SUB)
                .jwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
                .clientName("Google")
                .build();
    }

    private ClientRegistration createGithubRegistration() {
        return ClientRegistration.withRegistrationId("github")
                .clientId(githubClientId)
                .clientSecret(githubClientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri(authBaseUrl + "/login/oauth2/code/github")
                .scope("read:user", "user:email")
                .authorizationUri("https://github.com/login/oauth/authorize")
                .tokenUri("https://github.com/login/oauth/access_token")
                .userInfoUri("https://api.github.com/user")
                .userNameAttributeName("id")
                .clientName("GitHub")
                .build();
    }
} 
