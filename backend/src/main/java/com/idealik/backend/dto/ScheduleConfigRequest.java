package com.idealik.backend.dto;

/**
 * DTO for schedule configuration updates from the dashboard.
 */
public class ScheduleConfigRequest {

    private String startTime;     // e.g. "09:00"
    private String endTime;       // e.g. "17:00"
    private int slotDuration;     // in minutes: 30, 45, 60, or -1 for custom
    private int customSlotDuration; // actual minutes when slotDuration is -1 (custom)
    private String weekendDays;   // comma-separated: "SATURDAY,SUNDAY"

    public ScheduleConfigRequest() {}

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public int getSlotDuration() { return slotDuration; }
    public void setSlotDuration(int slotDuration) { this.slotDuration = slotDuration; }

    public int getCustomSlotDuration() { return customSlotDuration; }
    public void setCustomSlotDuration(int customSlotDuration) { this.customSlotDuration = customSlotDuration; }

    public String getWeekendDays() { return weekendDays; }
    public void setWeekendDays(String weekendDays) { this.weekendDays = weekendDays; }
}
