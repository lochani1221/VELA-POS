package com.vela.pos.staff.dto;

import jakarta.validation.constraints.NotBlank;

public record StaffRequest(
        @NotBlank String fullName,
        @NotBlank String role,
        String contact,
        Boolean active
) {
}
