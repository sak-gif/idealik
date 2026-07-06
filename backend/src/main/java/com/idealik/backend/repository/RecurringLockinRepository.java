package com.idealik.backend.repository;

import com.idealik.backend.model.RecurringLockin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecurringLockinRepository extends JpaRepository<RecurringLockin, Long> {
    List<RecurringLockin> findByPractitionerId(Long practitionerId);
}
