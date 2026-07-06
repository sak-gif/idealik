package com.idealik.backend.repository;

import com.idealik.backend.model.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {
    List<Slot> findByPractitionerId(Long practitionerId);
}
