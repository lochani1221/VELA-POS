package com.vela.pos.billing.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record SaleRequest(
        UUID customerId,
        @NotNull UUID cashierId,
        @NotEmpty @Valid List<SaleItemRequest> items,
        @DecimalMin(value = "0.0") BigDecimal discountAmount,
        @NotEmpty @Valid List<PaymentRequest> payments
) {
}
