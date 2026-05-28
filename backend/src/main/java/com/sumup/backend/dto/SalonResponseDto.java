package com.sumup.backend.dto;

import com.sumup.backend.model.enums.PriceRange;

import java.util.Set;

public record SalonResponseDto(
        Long id,
        String name,
        String address,
        String city,
        String district,
        Double latitude,
        Double longitude,
        String phoneNumber,
        String website,
        Double rating,
        Integer reviewCount,
        PriceRange priceRange,
        Set<String> servicesOffered
) {}
