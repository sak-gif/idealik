package com.idealik.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "exception_slots")
public class ExceptionSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_exception")
    private Long id;

    @Column(name = "exception_date", nullable = false)
    private String date; // YYYY-MM-DD

    @Column(name = "exception_time", nullable = false)
    private String time; // HH:mm

    @Column(name = "reason")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_practitioner", nullable = false)
    private Practitioner practitioner;

    public ExceptionSlot() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Practitioner getPractitioner() { return practitioner; }
    public void setPractitioner(Practitioner practitioner) { this.practitioner = practitioner; }
}
