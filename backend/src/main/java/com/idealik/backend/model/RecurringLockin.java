package com.idealik.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "recurring_lockins")
public class RecurringLockin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recurring")
    private Long id;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek; // e.g. "monday", "tuesday"

    @Column(name = "time_slot", nullable = false)
    private String time; // e.g. "10:00"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_practitioner", nullable = false)
    private Practitioner practitioner;

    public RecurringLockin() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public Practitioner getPractitioner() { return practitioner; }
    public void setPractitioner(Practitioner practitioner) { this.practitioner = practitioner; }
}
