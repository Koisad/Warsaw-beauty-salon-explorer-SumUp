package com.sumup.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GooglePlacesResponseDto(List<Element> results) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Element(
            Double rating,
            @JsonProperty("user_ratings_total")
            Integer reviewCount,
            @JsonProperty("price_level")
            Integer priceLevel,
            String name,
            @JsonProperty("formatted_address")
            String formattedAddress,
            List<String> types
    ) {}
}