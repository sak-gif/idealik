package com.idealik.backend.controller;

import com.idealik.backend.model.Practitioner;
import com.idealik.backend.model.Booking;
import com.idealik.backend.repository.PractitionerRepository;
import com.idealik.backend.repository.BookingRepository;
import com.idealik.backend.repository.ContactMessageRepository;
import com.idealik.backend.model.ContactMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private PractitionerRepository practitionerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private EntityManager entityManager;

    private static final String ADMIN_TOKEN = "admin_ideal_secret_token";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if ("admin_ideal".equals(username) && "admin".equals(password)) {
            return ResponseEntity.ok(Map.of("token", ADMIN_TOKEN, "message", "Admin logged in successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
    }

    private boolean isAuthorized(String token) {
        return token != null && token.replace("Bearer ", "").equals(ADMIN_TOKEN);
    }

    @GetMapping("/practitioners")
    public ResponseEntity<?> getPractitioners(@RequestHeader(value = "Authorization", required = false) String token) {
        if (!isAuthorized(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        List<Practitioner> practitioners = practitionerRepository.findAll();
        List<Map<String, Object>> dto = practitioners.stream().map(p -> Map.<String, Object>of(
            "id", p.getId(),
            "businessName", p.getBusinessName() != null ? p.getBusinessName() : "",
            "email", p.getEmail(),
            "phoneNumber", p.getPhoneNumber() != null ? p.getPhoneNumber() : "",
            "description", p.getDescription() != null ? p.getDescription() : ""
        )).collect(Collectors.toList());

        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/practitioners/{id}")
    @Transactional
    public ResponseEntity<?> deletePractitioner(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        if (!isAuthorized(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        Practitioner p = practitionerRepository.findById(id).orElse(null);
        if (p == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Practitioner not found."));
        }

        try {
            entityManager.createQuery("DELETE FROM Booking b WHERE b.practitioner = :p").setParameter("p", p).executeUpdate();
            entityManager.createQuery("DELETE FROM ServiceEntity s WHERE s.practitioner = :p").setParameter("p", p).executeUpdate();
            entityManager.createQuery("DELETE FROM ScheduleConfiguration sc WHERE sc.practitioner = :p").setParameter("p", p).executeUpdate();
            entityManager.createQuery("DELETE FROM RecurringLockin rl WHERE rl.practitioner = :p").setParameter("p", p).executeUpdate();
            entityManager.createQuery("DELETE FROM ExceptionSlot es WHERE es.practitioner = :p").setParameter("p", p).executeUpdate();
            entityManager.createQuery("DELETE FROM Slot sl WHERE sl.practitioner = :p").setParameter("p", p).executeUpdate();

            practitionerRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Practitioner deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete practitioner: " + e.getMessage()));
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<?> getMessages(@RequestHeader(value = "Authorization", required = false) String token) {
        if (!isAuthorized(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        
        List<ContactMessage> messages = contactMessageRepository.findAll();
        // Sort by newest first
        messages.sort((m1, m2) -> m2.getCreatedAt().compareTo(m1.getCreatedAt()));
        
        return ResponseEntity.ok(messages);
    }
}
