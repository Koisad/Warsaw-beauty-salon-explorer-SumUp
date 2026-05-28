package com.sumup.backend.dto.mapper;

import com.sumup.backend.dto.SalonResponseDto;
import com.sumup.backend.model.Salon;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class SalonMapper {

    public static SalonResponseDto toDto(Salon salon) {
        return new SalonResponseDto(
                salon.getId(),
                salon.getName(),
                salon.getAddress(),
                salon.getCity(),
                salon.getDistrict(),
                salon.getLatitude(),
                salon.getLongitude(),
                salon.getPhoneNumber(),
                salon.getWebsite(),
                salon.getRating(),
                salon.getReviewCount(),
                salon.getPriceRange(),
                salon.getServicesOffered()
        );
    }
}
