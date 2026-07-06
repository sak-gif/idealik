package com.idealik.backend.service;

import com.idealik.backend.dto.LoginRequest;
import com.idealik.backend.dto.RegisterRequest;
import com.idealik.backend.dto.AuthResponse;
import com.idealik.backend.model.Practitioner;
import com.idealik.backend.model.ServiceEntity;
import com.idealik.backend.repository.PractitionerRepository;
import com.idealik.backend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ConcurrentModificationException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private PractitionerRepository practitionerRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Simple thread-safe in-memory session store: token -> practitionerId
    private final Map<String, Long> activeSessions = new ConcurrentHashMap<>();

    @Transactional
    public void resetPassword(String email, String newPassword) {
        Practitioner practitioner = practitionerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No account found with that email"));
        practitioner.setPasswordHash(passwordEncoder.encode(newPassword));
        practitionerRepository.save(practitioner);
    }

    @Transactional
    public void resetPasswordByPhone(String phone, String newPassword) {
        Practitioner practitioner = practitionerRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new IllegalArgumentException("No account found with that phone number"));
        practitioner.setPasswordHash(passwordEncoder.encode(newPassword));
        practitionerRepository.save(practitioner);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (practitionerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }

        Practitioner practitioner = new Practitioner();
        practitioner.setBusinessName(request.getBusinessName());
        practitioner.setEmail(request.getEmail());
        practitioner.setPhoneNumber(request.getPhoneNumber());
        practitioner.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        // Set some default initial profile values
        practitioner.setName(request.getBusinessName()); // Default name to business name
        practitioner.setDescription("Welcome to my professional profile. Click Edit to customize your bio...");
        practitioner.setPhotoUrl(""); // Blank — will render initials placeholder
        
        // Sharing link uses phone number as unique path
        practitioner.setSharingLink("");
        practitioner.setQrCodeUrl("");

        practitioner = practitionerRepository.save(practitioner);

        // Seed default services for this new practitioner
        seedDefaultServices(practitioner);

        // Generate token and save session
        String token = UUID.randomUUID().toString();
        activeSessions.put(token, practitioner.getId());

        return new AuthResponse(
            token,
            practitioner.getId(),
            practitioner.getEmail(),
            practitioner.getName(),
            practitioner.getBusinessName(),
            practitioner.getPhoneNumber(),
            practitioner.getDescription(),
            practitioner.getPhotoUrl(),
            practitioner.getSharingLink(),
            practitioner.getQrCodeUrl()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Practitioner practitioner = practitionerRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), practitioner.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Generate token and save session
        String token = UUID.randomUUID().toString();
        activeSessions.put(token, practitioner.getId());

        return new AuthResponse(
            token,
            practitioner.getId(),
            practitioner.getEmail(),
            practitioner.getName(),
            practitioner.getBusinessName(),
            practitioner.getPhoneNumber(),
            practitioner.getDescription(),
            practitioner.getPhotoUrl(),
            practitioner.getSharingLink(),
            practitioner.getQrCodeUrl()
        );
    }

    public Optional<Practitioner> resolveToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return Optional.empty();
        }
        
        // Strip "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        Long practitionerId = activeSessions.get(token);
        if (practitionerId == null) {
            return Optional.empty();
        }

        return practitionerRepository.findById(practitionerId);
    }

    public void logout(String token) {
        if (token != null) {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            activeSessions.remove(token);
        }
    }

    private void seedDefaultServices(Practitioner practitioner) {
        // Seed exactly ONE sample "Test Service" as a guiding placeholder
        ServiceEntity testService = new ServiceEntity();
        testService.setTitle("Test Service");
        testService.setDescription("This is a sample service. Edit or delete it from your dashboard.");
        testService.setPrice(new BigDecimal("0.00"));
        testService.setPhotoUrl("");
        testService.setPractitioner(practitioner);
        serviceRepository.save(testService);
    }
}
