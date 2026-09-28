package com.vela.pos.appointment.dto;

import com.vela.pos.appointment.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public record AppointmentStatusRequest(
        @NotNull AppointmentStatus status
) {
}
