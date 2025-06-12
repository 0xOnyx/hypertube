package com.hypertube.auth.service;

import com.hypertube.auth.dto.OAuth2ProviderInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OAuth2Service {

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    @Value("${GOOGLE_CLIENT_ID:}")
    private String googleClientId;
    
    @Value("${GITHUB_CLIENT_ID:}")
    private String githubClientId;
    
    @Value("${FORTYTWO_CLIENT_ID:}")
    private String fortyTwoClientId;
    
    @Value("${FRONTEND_URL}")
    private String authBaseUrl;

    public List<OAuth2ProviderInfo> getAvailableProviders() {
        List<OAuth2ProviderInfo> providers = new ArrayList<>();
        
        // Google
        if (isProviderConfigured(googleClientId)) {
            try {
                ClientRegistration googleReg = clientRegistrationRepository.findByRegistrationId("google");
                if (googleReg != null) {
                    providers.add(new OAuth2ProviderInfo(
                        "google", 
                        "Google", 
                        authBaseUrl + "/api/oauth2/authorization/google",
                        "#4285f4",
                        "fab fa-google"
                    ));
                }
            } catch (Exception ignored) {}
        }
        
        // GitHub
        if (isProviderConfigured(githubClientId)) {
            try {
                ClientRegistration githubReg = clientRegistrationRepository.findByRegistrationId("github");
                if (githubReg != null) {
                    providers.add(new OAuth2ProviderInfo(
                        "github", 
                        "GitHub", 
                        authBaseUrl + "/api/oauth2/authorization/github",
                        "#333333",
                        "fab fa-github"
                    ));
                }
            } catch (Exception ignored) {}
        }
        
        // 42
        if (isProviderConfigured(fortyTwoClientId)) {
            try {
                ClientRegistration fortyTwoReg = clientRegistrationRepository.findByRegistrationId("fortytwo");
                if (fortyTwoReg != null) {
                    providers.add(new OAuth2ProviderInfo(
                        "fortytwo", 
                        "42", 
                        authBaseUrl + "/api/oauth2/authorization/fortytwo",
                        "#00babc",
                        "fas fa-graduation-cap"
                    ));
                }
            } catch (Exception ignored) {}
        }
        
        return providers;
    }
    
    private boolean isProviderConfigured(String clientId) {
        return clientId != null && !clientId.trim().isEmpty();
    }
} 
