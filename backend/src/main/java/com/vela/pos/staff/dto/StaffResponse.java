package com.vela.pos.staff.dto;

import java.util.UUID;

public record StaffResponse(
        UUID id,
        String fullName,
        String role,
        String contact,
        boolean active
) {
}
