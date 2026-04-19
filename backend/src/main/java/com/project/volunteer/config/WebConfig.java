package com.project.volunteer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS Configuration
 *
 * WHY THIS IS NEEDED:
 * ─────────────────────────────────────────────────────────────────────────
 * @CrossOrigin on each controller only handles the actual request.
 * But browsers first send an HTTP OPTIONS "preflight" request to check
 * if the cross-origin call is allowed. Spring Boot does NOT handle
 * OPTIONS automatically — so the preflight gets no CORS headers back,
 * the browser blocks the real request, and you see "Unable to connect".
 *
 * This global config handles ALL requests including OPTIONS preflight,
 * fixing the issue completely regardless of which PC or browser is used.
 * ─────────────────────────────────────────────────────────────────────────
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")              // Apply to ALL endpoints
                .allowedOrigins("*")            // Allow requests from any origin
                .allowedMethods(               // Allow all HTTP methods
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS",             // ← This is the key fix (preflight)
                        "PATCH",
                        "HEAD"
                )
                .allowedHeaders("*")           // Allow all request headers
                .exposedHeaders(               // Expose these headers to the browser
                        "Authorization",
                        "Content-Type"
                )
                .maxAge(3600);                 // Cache preflight response for 1 hour
    }
}
