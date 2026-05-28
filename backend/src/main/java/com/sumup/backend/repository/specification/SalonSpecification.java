package com.sumup.backend.repository.specification;

import com.sumup.backend.model.enums.PriceRange;
import com.sumup.backend.model.Salon;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SalonSpecification {
    public static Specification<Salon> filter(String district, PriceRange priceRange, String service, String search) {
        return (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if(district != null && !district.isBlank()) {
                predicates.add(cb.equal(root.get("district"), district));
            }

            if(priceRange != null) {
                predicates.add(cb.equal(root.get("priceRange"), priceRange));
            }

            if(service != null && !service.isBlank()) {
                predicates.add(cb.isMember(service, root.get("servicesOffered")));
            }

            if(search != null && !search.isBlank()) {
                Expression<String> salonName = cb.lower(root.get("name"));
                String userInput = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.like(salonName, userInput));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
