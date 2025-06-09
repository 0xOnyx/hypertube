package com.hypertube.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;

/**
 * Simplified Logging Gateway Filter
 */
@Component
public class LoggingGatewayFilterFactory extends AbstractGatewayFilterFactory<LoggingGatewayFilterFactory.Config> {

    public LoggingGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String routeName = config.getRouteName();
            String traceId = java.util.UUID.randomUUID().toString().substring(0, 8);
            
            // Add trace ID to request headers
            var modifiedRequest = exchange.getRequest().mutate()
                    .header("X-Trace-Id", traceId)
                    .build();

            // Log request
            System.out.println(String.format("[%s] %s %s - Trace: %s", 
                    routeName, 
                    exchange.getRequest().getMethod(), 
                    exchange.getRequest().getURI().getPath(),
                    traceId));

            return chain.filter(exchange.mutate().request(modifiedRequest).build())
                    .doOnSuccess(aVoid -> {
                        // Log successful response
                        System.out.println(String.format("[%s] Response completed - Trace: %s", routeName, traceId));
                    })
                    .doOnError(throwable -> {
                        // Log error
                        System.err.println(String.format("[%s] Error: %s - Trace: %s", routeName, throwable.getMessage(), traceId));
                    });
        };
    }

    public static class Config {
        private String routeName = "UNKNOWN";

        public Config() {}

        public Config(String routeName) {
            this.routeName = routeName;
        }

        public String getRouteName() { return routeName; }
        public void setRouteName(String routeName) { this.routeName = routeName; }
    }
} 