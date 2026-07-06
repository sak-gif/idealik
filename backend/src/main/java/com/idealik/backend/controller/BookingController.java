package com.idealik.backend.controller;

import com.idealik.backend.dto.BookingRequest;
import com.idealik.backend.dto.ScheduleConfigRequest;
import com.idealik.backend.model.Booking;
import com.idealik.backend.model.Practitioner;
import com.idealik.backend.model.ScheduleConfiguration;
import com.idealik.backend.service.AuthService;
import com.idealik.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private AuthService authService;

    /**
     * PUBLIC endpoint: Create a booking (from customer booking page).
     * No auth required - customers don't need an account.
     */
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", booking.getId(),
                "status", booking.getBookingStatus(),
                "message", "Booking created successfully"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * PROVIDER endpoint: Get all bookings for the authenticated practitioner.
     */
    @PostMapping("/block")
    public ResponseEntity<?> blockSlot(@RequestHeader(value = "Authorization", required = false) String token, @RequestBody java.util.Map<String, String> payload) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("message", "Unauthorized"));
        }
        Booking booking = bookingService.blockSlot(practitioner, payload.get("slotDate"), payload.get("slotTime"));
        return ResponseEntity.ok(java.util.Map.of("message", "Slot blocked", "id", booking.getId()));
    }

    @GetMapping
    public ResponseEntity<?> getBookings(@RequestHeader(value = "Authorization", required = false) String token) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        List<Booking> bookings = bookingService.getBookingsForPractitioner(practitioner.getId());
        // Map to a safe DTO to avoid JPA lazy-loading serialization issues
        List<Map<String, Object>> bookingDtos = bookings.stream()
            .map(b -> {
                Map<String, Object> dto = new java.util.HashMap<>();
                dto.put("id", b.getId());
                dto.put("slotDate", b.getSlotDate() != null ? b.getSlotDate() : "");
                dto.put("slotTime", b.getSlotTime() != null ? b.getSlotTime() : "");
                dto.put("bookingStatus", b.getBookingStatus() != null ? b.getBookingStatus() : "");
                dto.put("clientName", b.getClientName() != null ? b.getClientName() : "");
                dto.put("clientEmail", b.getClientEmail() != null ? b.getClientEmail() : "");
                dto.put("clientPhone", b.getClientPhone() != null ? b.getClientPhone() : "");
                dto.put("clientNotes", b.getClientNotes() != null ? b.getClientNotes() : "");
                dto.put("paymentMethod", b.getPaymentMethod() != null ? b.getPaymentMethod() : "");
                dto.put("paymentStatus", b.getPaymentStatus() != null ? b.getPaymentStatus() : "");
                return dto;
            })
            .toList();
        return ResponseEntity.ok(bookingDtos);
    }

    /**
     * PROVIDER endpoint: Accept a pending booking.
     */
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptBooking(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        try {
            Booking booking = bookingService.acceptBooking(practitioner, id);
            return ResponseEntity.ok(Map.of("id", booking.getId(), "status", booking.getBookingStatus()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * PROVIDER endpoint: Decline a pending booking.
     */
    @PutMapping("/{id}/decline")
    public ResponseEntity<?> declineBooking(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        try {
            Booking booking = bookingService.declineBooking(practitioner, id);
            return ResponseEntity.ok(Map.of("id", booking.getId(), "status", booking.getBookingStatus()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * PROVIDER endpoint: Get schedule configuration.
     */
    @GetMapping("/schedule-config")
    public ResponseEntity<?> getScheduleConfig(@RequestHeader(value = "Authorization", required = false) String token) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        ScheduleConfiguration config = bookingService.getScheduleConfig(practitioner);
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("startTime", config.getStandardStartTime().toString());
        resp.put("endTime", config.getStandardEndTime().toString());
        resp.put("slotDuration", config.getSlotDuration() != null ? config.getSlotDuration() : 60);
        resp.put("customSlotDuration", config.getCustomSlotDuration() != null ? config.getCustomSlotDuration() : 0);
        resp.put("effectiveSlotDuration", bookingService.getEffectiveSlotDuration(config));
        resp.put("weekendDays", config.getWeekendDays() != null ? config.getWeekendDays() : "SATURDAY,SUNDAY");
        resp.put("isPublished", config.getIsPublished() != null ? config.getIsPublished() : false);
        return ResponseEntity.ok(resp);
    }

    /**
     * PROVIDER endpoint: Update schedule configuration.
     */
    @PutMapping("/schedule-config")
    public ResponseEntity<?> updateScheduleConfig(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody ScheduleConfigRequest request) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        try {
            ScheduleConfiguration config = bookingService.updateScheduleConfig(practitioner, request);
            java.util.Map<String, Object> resp = new java.util.HashMap<>();
            resp.put("startTime", config.getStandardStartTime().toString());
            resp.put("endTime", config.getStandardEndTime().toString());
            resp.put("slotDuration", config.getSlotDuration());
            resp.put("customSlotDuration", config.getCustomSlotDuration() != null ? config.getCustomSlotDuration() : 0);
            resp.put("effectiveSlotDuration", bookingService.getEffectiveSlotDuration(config));
            resp.put("weekendDays", config.getWeekendDays());
            resp.put("isPublished", config.getIsPublished());
            resp.put("message", "Schedule configuration updated");
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * PUBLIC endpoint: Get schedule config for a specific practitioner (for booking page).
     */
    @GetMapping("/schedule-config/{practitionerId}")
    public ResponseEntity<?> getPublicScheduleConfig(@PathVariable Long practitionerId) {
        Practitioner practitioner = new Practitioner();
        practitioner.setId(practitionerId);

        ScheduleConfiguration config = bookingService.getScheduleConfig(practitioner);
        int effective = bookingService.getEffectiveSlotDuration(config);
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("startTime", config.getStandardStartTime().toString());
        resp.put("endTime", config.getStandardEndTime().toString());
        resp.put("slotDuration", effective);
        resp.put("weekendDays", config.getWeekendDays() != null ? config.getWeekendDays() : "SATURDAY,SUNDAY");
        resp.put("sessionDuration", effective + " min");
        return ResponseEntity.ok(resp);
    }

    /**
     * PUBLIC endpoint: Get masked bookings for a practitioner.
     */
    @GetMapping("/public/bookings/{practitionerId}")
    public ResponseEntity<?> getPublicBookings(@PathVariable Long practitionerId) {
        List<Booking> bookings = bookingService.getBookingsForPractitioner(practitionerId);
        List<Map<String, Object>> publicBookings = bookings.stream()
            .map(b -> Map.<String, Object>of(
                "id", b.getId(),
                "slotDate", b.getSlotDate() != null ? b.getSlotDate() : "",
                "slotTime", b.getSlotTime() != null ? b.getSlotTime() : "",
                "status", b.getBookingStatus() != null ? b.getBookingStatus() : ""
            ))
            .toList();
        return ResponseEntity.ok(publicBookings);
    }

    // ─── Recurring Lock-in Endpoints ───

    @GetMapping("/recurring-lockins")
    public ResponseEntity<?> getRecurringLockins(@RequestHeader(value = "Authorization", required = false) String token) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));

        List<com.idealik.backend.model.RecurringLockin> lockins = bookingService.getRecurringLockins(practitioner.getId());
        List<Map<String, Object>> dtos = lockins.stream().map(l -> {
            java.util.Map<String, Object> m = new java.util.HashMap<>();
            m.put("id", l.getId());
            m.put("clientName", l.getClientName());
            m.put("dayOfWeek", l.getDayOfWeek());
            m.put("time", l.getTime());
            return m;
        }).toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/recurring-lockins")
    public ResponseEntity<?> addRecurringLockin(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Map<String, String> payload) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));

        var lockin = bookingService.addRecurringLockin(practitioner, payload.get("clientName"), payload.get("dayOfWeek"), payload.get("time"));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", lockin.getId(), "clientName", lockin.getClientName(), "dayOfWeek", lockin.getDayOfWeek(), "time", lockin.getTime()));
    }

    @DeleteMapping("/recurring-lockins/{id}")
    public ResponseEntity<?> deleteRecurringLockin(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        bookingService.deleteRecurringLockin(practitioner, id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    @GetMapping("/public/recurring-lockins/{practitionerId}")
    public ResponseEntity<?> getPublicRecurringLockins(@PathVariable Long practitionerId) {
        List<com.idealik.backend.model.RecurringLockin> lockins = bookingService.getRecurringLockins(practitionerId);
        List<Map<String, Object>> dtos = lockins.stream().map(l -> Map.<String, Object>of(
            "dayOfWeek", l.getDayOfWeek(), "time", l.getTime()
        )).toList();
        return ResponseEntity.ok(dtos);
    }

    // ─── Exception Slot Endpoints ───

    @GetMapping("/exception-slots")
    public ResponseEntity<?> getExceptionSlots(@RequestHeader(value = "Authorization", required = false) String token) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));

        List<com.idealik.backend.model.ExceptionSlot> exceptions = bookingService.getExceptionSlots(practitioner.getId());
        List<Map<String, Object>> dtos = exceptions.stream().map(e -> {
            java.util.Map<String, Object> m = new java.util.HashMap<>();
            m.put("id", e.getId());
            m.put("date", e.getDate());
            m.put("time", e.getTime());
            m.put("reason", e.getReason());
            return m;
        }).toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/exception-slots")
    public ResponseEntity<?> addExceptionSlot(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Map<String, String> payload) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));

        var exc = bookingService.addExceptionSlot(practitioner, payload.get("date"), payload.get("time"), payload.get("reason"));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", exc.getId(), "date", exc.getDate(), "time", exc.getTime(), "reason", exc.getReason()));
    }

    @DeleteMapping("/exception-slots/{id}")
    public ResponseEntity<?> deleteExceptionSlot(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        Practitioner practitioner = authService.resolveToken(token).orElse(null);
        if (practitioner == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        bookingService.deleteExceptionSlot(practitioner, id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    @GetMapping("/public/exception-slots/{practitionerId}")
    public ResponseEntity<?> getPublicExceptionSlots(@PathVariable Long practitionerId) {
        List<com.idealik.backend.model.ExceptionSlot> exceptions = bookingService.getExceptionSlots(practitionerId);
        List<Map<String, Object>> dtos = exceptions.stream().map(e -> Map.<String, Object>of(
            "date", e.getDate(), "time", e.getTime(), "reason", e.getReason()
        )).toList();
        return ResponseEntity.ok(dtos);
    }
}
