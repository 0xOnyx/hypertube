package com.hypertube.gateway.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

/**
 * Configuration to disable LoadBalancer and avoid bean initialization 
 * warnings in Spring Cloud Gateway
 */
@Configuration
@EnableAutoConfiguration(exclude = {
    LoadBalancerAutoConfiguration.class
})
@ConditionalOnProperty(name = "spring.cloud.loadbalancer.enabled", havingValue = "false", matchIfMissing = true)
public class LoadBalancerConfig {
    
    // This class automatically disables LoadBalancer auto-configurations
    // that cause BeanPostProcessor warnings
} 