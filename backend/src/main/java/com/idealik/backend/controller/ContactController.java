package com.idealik.backend.controller;

import com.idealik.backend.model.ContactMessage;
import com.idealik.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<?> submitMessage(@RequestBody ContactMessage request) {
        if (request.getFullName() == null || request.getEmail() == null || request.getMessage() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }
        contactMessageRepository.save(request);
        return ResponseEntity.ok().body("{\"message\": \"Message sent successfully\"}");
    }
}
