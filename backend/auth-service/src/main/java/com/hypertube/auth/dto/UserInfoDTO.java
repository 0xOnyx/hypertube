package com.hypertube.auth.dto;

import com.hypertube.auth.security.UserDetailsImpl;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.stream.Collectors;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

public record UserInfoDTO(
    Long id,
    String email,
    List<String> roles
) {
    public static UserInfoDTO fromUserDetails(UserDetailsImpl userDetails) {
        return new UserInfoDTO(
            userDetails.getId(),
            userDetails.getEmail(),
            userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList())
        );
    }
} 