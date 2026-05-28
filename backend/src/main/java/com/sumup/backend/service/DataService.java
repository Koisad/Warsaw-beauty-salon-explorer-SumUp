package com.sumup.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.sumup.backend.dto.GooglePlacesResponseDto;
import com.sumup.backend.dto.OverpassResponseDto;
import com.sumup.backend.model.enums.PriceRange;
import com.sumup.backend.repository.SalonRepository;
import com.sumup.backend.model.Salon;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataService {

    @Value("${sumup.google.api-key:}")
    private String googleApiKey;

    private final SalonRepository salonRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @Async
    public void updateSalons() {
        log.info("Updating salons...");

        fetchFromOverpass();

        if(googleApiKey != null) {
            enrichDataWithGoogle();
        }
        else {
            log.warn("Google API key not found. Could not enrich data.");
        }

        log.info("Salons updated.");
    }

    public void fetchFromOverpass() {
        log.info("Fetching data from Overpass API...");

        String query = "[out:json][timeout:90][bbox:52.1444,20.8823,52.3034,21.2167];nwr[\"shop\"=\"beauty\"];out geom;";

        try {
            // form header - required by overpass api
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String body = "data=" + URLEncoder.encode(query, StandardCharsets.UTF_8);
            HttpEntity<String> request = new HttpEntity<>(body, headers);

            OverpassResponseDto response = restTemplate.postForObject(
                    "https://overpass-api.de/api/interpreter",
                    request,
                    OverpassResponseDto.class
            );

            if(response != null && response.elements() != null) {
                List<Salon> salons = new ArrayList<>();

                for (var element : response.elements()) {
                    if (element.tags() == null || !element.tags().containsKey("name")) continue;

                    String name = element.tags().get("name");
                    Double latitude;
                    Double longitude;

                    if (element.lat() != null && element.lon() != null) {
                        latitude = element.lat();
                        longitude = element.lon();
                    }
                    else if (element.geometry() != null && !element.geometry().isEmpty()) {
                        latitude = element.geometry().getFirst().lat();
                        longitude = element.geometry().getFirst().lon();
                    }
                    else continue;

                    String street = element.tags().getOrDefault("addr:street", "");
                    String houseNumber = element.tags().getOrDefault("addr:housenumber", "");
                    String address = (street + " " + houseNumber).trim();

                    if(address.isBlank()) continue;

                    String district = element.tags().get("addr:suburb");
                    if(district == null) {
                        district = element.tags().get("addr:district");
                    }

                    Salon salon = salonRepository.findByNameAndAddress(name, address).orElse(new Salon());

                    if (!salon.getManuallyOverriddenFields().contains("name")) salon.setName(name);
                    if (!salon.getManuallyOverriddenFields().contains("latitude")) salon.setLatitude(latitude);
                    if (!salon.getManuallyOverriddenFields().contains("longitude")) salon.setLongitude(longitude);
                    if (!salon.getManuallyOverriddenFields().contains("address")) salon.setAddress(address);
                    if (!salon.getManuallyOverriddenFields().contains("city")) salon.setCity("Warszawa");
                    if (district != null && !salon.getManuallyOverriddenFields().contains("district")) salon.setDistrict(district);

                    salons.add(salon);
                }

                salonRepository.saveAll(salons);
                log.info("Updated {} places (Overpass).", salons.size());
            }
        }
        catch (Exception e) {
            log.error("Overpass API exception: {}", e.getMessage());
        }

    }

    public void enrichDataWithGoogle() {
        log.info("Fetching data from Google Places API...");
        List<Salon> salons = salonRepository.findAll();
        List<Salon> salonsToUpdate = new ArrayList<>();

        for (Salon salon : salons) {
            boolean updated = false;
            try {
                // district fetching
                if (salon.getDistrict() == null || salon.getDistrict().isBlank()) {
                    String district = getDistrictFromGoogle(salon);
                    if (district != null) {
                        salon.setDistrict(district);
                        updated = true;
                    }
                }

                // other data fetching (rating, reviews, price, etc.)
                if (salon.getRating() == null || salon.getPriceRange() == null) {

                    GooglePlacesResponseDto.Element data = getPlacesDataFromGoogle(salon);

                    if(data != null) {
                        if (salon.getRating() == null && data.rating() != null) {
                            salon.setRating(data.rating());
                            updated = true;
                        }

                        if (salon.getReviewCount() == null && data.reviewCount() != null) {
                            salon.setReviewCount(data.reviewCount());
                            updated = true;
                        }

                        if (salon.getPriceRange() == null && data.priceLevel() != null) {
                            switch (data.priceLevel()) {
                                case 1 -> salon.setPriceRange(PriceRange.CHEAP);
                                case 2 -> salon.setPriceRange(PriceRange.MODERATE);
                                case 3 -> salon.setPriceRange(PriceRange.EXPENSIVE);
                                case 4, 5 -> salon.setPriceRange(PriceRange.VERY_EXPENSIVE);
                            }
                            updated = true;
                        }

                        if (data.types() != null && !data.types().isEmpty()) {
                            if (!salon.getManuallyOverriddenFields().contains("servicesOffered") && salon.getServicesOffered().isEmpty()) {
                                for (String type : data.types()) {

                                    String tag = switch (type) {
                                        case "hair_care" -> "hair care";
                                        case "beauty_salon" -> "beauty salon";
                                        case "spa" -> "spa";
                                        case "physiotherapist" -> "physiotherapist";
                                        default -> null;
                                    };

                                    if (tag != null && !salon.getServicesOffered().contains(tag)) {
                                        salon.getServicesOffered().add(tag);
                                        updated = true;
                                    }
                                }
                            }
                        }
                    }
                }

                if (updated) {
                    salonsToUpdate.add(salon);
                }

                Thread.sleep(100); //to avoid rate limit exceeded
            }
            catch (Exception e) {
                log.error("Google API exception: {} ", e.getMessage());
            }
        }

        if (!salonsToUpdate.isEmpty()) {
            salonRepository.saveAll(salonsToUpdate);
        }
        log.info("Updated {} places (Google).", salonsToUpdate.size());
    }

    private String getDistrictFromGoogle(Salon salon) {
        String url = String.format(Locale.US, "https://maps.googleapis.com/maps/api/geocode/json?latlng=%f,%f&key=%s",
                salon.getLatitude(), salon.getLongitude(), googleApiKey);

        JsonNode response = restTemplate.getForObject(url, JsonNode.class);

        if (response == null || !"OK".equals(response.path("status").asText())) return null;

        JsonNode results = response.path("results");

        if (results.isEmpty()) {
            return null;
        }

        JsonNode addressComponents = results.get(0).path("address_components");

        for (JsonNode component : addressComponents) {
            JsonNode types = component.path("types");

            for (JsonNode type : types) {

                String typeValue = type.asText();

                if (typeValue.equals("sublocality") || typeValue.equals("neighborhood")) {
                    return component.path("long_name").asText();
                }
            }
        }

        return null;
    }

    private GooglePlacesResponseDto.Element getPlacesDataFromGoogle(Salon salon) {
        try {
            String search = URLEncoder.encode(salon.getName() + " " + salon.getAddress() + " Warszawa", StandardCharsets.UTF_8);
            String url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + search + "&key=" + googleApiKey;

            GooglePlacesResponseDto response = restTemplate.getForObject(url, GooglePlacesResponseDto.class);

            if (response != null && response.results() != null && !response.results().isEmpty()) {
                return response.results().getFirst();
            }
        }
        catch (Exception e) {
            log.error("Error fetching {} data: {}", salon.getName(), e.getMessage());
        }
        return null;
    }

}
