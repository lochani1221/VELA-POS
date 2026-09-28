package com.vela.pos.customer.dto;

import java.time.Instant;
import java.util.UUID;

public record CustomerResponse(
        UUID id,
        String fullName,
        String mobile,
        String email,
        Integer loyaltyPoints,
        Instant createdAt
) {
}
