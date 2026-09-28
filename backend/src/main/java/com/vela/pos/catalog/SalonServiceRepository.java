package com.vela.pos.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SalonServiceRepository extends JpaRepository<SalonService, UUID> {

    List<SalonService> findByCategory(ServiceCategory category);
}
