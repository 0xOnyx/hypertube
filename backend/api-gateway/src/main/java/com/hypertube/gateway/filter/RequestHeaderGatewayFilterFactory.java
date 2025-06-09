package com.hypertube.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;

/**
 * Simplified Request Header Gateway Filter
 */
@Component
public class RequestHeaderGatewayFilterFactory extends AbstractGatewayFilterFactory<RequestHeaderGatewayFilterFactory.Config> {

    public RequestHeaderGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            var modifiedRequest = exchange.getRequest().mutate()
                    .header("X-Gateway-Version", "1.0.0")
                    .header("X-Request-Id", java.util.UUID.randomUUID().toString())
                    .header("X-Forwarded-By", "hypertube-gateway")
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }

    public static class Config {
        private boolean enabled = true;

        public Config() {}

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }
} 