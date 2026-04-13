package com.project.volunteer.service;

import com.project.volunteer.model.User;
import com.project.volunteer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> register(User user) {
        Map<String, Object> response = new HashMap<>();

        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered");
            return response;
        }

        User saved = userRepository.save(user);
        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("user", saved);
        return response;
    }

    public Map<String, Object> login(String email, String password) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Invalid password");
            return response;
        }

        response.put("success", true);
        response.put("message", "Login successful");
        response.put("user", user);
        return response;
    }

    public Map<String, Object> updateAvailability(Long userId, String days, String time) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }
        User user = userOpt.get();
        user.setAvailabilityDays(days);
        user.setAvailabilityTime(time);
        userRepository.save(user);
        response.put("success", true);
        response.put("message", "Availability updated");
        response.put("user", user);
        return response;
    }
}
