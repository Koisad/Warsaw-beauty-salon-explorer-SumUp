package com.sumup.backend.repository;

import com.sumup.backend.model.Salon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface SalonRepository extends JpaRepository<Salon, Long>, JpaSpecificationExecutor<Salon> {
    Optional<Salon> findByNameAndAddress(String name, String address);
}
