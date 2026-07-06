package com.idealik.backend.dto;

public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private String name;
    private String businessName;
    private String phoneNumber;
    private String description;
    private String photoUrl;
    private String sharingLink;
    private String qrCodeUrl;

    public AuthResponse(String token, Long id, String email, String name, String businessName, String phoneNumber, String description, String photoUrl, String sharingLink, String qrCodeUrl) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.name = name;
        this.businessName = businessName;
        this.phoneNumber = phoneNumber;
        this.description = description;
        this.photoUrl = photoUrl;
        this.sharingLink = sharingLink;
        this.qrCodeUrl = qrCodeUrl;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getSharingLink() {
        return sharingLink;
    }

    public void setSharingLink(String sharingLink) {
        this.sharingLink = sharingLink;
    }

    public String getQrCodeUrl() {
        return qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
    }
}
