package com.vela.pos.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CustomerRequest(
        @NotBlank String fullName,
        @NotBlank String mobile,
        @Email String email
) {
}
