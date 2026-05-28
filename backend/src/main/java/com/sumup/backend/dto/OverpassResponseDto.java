package com.sumup.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OverpassResponseDto(List<Element> elements) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Element(
       String type,
       Long id,
       Double lat,
       Double lon,
       Map<String, String> tags,
       List<Geometry> geometry
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Geometry(Double lat, Double lon) {}

}
