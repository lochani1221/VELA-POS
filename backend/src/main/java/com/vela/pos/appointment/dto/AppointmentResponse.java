package com.vela.pos.appointment.dto;

import com.vela.pos.appointment.AppointmentStatus;

import java.time.Instant;
import java.util.UUID;

public record AppointmentResponse(
        UUID id,
        CustomerRef customer,
        StaffRef staff,
        ServiceRef service,
        Instant startTime,
        AppointmentStatus status
) {
    public record CustomerRef(UUID id, String fullName) {
    }

    public record StaffRef(UUID id, String fullName) {
    }

    public record ServiceRef(UUID id, String name) {
    }
}
