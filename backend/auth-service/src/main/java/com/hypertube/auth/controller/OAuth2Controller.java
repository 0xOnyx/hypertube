package com.hypertube.auth.controller;

import com.hypertube.auth.dto.OAuth2ProviderInfo;
import com.hypertube.auth.service.OAuth2Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth/oauth2")
public class OAuth2Controller {

    @Autowired
    private OAuth2Service oauth2Service;

    @GetMapping("/providers")
    public ResponseEntity<List<OAuth2ProviderInfo>> getAvailableProviders() {
        List<OAuth2ProviderInfo> providers = oauth2Service.getAvailableProviders();
        return ResponseEntity.ok(providers);
    }
} 