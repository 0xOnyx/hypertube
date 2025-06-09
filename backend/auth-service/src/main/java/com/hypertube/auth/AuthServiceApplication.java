package com.hypertube.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(exclude = {
    org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration.class,
    org.springframework.cloud.loadbalancer.config.LoadBalancerAutoConfiguration.class,
    org.springframework.cloud.loadbalancer.config.BlockingLoadBalancerClientAutoConfiguration.class
})
@EnableJpaAuditing
@EnableCaching
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
} 