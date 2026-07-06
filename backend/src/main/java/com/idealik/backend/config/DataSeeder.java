package com.idealik.backend.config;

import com.idealik.backend.model.Practitioner;
import com.idealik.backend.model.ScheduleConfiguration;
import com.idealik.backend.model.ServiceEntity;
import com.idealik.backend.repository.PractitionerRepository;
import com.idealik.backend.repository.ScheduleConfigurationRepository;
import com.idealik.backend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Seeds the database with Mohamed Cheikh's practitioner account on startup.
 * This only runs if the account does not already exist.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private PractitionerRepository practitionerRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ScheduleConfigurationRepository scheduleConfigurationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        String email = "medcheikh@gmail.com";

        // Only seed if the practitioner doesn't already exist
        if (practitionerRepository.findByEmail(email).isPresent()) {
            System.out.println("[DataSeeder] Mohamed Cheikh account already exists. Skipping seed.");
            return;
        }

        System.out.println("[DataSeeder] Seeding Mohamed Cheikh's practitioner account...");

        // ── 1. Create Practitioner ──
        Practitioner practitioner = new Practitioner();
        practitioner.setName("Mohamed Cheickh");
        practitioner.setEmail(email);
        practitioner.setPasswordHash(passwordEncoder.encode("med"));
        practitioner.setBusinessName("Mohamed Cheickh");
        practitioner.setPhoneNumber("+212600000000");
        practitioner.setDescription(
            "Compassionate Primary Care Physician. We provide personalized health assessments " +
            "and comprehensive IVI plans to optimize your well-being both in secure tell-health."
        );
        practitioner.setPhotoUrl("/doctor-avatar.png");
        practitioner.setSharingLink("idealnowpaa.com/medcheikh");
        practitioner.setQrCodeUrl("");

        practitioner = practitionerRepository.save(practitioner);

        // ── 2. Seed Services ──

        // Service 1: Telehealth Consultation
        ServiceEntity telehealth = new ServiceEntity();
        telehealth.setTitle("Telehealth consultation");
        telehealth.setDescription("A secure video call consultation with a licensed practitioner.");
        telehealth.setPrice(new BigDecimal("120.00"));
        telehealth.setPhotoUrl("/telehealth.png");
        telehealth.setPractitioner(practitioner);
        serviceRepository.save(telehealth);

        // Service 2: Diagnostic Assessment
        ServiceEntity diagnostics = new ServiceEntity();
        diagnostics.setTitle("Diagnostic Assessment");
        diagnostics.setDescription("Comprehensive analysis and assessment of symptoms and history.");
        diagnostics.setPrice(new BigDecimal("350.00"));
        diagnostics.setPhotoUrl("/diagnostic.png");
        diagnostics.setPractitioner(practitioner);
        serviceRepository.save(diagnostics);

        // Service 3: Prescription Renewal
        ServiceEntity prescription = new ServiceEntity();
        prescription.setTitle("Prescription Renewal");
        prescription.setDescription("Quick consultation for standard prescription refills and adjustments.");
        prescription.setPrice(new BigDecimal("350.00"));
        prescription.setPhotoUrl("/prescription.png");
        prescription.setPractitioner(practitioner);
        serviceRepository.save(prescription);

        // ── 3. Seed Default Schedule Configuration ──
        ScheduleConfiguration config = new ScheduleConfiguration();
        config.setStartDate(LocalDate.now());
        config.setEndDate(LocalDate.now().plusDays(10));
        config.setStandardStartTime(LocalTime.of(9, 0));
        config.setStandardEndTime(LocalTime.of(20, 0));
        config.setWeekendDays("SATURDAY,SUNDAY");
        config.setIsPublished(true);
        config.setPractitioner(practitioner);
        scheduleConfigurationRepository.save(config);

        System.out.println("[DataSeeder] ✅ Mohamed Cheikh seeded successfully!");
        System.out.println("[DataSeeder]    Email: " + email);
        System.out.println("[DataSeeder]    Password: med");
        System.out.println("[DataSeeder]    Services: 3 (Telehealth, Diagnostic, Prescription)");
        System.out.println("[DataSeeder]    Schedule: Published, 09:00-20:00");
    }
}
