package com.idealik.backend.repository;

import com.idealik.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByPractitionerId(Long practitionerId);
    List<Booking> findByPractitionerIdAndSlotDate(Long practitionerId, String slotDate);
    List<Booking> findByPractitionerIdAndSlotDateAndSlotTime(Long practitionerId, String slotDate, String slotTime);
}
