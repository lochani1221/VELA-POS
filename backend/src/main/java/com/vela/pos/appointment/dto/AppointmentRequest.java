package com.vela.pos.appointment.dto;

import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record AppointmentRequest(
        @NotNull UUID customerId,
        @NotNull UUID staffId,
        @NotNull UUID serviceId,
        @NotNull Instant startTime
) {
}
