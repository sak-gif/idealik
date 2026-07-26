package com.idealik.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class PractitionerProfileDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Business name is required")
    private String businessName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String description;
    
    private String descriptionAr;
    private String descriptionTr;
    
    private String businessNameAr;
    private String businessNameTr;
    
    private String nameAr;
    private String nameTr;

    @NotBlank(message = "Email is required")
    private String email;

    private String photoUrl;

    public PractitionerProfileDto() {}

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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getDescriptionAr() {
        return descriptionAr;
    }

    public void setDescriptionAr(String descriptionAr) {
        this.descriptionAr = descriptionAr;
    }

    public String getDescriptionTr() {
        return descriptionTr;
    }

    public void setDescriptionTr(String descriptionTr) {
        this.descriptionTr = descriptionTr;
    }

    public String getBusinessNameAr() {
        return businessNameAr;
    }

    public void setBusinessNameAr(String businessNameAr) {
        this.businessNameAr = businessNameAr;
    }

    public String getBusinessNameTr() {
        return businessNameTr;
    }

    public void setBusinessNameTr(String businessNameTr) {
        this.businessNameTr = businessNameTr;
    }

    public String getNameAr() {
        return nameAr;
    }

    public void setNameAr(String nameAr) {
        this.nameAr = nameAr;
    }

    public String getNameTr() {
        return nameTr;
    }

    public void setNameTr(String nameTr) {
        this.nameTr = nameTr;
    }
}
