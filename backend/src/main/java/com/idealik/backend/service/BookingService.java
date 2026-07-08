package com.idealik.backend.service;

import com.idealik.backend.dto.BookingRequest;
import com.idealik.backend.dto.ScheduleConfigRequest;
import com.idealik.backend.model.*;
import com.idealik.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PractitionerRepository practitionerRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ScheduleConfigurationRepository scheduleConfigRepository;

    @Autowired
    private RecurringLockinRepository recurringLockinRepository;

    @Autowired
    private ExceptionSlotRepository exceptionSlotRepository;

    @Autowired
    private SmsNotificationService smsNotificationService;

    /**
     * Create a new booking from a customer request.
     * Cash payments default to "pending" status.
     */
    @Transactional
    public Booking createBooking(BookingRequest request) {
        Practitioner practitioner = practitionerRepository.findById(request.getPractitionerId())
            .orElseThrow(() -> new IllegalArgumentException("Practitioner not found"));

        // Check for duplicate booking at same slot
        List<Booking> existing = bookingRepository.findByPractitionerIdAndSlotDateAndSlotTime(
            request.getPractitionerId(), request.getSlotDate(), request.getSlotTime()
        );
        boolean hasActiveBooking = existing.stream()
            .anyMatch(b -> !"declined".equals(b.getBookingStatus()));
        if (hasActiveBooking) {
            throw new IllegalArgumentException("This time slot is already booked");
        }

        Booking booking = new Booking();
        booking.setPractitioner(practitioner);
        booking.setClientName(request.getFullName());
        booking.setClientEmail(request.getEmail());
        booking.setClientPhone(request.getPhone());
        booking.setClientNotes(request.getNotes());
        booking.setSlotDate(request.getSlotDate());
        booking.setSlotTime(request.getSlotTime());
        booking.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "cash");

        // Cash payments start as "pending", card payments as "confirmed"
        if ("card".equals(request.getPaymentMethod())) {
            booking.setBookingStatus("confirmed");
            booking.setPaymentStatus("paid");
        } else {
            booking.setBookingStatus("pending");
            booking.setPaymentStatus("unpaid");
        }

        // Link service if provided
        if (request.getServiceId() != null) {
            ServiceEntity service = serviceRepository.findById(request.getServiceId()).orElse(null);
            booking.setService(service);
        }

        Booking savedBooking = bookingRepository.save(booking);

        // Send SMS notification to the customer
        String smsMessage = String.format(
            "Hello %s! Your appointment with %s on %s at %s has been successfully booked. Thank you for using iDAELİK!",
            savedBooking.getClientName(),
            practitioner.getBusinessName() != null ? practitioner.getBusinessName() : practitioner.getName(),
            savedBooking.getSlotDate(),
            savedBooking.getSlotTime()
        );
        smsNotificationService.sendSms(savedBooking.getClientPhone(), smsMessage);

        return savedBooking;
    }

    /**
     * Get all bookings for a practitioner.
     */
    public List<Booking> getBookingsForPractitioner(Long practitionerId) {
        return bookingRepository.findByPractitionerId(practitionerId);
    }

    /**
     * Provider accepts a pending booking → confirmed.
     */
    @Transactional
    public Booking acceptBooking(Practitioner practitioner, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getPractitioner().getId().equals(practitioner.getId())) {
            throw new SecurityException("Unauthorized");
        }

        booking.setBookingStatus("confirmed");
        Booking savedBooking = bookingRepository.save(booking);

        // Send SMS notification to the customer
        if (savedBooking.getClientPhone() != null && !savedBooking.getClientPhone().trim().isEmpty()) {
            String smsMessage = String.format(
                "Hello %s! Good news, your reservation with %s on %s at %s has been ACCEPTED. See you then!",
                savedBooking.getClientName(),
                practitioner.getBusinessName() != null ? practitioner.getBusinessName() : practitioner.getName(),
                savedBooking.getSlotDate(),
                savedBooking.getSlotTime()
            );
            smsNotificationService.sendSms(savedBooking.getClientPhone(), smsMessage);
        }

        return savedBooking;
    }

    /**
     * Provider rejects a pending booking → declined (frees the slot).
     */
    @Transactional
    public Booking declineBooking(Practitioner practitioner, Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getPractitioner().getId().equals(practitioner.getId())) {
            throw new SecurityException("Unauthorized");
        }

        booking.setBookingStatus("declined");
        Booking savedBooking = bookingRepository.save(booking);

        // Send SMS notification
        if (savedBooking.getClientPhone() != null && !savedBooking.getClientPhone().trim().isEmpty()) {
            String reasonText = (reason != null && !reason.trim().isEmpty()) ? " Reason: " + reason.trim() : "";
            String smsMessage = String.format(
                "Hello %s. Unfortunately, your reservation with %s on %s at %s has been DECLINED.%s",
                savedBooking.getClientName(),
                practitioner.getBusinessName() != null ? practitioner.getBusinessName() : practitioner.getName(),
                savedBooking.getSlotDate(),
                savedBooking.getSlotTime(),
                reasonText
            );
            smsNotificationService.sendSms(savedBooking.getClientPhone(), smsMessage);
        }

        return savedBooking;
    }
    @Transactional
    public Booking blockSlot(Practitioner practitioner, String slotDate, String slotTime) {
        Booking booking = new Booking();
        booking.setPractitioner(practitioner);
        booking.setSlotDate(slotDate);
        booking.setSlotTime(slotTime);
        booking.setBookingStatus("blocked");
        booking.setClientName("UNAVAILABLE");
        booking.setPaymentStatus("none");
        return bookingRepository.save(booking);
    }
    /**
     * Update or create schedule configuration for a practitioner.
     */
    @Transactional
    public ScheduleConfiguration updateScheduleConfig(Practitioner practitioner, ScheduleConfigRequest request) {
        List<ScheduleConfiguration> configs = scheduleConfigRepository.findByPractitionerId(practitioner.getId());
        
        ScheduleConfiguration config;
        if (!configs.isEmpty()) {
            config = configs.get(0); // Use first config
        } else {
            config = new ScheduleConfiguration();
            config.setPractitioner(practitioner);
        }

        config.setStandardStartTime(LocalTime.parse(request.getStartTime()));
        config.setStandardEndTime(LocalTime.parse(request.getEndTime()));
        config.setSlotDuration(request.getSlotDuration());
        config.setCustomSlotDuration(request.getCustomSlotDuration() > 0 ? request.getCustomSlotDuration() : null);
        config.setWeekendDays(request.getWeekendDays());
        config.setStartDate(LocalDate.now());
        config.setEndDate(LocalDate.now().plusDays(7));
        config.setIsPublished(true);

        return scheduleConfigRepository.save(config);
    }

    /**
     * Get schedule configuration for a practitioner.
     */
    public ScheduleConfiguration getScheduleConfig(Practitioner practitioner) {
        List<ScheduleConfiguration> configs = scheduleConfigRepository.findByPractitionerId(practitioner.getId());
        if (configs.isEmpty()) {
            // Return default config
            ScheduleConfiguration defaultConfig = new ScheduleConfiguration();
            defaultConfig.setStandardStartTime(LocalTime.of(9, 0));
            defaultConfig.setStandardEndTime(LocalTime.of(17, 0));
            defaultConfig.setSlotDuration(60);
            defaultConfig.setCustomSlotDuration(null);
            defaultConfig.setWeekendDays("SATURDAY,SUNDAY");
            defaultConfig.setIsPublished(false);
            defaultConfig.setPractitioner(practitioner);
            return defaultConfig;
        }
        return configs.get(0);
    }

    /**
     * Compute the effective slot duration. If slotDuration is -1 (custom), use customSlotDuration.
     */
    public int getEffectiveSlotDuration(ScheduleConfiguration config) {
        if (config.getSlotDuration() != null && config.getSlotDuration() == -1 && config.getCustomSlotDuration() != null) {
            return config.getCustomSlotDuration();
        }
        return config.getSlotDuration() != null ? config.getSlotDuration() : 60;
    }

    // ─── Recurring Lock-in CRUD ───

    public List<RecurringLockin> getRecurringLockins(Long practitionerId) {
        return recurringLockinRepository.findByPractitionerId(practitionerId);
    }

    @Transactional
    public RecurringLockin addRecurringLockin(Practitioner practitioner, String clientName, String dayOfWeek, String time) {
        RecurringLockin lockin = new RecurringLockin();
        lockin.setPractitioner(practitioner);
        lockin.setClientName(clientName);
        lockin.setDayOfWeek(dayOfWeek);
        lockin.setTime(time);
        return recurringLockinRepository.save(lockin);
    }

    @Transactional
    public void deleteRecurringLockin(Practitioner practitioner, Long lockinId) {
        RecurringLockin lockin = recurringLockinRepository.findById(lockinId)
            .orElseThrow(() -> new IllegalArgumentException("Recurring lock-in not found"));
        if (!lockin.getPractitioner().getId().equals(practitioner.getId())) {
            throw new SecurityException("Unauthorized");
        }
        recurringLockinRepository.delete(lockin);
    }

    // ─── Exception Slot CRUD ───

    public List<ExceptionSlot> getExceptionSlots(Long practitionerId) {
        return exceptionSlotRepository.findByPractitionerId(practitionerId);
    }

    @Transactional
    public ExceptionSlot addExceptionSlot(Practitioner practitioner, String date, String time, String reason) {
        ExceptionSlot exception = new ExceptionSlot();
        exception.setPractitioner(practitioner);
        exception.setDate(date);
        exception.setTime(time);
        exception.setReason(reason != null && !reason.isEmpty() ? reason : "Unavailable");
        return exceptionSlotRepository.save(exception);
    }

    @Transactional
    public void deleteExceptionSlot(Practitioner practitioner, Long exceptionId) {
        ExceptionSlot exception = exceptionSlotRepository.findById(exceptionId)
            .orElseThrow(() -> new IllegalArgumentException("Exception not found"));
        if (!exception.getPractitioner().getId().equals(practitioner.getId())) {
            throw new SecurityException("Unauthorized");
        }
        exceptionSlotRepository.delete(exception);
    }
}

