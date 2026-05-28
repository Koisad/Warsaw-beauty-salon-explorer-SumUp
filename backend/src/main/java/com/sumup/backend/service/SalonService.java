package com.sumup.backend.service;

import com.sumup.backend.dto.mapper.SalonMapper;
import com.sumup.backend.dto.SalonResponseDto;
import com.sumup.backend.dto.SalonUpdateDto;
import com.sumup.backend.model.enums.PriceRange;
import com.sumup.backend.model.Salon;
import com.sumup.backend.repository.SalonRepository;
import com.sumup.backend.repository.specification.SalonSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SalonService {

    private final SalonRepository salonRepository;

    public Page<SalonResponseDto> getSalons(String district, PriceRange priceRange, String service, String search, Pageable pageable) {
        return salonRepository.findAll(
                SalonSpecification.filter(district, priceRange, service, search),
                pageable
        ).map(SalonMapper::toDto);
    }

    public SalonResponseDto getSalonById(Long id) {
        return salonRepository.findById(id)
                .map(SalonMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Salon not exists"));
    }

    @Transactional
    public Salon updateSalon(Long id, SalonUpdateDto dto) {
        Salon salon = salonRepository.findById(id).orElseThrow(() -> new RuntimeException("Salon not exists."));

        if (!salon.getName().equals(dto.name()) || !salon.getAddress().equals(dto.address())) {
            if(salonRepository.findByNameAndAddress(dto.name(), dto.address()).isPresent()) {
                throw new RuntimeException("The same salon already exists.");
            }
        }

        salon.setName(dto.name());
        salon.getManuallyOverriddenFields().add("name");

        salon.setAddress(dto.address());
        salon.getManuallyOverriddenFields().add("address");

        salon.setDistrict(dto.district());
        salon.getManuallyOverriddenFields().add("district");

        salon.setPhoneNumber(dto.phoneNumber());
        salon.getManuallyOverriddenFields().add("phoneNumber");

        salon.setWebsite(dto.website());
        salon.getManuallyOverriddenFields().add("website");

        salon.setPriceRange(dto.priceRange());
        salon.getManuallyOverriddenFields().add("priceRange");

        salon.setServicesOffered(dto.servicesOffered());
        salon.getManuallyOverriddenFields().add("servicesOffered");

        return salonRepository.save(salon);
    }

}
