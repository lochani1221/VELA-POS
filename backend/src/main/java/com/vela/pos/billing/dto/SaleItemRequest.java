package com.vela.pos.billing.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

public record SaleItemRequest(
        @NotNull UUID serviceId,
        @Positive int quantity
) {
}
