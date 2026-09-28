package com.vela.pos.billing.dto;

import com.vela.pos.billing.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PaymentRequest(
        @NotNull PaymentMethod method,
        @NotNull @DecimalMin(value = "0.01") BigDecimal amount
) {
}
