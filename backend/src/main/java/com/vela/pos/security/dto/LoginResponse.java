package com.vela.pos.security.dto;

import com.vela.pos.security.Role;

import java.util.UUID;

public record LoginResponse(
        String token,
        Role role,
        UUID staffId
) {
}
