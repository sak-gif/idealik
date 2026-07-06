package com.idealik.backend.repository;

import com.idealik.backend.model.Practitioner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PractitionerRepository extends JpaRepository<Practitioner, Long> {
    Optional<Practitioner> findByEmail(String email);
    Optional<Practitioner> findByPhoneNumber(String phoneNumber);
}
