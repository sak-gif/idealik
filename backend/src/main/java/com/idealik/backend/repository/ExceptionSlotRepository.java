package com.idealik.backend.repository;

import com.idealik.backend.model.ExceptionSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExceptionSlotRepository extends JpaRepository<ExceptionSlot, Long> {
    List<ExceptionSlot> findByPractitionerId(Long practitionerId);
}
