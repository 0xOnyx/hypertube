package com.hypertube.auth.service;

import java.util.Map;

public class FortyTwoOAuth2UserInfo extends OAuth2UserInfo {

    public FortyTwoOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return ((Integer) attributes.get("id")).toString();
    }

    @Override
    public String getName() {
        return (String) attributes.get("login");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getImageUrl() {
        Map<String, Object> image = (Map<String, Object>) attributes.get("image");
        return image != null ? (String) image.get("link") : null;
    }

    @Override
    public String getFirstName() {
        return (String) attributes.get("first_name");
    }

    @Override
    public String getLastName() {
        return (String) attributes.get("last_name");
    }
} 