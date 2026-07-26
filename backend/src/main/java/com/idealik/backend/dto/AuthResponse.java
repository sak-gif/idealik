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
    private String descriptionAr;
    private String descriptionTr;
    private String businessNameAr;
    private String businessNameTr;
    private String nameAr;
    private String nameTr;

    public AuthResponse(String token, Long id, String email, String name, String businessName, String phoneNumber, String description, String photoUrl, String sharingLink, String qrCodeUrl, String descriptionAr, String descriptionTr, String businessNameAr, String businessNameTr, String nameAr, String nameTr) {
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
        this.descriptionAr = descriptionAr;
        this.descriptionTr = descriptionTr;
        this.businessNameAr = businessNameAr;
        this.businessNameTr = businessNameTr;
        this.nameAr = nameAr;
        this.nameTr = nameTr;
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

    public String getDescriptionAr() { return descriptionAr; }
    public void setDescriptionAr(String descriptionAr) { this.descriptionAr = descriptionAr; }

    public String getDescriptionTr() { return descriptionTr; }
    public void setDescriptionTr(String descriptionTr) { this.descriptionTr = descriptionTr; }

    public String getBusinessNameAr() { return businessNameAr; }
    public void setBusinessNameAr(String businessNameAr) { this.businessNameAr = businessNameAr; }

    public String getBusinessNameTr() { return businessNameTr; }
    public void setBusinessNameTr(String businessNameTr) { this.businessNameTr = businessNameTr; }

    public String getNameAr() { return nameAr; }
    public void setNameAr(String nameAr) { this.nameAr = nameAr; }

    public String getNameTr() { return nameTr; }
    public void setNameTr(String nameTr) { this.nameTr = nameTr; }
}
