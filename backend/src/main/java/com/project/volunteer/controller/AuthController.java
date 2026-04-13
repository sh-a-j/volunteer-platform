package com.project.volunteer.controller;

import com.project.volunteer.model.User;
import com.project.volunteer.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> response = authService.register(user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Map<String, Object> response = authService.login(email, password);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{userId}/availability")
    public ResponseEntity<Map<String, Object>> updateAvailability(
            @PathVariable Long userId,
            @RequestBody Map<String, String> availability) {
        String days = availability.get("availabilityDays");
        String time = availability.get("availabilityTime");
        Map<String, Object> response = authService.updateAvailability(userId, days, time);
        return ResponseEntity.ok(response);
    }
}
