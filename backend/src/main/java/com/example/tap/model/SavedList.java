package com.example.tap.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "saved_lists")
public class SavedList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ElementCollection
    private List<String> responseCodes;

    @ElementCollection
    private List<String> imageLinks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<String> getResponseCodes() { return responseCodes; }
    @SuppressWarnings("unchecked")
    public void setResponseCodes(List<?> responseCodes) {
        this.responseCodes = (List<String>) responseCodes;
    }
    public List<String> getImageLinks() { return imageLinks; }
    @SuppressWarnings("unchecked")
    public void setImageLinks(List<?> imageLinks) {
        this.imageLinks = (List<String>) imageLinks;
    }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
} 