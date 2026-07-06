package com.idealik.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "schedule_configurations")
public class ScheduleConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_config")
    private Long id;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "standard_start_time")
    private LocalTime standardStartTime;

    @Column(name = "standard_end_time")
    private LocalTime standardEndTime;

    @Column(name = "slot_duration")
    private Integer slotDuration; // in minutes: 30, 45, 60, or -1 for custom

    @Column(name = "custom_slot_duration")
    private Integer customSlotDuration; // actual minutes when slotDuration is -1 (custom)

    @Column(name = "weekend_days")
    private String weekendDays;

    @Column(name = "is_published")
    private Boolean isPublished;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_practitioner", nullable = false)
    private Practitioner practitioner;

    public ScheduleConfiguration() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalTime getStandardStartTime() {
        return standardStartTime;
    }

    public void setStandardStartTime(LocalTime standardStartTime) {
        this.standardStartTime = standardStartTime;
    }

    public LocalTime getStandardEndTime() {
        return standardEndTime;
    }

    public void setStandardEndTime(LocalTime standardEndTime) {
        this.standardEndTime = standardEndTime;
    }

    public Integer getSlotDuration() {
        return slotDuration;
    }

    public void setSlotDuration(Integer slotDuration) {
        this.slotDuration = slotDuration;
    }

    public Integer getCustomSlotDuration() {
        return customSlotDuration;
    }

    public void setCustomSlotDuration(Integer customSlotDuration) {
        this.customSlotDuration = customSlotDuration;
    }

    public String getWeekendDays() {
        return weekendDays;
    }

    public void setWeekendDays(String weekendDays) {
        this.weekendDays = weekendDays;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public Practitioner getPractitioner() {
        return practitioner;
    }

    public void setPractitioner(Practitioner practitioner) {
        this.practitioner = practitioner;
    }
}
