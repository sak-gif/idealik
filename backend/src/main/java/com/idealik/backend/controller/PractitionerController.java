package com.idealik.backend.controller;

import com.idealik.backend.dto.PractitionerProfileDto;
import com.idealik.backend.model.Practitioner;
import com.idealik.backend.model.ServiceEntity;
import com.idealik.backend.service.AuthService;
import com.idealik.backend.service.PractitionerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/practitioners")
public class PractitionerController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PractitionerService practitionerService;

    private ResponseEntity<?> getUnauthorizedResponse() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or missing authorization token"));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader(value = "Authorization", required = false) String token,
            @Valid @RequestBody PractitionerProfileDto dto) {
        
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) {
            return getUnauthorizedResponse();
        }

        try {
            Practitioner updated = practitionerService.updateProfile(practitioner, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/services")
    public ResponseEntity<?> getServices(@RequestHeader(value = "Authorization", required = false) String token) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) {
            return getUnauthorizedResponse();
        }

        List<ServiceEntity> services = practitionerService.getServices(practitioner);
        return ResponseEntity.ok(services);
    }

    @PostMapping("/services")
    public ResponseEntity<?> addService(
            @RequestHeader(value = "Authorization", required = false) String token,
            @Valid @RequestBody ServiceEntity service) {
        
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) {
            return getUnauthorizedResponse();
        }

        try {
            ServiceEntity created = practitionerService.addService(practitioner, service);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<?> updateService(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id,
            @Valid @RequestBody ServiceEntity service) {
        
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) {
            return getUnauthorizedResponse();
        }

        try {
            ServiceEntity updated = practitionerService.updateService(practitioner, id, service);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) {
            return getUnauthorizedResponse();
        }

        try {
            practitionerService.deleteService(practitioner, id);
            return ResponseEntity.ok(Map.of("message", "Service deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @GetMapping("/public/{phoneNumber}")
    public ResponseEntity<?> getPublicProfileByPhone(@PathVariable String phoneNumber) {
        try {
            Practitioner practitioner = practitionerService.getPractitionerByPhone(phoneNumber);
            List<ServiceEntity> services = practitionerService.getServices(practitioner);
            // Don't send sensitive details like password hash, email can be included if public
            return ResponseEntity.ok(Map.of(
                "id", practitioner.getId(),
                "name", practitioner.getName() != null ? practitioner.getName() : "",
                "businessName", practitioner.getBusinessName() != null ? practitioner.getBusinessName() : "",
                "description", practitioner.getDescription() != null ? practitioner.getDescription() : "",
                "photoUrl", practitioner.getPhotoUrl() != null ? practitioner.getPhotoUrl() : "",
                "phoneNumber", practitioner.getPhoneNumber() != null ? practitioner.getPhoneNumber() : "",
                "services", services
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }
}
