package com.sumup.backend.model;

import com.sumup.backend.model.enums.PriceRange;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "salons")
public class Salon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Address is required")
    @Column(nullable = false)
    private String address;

    private String city;
    private String district;


    @NotNull(message = "Latitude is required")
    @Column(nullable = false)
    private Double latitude;
    @NotNull(message = "Longitude is required")
    @Column(nullable = false)
    private Double longitude;


    private String phoneNumber;
    private String website;
    private Double rating = 0.0;
    private Integer reviewCount = 0;

    @Enumerated(EnumType.STRING)
    private PriceRange priceRange;


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "salon_offered_services", joinColumns = @JoinColumn(name = "salon_id"))
    @Column(name = "offered_services")
    private Set<String> servicesOffered = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "salon_overridden_fields", joinColumns = @JoinColumn(name = "salon_id"))
    @Column(name = "overridden_fields")
    private Set<String> manuallyOverriddenFields = new HashSet<>();

    @UpdateTimestamp
    private LocalDateTime lastUpdatedAt;
}