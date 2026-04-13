package com.project.volunteer.service;

import com.project.volunteer.model.Event;
import com.project.volunteer.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getEventsByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId);
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            event.setTitle(updatedEvent.getTitle());
            event.setDescription(updatedEvent.getDescription());
            event.setDate(updatedEvent.getDate());
            event.setTime(updatedEvent.getTime());
            event.setDuration(updatedEvent.getDuration());
            event.setLocation(updatedEvent.getLocation());
            event.setSkills(updatedEvent.getSkills());
            event.setMaxVolunteers(updatedEvent.getMaxVolunteers());
            return eventRepository.save(event);
        }
        return null;
    }

    public Map<String, Object> deleteEvent(Long id) {
        Map<String, Object> response = new HashMap<>();
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "Event deleted successfully");
        } else {
            response.put("success", false);
            response.put("message", "Event not found");
        }
        return response;
    }
}
