package com.oppas.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://3.36.131.236:5500", "http://3.36.131.236:9999", "http://3.36.131.236:8080", "http://3.36.131.236:8081", "http://3.36.131.236", "http://3.36.131.236:8081", "http://localhost:3000")
                .allowedMethods("*")
                .allowCredentials(true);
    }

}

