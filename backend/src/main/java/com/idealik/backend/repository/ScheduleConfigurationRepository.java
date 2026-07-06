package com.idealik.backend.repository;

import com.idealik.backend.model.ScheduleConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScheduleConfigurationRepository extends JpaRepository<ScheduleConfiguration, Long> {
    List<ScheduleConfiguration> findByPractitionerId(Long practitionerId);
}
