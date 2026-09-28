package com.vela.pos.catalog.dto;

import com.vela.pos.catalog.ServiceCategory;

import java.math.BigDecimal;
import java.util.UUID;

public record ServiceResponse(
        UUID id,
        String name,
        ServiceCategory category,
        Integer durationMin,
        BigDecimal price,
        BigDecimal commissionRate
) {
}
