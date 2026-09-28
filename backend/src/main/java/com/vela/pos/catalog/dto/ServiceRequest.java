package com.vela.pos.catalog.dto;

import com.vela.pos.catalog.ServiceCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ServiceRequest(
        @NotBlank String name,
        @NotNull ServiceCategory category,
        @Positive Integer durationMin,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @NotNull @DecimalMin("0.0") BigDecimal commissionRate
) {
}
