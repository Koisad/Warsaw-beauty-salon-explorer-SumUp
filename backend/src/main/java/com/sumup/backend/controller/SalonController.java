package com.sumup.backend.controller;

import com.sumup.backend.dto.mapper.SalonMapper;
import com.sumup.backend.dto.SalonResponseDto;
import com.sumup.backend.dto.SalonUpdateDto;
import com.sumup.backend.model.enums.PriceRange;
import com.sumup.backend.model.Salon;
import com.sumup.backend.service.DataService;
import com.sumup.backend.service.SalonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salons")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SalonController {

    private final SalonService salonService;
    private final DataService dataService;

    @GetMapping("/{id}")
    public ResponseEntity<SalonResponseDto> getSalon(@PathVariable Long id) {
        return ResponseEntity.ok(salonService.getSalonById(id));
    }

    @GetMapping
    public ResponseEntity<Page<SalonResponseDto>> getSalons(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) PriceRange priceRange,
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 25) Pageable pageable
            ) {

        Page<SalonResponseDto> page = salonService.getSalons(district, priceRange, service, search, pageable);

        return ResponseEntity.ok(page);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalonResponseDto> updateSalon(
            @PathVariable Long id,
            @RequestBody @Valid SalonUpdateDto dto
            ) {
        Salon updatedSalon = salonService.updateSalon(id, dto);
        return ResponseEntity.ok(SalonMapper.toDto(updatedSalon));
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateSalonsData() {
        dataService.updateSalons();
        return ResponseEntity.accepted().body("Updating in the background.");
    }
}
