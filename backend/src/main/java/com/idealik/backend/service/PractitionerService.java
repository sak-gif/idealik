package com.idealik.backend.service;

import com.idealik.backend.dto.PractitionerProfileDto;
import com.idealik.backend.model.Practitioner;
import com.idealik.backend.model.ServiceEntity;
import com.idealik.backend.repository.PractitionerRepository;
import com.idealik.backend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PractitionerService {

    @Autowired
    private PractitionerRepository practitionerRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    public Practitioner updateProfile(Practitioner practitioner, PractitionerProfileDto dto) {
        practitioner.setName(dto.getName());
        practitioner.setBusinessName(dto.getBusinessName());
        practitioner.setPhoneNumber(dto.getPhone());
        practitioner.setDescription(dto.getDescription());
        practitioner.setEmail(dto.getEmail());
        if (dto.getPhotoUrl() != null) {
            practitioner.setPhotoUrl(dto.getPhotoUrl());
        }
        
        // Update sharing link if name changes to keep it fresh
        String username = practitioner.getEmail().split("@")[0].toLowerCase().replaceAll("[^a-z0-9]", "");
        practitioner.setSharingLink("idealnowpaa.com/" + username);

        return practitionerRepository.save(practitioner);
    }

    public List<ServiceEntity> getServices(Practitioner practitioner) {
        return serviceRepository.findByPractitionerId(practitioner.getId());
    }

    public Practitioner getPractitionerByPhone(String phoneNumber) {
        return practitionerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new IllegalArgumentException("Practitioner not found for phone: " + phoneNumber));
    }

    public ServiceEntity addService(Practitioner practitioner, ServiceEntity service) {
        service.setPractitioner(practitioner);
        return serviceRepository.save(service);
    }

    public ServiceEntity updateService(Practitioner practitioner, Long serviceId, ServiceEntity serviceDetails) {
        ServiceEntity existing = serviceRepository.findById(serviceId)
            .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        if (!existing.getPractitioner().getId().equals(practitioner.getId())) {
            throw new SecurityException("Unauthorized to update this service");
        }

        existing.setTitle(serviceDetails.getTitle());
        existing.setDescription(serviceDetails.getDescription());
        existing.setPrice(serviceDetails.getPrice());
        if (serviceDetails.getPhotoUrl() != null) {
            existing.setPhotoUrl(serviceDetails.getPhotoUrl());
        }

        return serviceRepository.save(existing);
    }

    public void deleteService(Practitioner practitioner, Long serviceId) {
        ServiceEntity existing = serviceRepository.findById(serviceId)
            .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        if (!existing.getPractitioner().getId().equals(practitioner.getId())) {
            throw new SecurityException("Unauthorized to delete this service");
        }

        serviceRepository.delete(existing);
    }
}
