package com.hypertube.auth.security;

import com.hypertube.auth.entity.User;
import com.hypertube.auth.entity.UserSession;
import com.hypertube.auth.repository.UserSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserSessionRepository sessionRepository;

    @Value("${hypertube.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
                                       Authentication authentication) throws IOException {
        
        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + frontendUrl);
            return;
        }

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(userPrincipal.getUsername());
        String refreshToken = jwtUtils.generateRefreshToken(userPrincipal.getUsername());

        // Créer une session
        User user = User.builder()
                .id(userPrincipal.getId())
                .username(userPrincipal.getUsername())
                .email(userPrincipal.getEmail())
                .build();
                
        UserSession session = new UserSession(user, refreshToken, 
                LocalDateTime.now().plusDays(30));
        sessionRepository.save(session);

        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/auth/oauth2/redirect")
                .queryParam("token", jwt)
                .queryParam("refreshToken", refreshToken)
                .build().toUriString();

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
} 