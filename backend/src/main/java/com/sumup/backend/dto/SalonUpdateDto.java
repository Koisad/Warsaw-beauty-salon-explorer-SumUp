package com.sumup.backend.dto;

import com.sumup.backend.model.enums.PriceRange;
import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public record SalonUpdateDto(
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "Address is required") String address,
        String district,
        String phoneNumber,
        String website,
        PriceRange priceRange,
        Set<String> servicesOffered
) {}
