package com.vela.pos.billing.dto;

import com.vela.pos.billing.PaymentMethod;
import com.vela.pos.billing.SaleStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record SaleResponse(
        UUID id,
        String invoiceNumber,
        CustomerRef customer,
        StaffRef cashier,
        List<ItemResponse> items,
        BigDecimal subtotal,
        BigDecimal discountAmount,
        BigDecimal taxAmount,
        BigDecimal totalAmount,
        List<PaymentResponse> payments,
        SaleStatus status,
        Instant createdAt
) {
    public record CustomerRef(UUID id, String fullName) {
    }

    public record StaffRef(UUID id, String fullName) {
    }

    public record ItemResponse(String description, Integer quantity, BigDecimal unitPrice, BigDecimal lineTotal) {
    }

    public record PaymentResponse(PaymentMethod method, BigDecimal amount) {
    }
}
