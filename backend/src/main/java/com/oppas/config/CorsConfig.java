package com.oppas.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://127.0.0.1:5500","http://127.0.0.1:9999","http://127.0.0.1:8080","http://127.0.0.1:8081","http://localhost:3000", "http://localhost:8081")
                .allowedMethods("*")
                .allowCredentials(true);
    }

}
