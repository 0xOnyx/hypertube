package com.hypertube.auth.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.client.RestTemplate;

@Configuration
public class CloudConfig {

    /**
     * RestTemplate standard (non load-balanced) pour les appels directs
     */
    @Bean
    @Primary
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * RestTemplate load-balanced seulement si le LoadBalancer est activé
     */
    @Bean
    @LoadBalanced
    @ConditionalOnProperty(name = "spring.cloud.loadbalancer.enabled", havingValue = "true")
    public RestTemplate loadBalancedRestTemplate() {
        return new RestTemplate();
    }
} 