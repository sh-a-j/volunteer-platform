package com.project.volunteer.service;

import com.project.volunteer.model.Enrollment;
import com.project.volunteer.model.Event;
import com.project.volunteer.model.User;
import com.project.volunteer.repository.EnrollmentRepository;
import com.project.volunteer.repository.EventRepository;
import com.project.volunteer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> enroll(Long userId, Long eventId) {
        Map<String, Object> response = new HashMap<>();

        // Check if already enrolled
        Optional<Enrollment> existing = enrollmentRepository.findByUserIdAndEventId(userId, eventId);
        if (existing.isPresent()) {
            response.put("success", false);
            response.put("message", "Already enrolled in this event");
            return response;
        }

        // Check event capacity
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Event not found");
            return response;
        }

        Event event = eventOpt.get();
        long acceptedCount = enrollmentRepository.countByEventIdAndStatus(eventId, "ACCEPTED");
        if (acceptedCount >= event.getMaxVolunteers()) {
            response.put("success", false);
            response.put("message", "Event is at full capacity");
            return response;
        }

        Enrollment enrollment = new Enrollment(userId, eventId, "PENDING");
        Enrollment saved = enrollmentRepository.save(enrollment);
        response.put("success", true);
        response.put("message", "Enrolled successfully");
        response.put("enrollment", saved);
        return response;
    }

    public List<Map<String, Object>> getEnrollmentsByUser(Long userId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Map<String, Object> item = new HashMap<>();
            item.put("enrollment", enrollment);
            eventRepository.findById(enrollment.getEventId()).ifPresent(event -> item.put("event", event));
            result.add(item);
        }
        return result;
    }

    public List<Map<String, Object>> getEnrollmentsByEvent(Long eventId) {
        List<Enrollment> enrollments = enrollmentRepository.findByEventId(eventId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Map<String, Object> item = new HashMap<>();
            item.put("enrollment", enrollment);
            userRepository.findById(enrollment.getUserId()).ifPresent(user -> {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("name", user.getName());
                userInfo.put("email", user.getEmail());
                userInfo.put("availabilityDays", user.getAvailabilityDays());
                userInfo.put("availabilityTime", user.getAvailabilityTime());
                item.put("user", userInfo);
            });
            result.add(item);
        }
        return result;
    }

    public Map<String, Object> updateEnrollmentStatus(Long enrollmentId, String status) {
        Map<String, Object> response = new HashMap<>();
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);

        if (enrollmentOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Enrollment not found");
            return response;
        }

        Enrollment enrollment = enrollmentOpt.get();
        enrollment.setStatus(status);
        enrollmentRepository.save(enrollment);
        response.put("success", true);
        response.put("message", "Status updated to " + status);
        response.put("enrollment", enrollment);
        return response;
    }
}
