package com.project.volunteer.controller;

import com.project.volunteer.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enroll")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> enroll(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        Long eventId = body.get("eventId");
        Map<String, Object> response = enrollmentService.enroll(userId, eventId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getEnrollmentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByUser(userId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Map<String, Object>>> getEnrollmentsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByEvent(eventId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Map<String, Object> response = enrollmentService.updateEnrollmentStatus(id, status);
        return ResponseEntity.ok(response);
    }
}
