package com.vela.pos.appointment;

import com.vela.pos.common.exception.InvalidStateTransitionException;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AppointmentTest {

    private Appointment newAppointment() {
        return new Appointment(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), Instant.now());
    }

    @Test
    void startsAsPending() {
        assertThat(newAppointment().getStatus()).isEqualTo(AppointmentStatus.PENDING);
    }

    @Test
    void happyPathLifecycle() {
        Appointment appointment = newAppointment();

        appointment.confirm();
        assertThat(appointment.getStatus()).isEqualTo(AppointmentStatus.CONFIRMED);

        appointment.checkIn();
        assertThat(appointment.getStatus()).isEqualTo(AppointmentStatus.IN_PROGRESS);

        appointment.complete();
        assertThat(appointment.getStatus()).isEqualTo(AppointmentStatus.COMPLETED);
    }

    @Test
    void cannotCheckInBeforeConfirming() {
        Appointment appointment = newAppointment();

        assertThatThrownBy(appointment::checkIn).isInstanceOf(InvalidStateTransitionException.class);
    }

    @Test
    void cannotCompleteBeforeCheckIn() {
        Appointment appointment = newAppointment();
        appointment.confirm();

        assertThatThrownBy(appointment::complete).isInstanceOf(InvalidStateTransitionException.class);
    }

    @Test
    void canCancelFromPendingConfirmedOrInProgress() {
        Appointment pending = newAppointment();
        pending.cancel("no longer needed");
        assertThat(pending.getStatus()).isEqualTo(AppointmentStatus.CANCELLED);

        Appointment inProgress = newAppointment();
        inProgress.confirm();
        inProgress.checkIn();
        inProgress.cancel("client left");
        assertThat(inProgress.getStatus()).isEqualTo(AppointmentStatus.CANCELLED);
    }

    @Test
    void cannotCancelACompletedAppointment() {
        Appointment appointment = newAppointment();
        appointment.confirm();
        appointment.checkIn();
        appointment.complete();

        assertThatThrownBy(() -> appointment.cancel("too late"))
                .isInstanceOf(InvalidStateTransitionException.class);
    }

    @Test
    void canMarkNoShowFromPending() {
        Appointment appointment = newAppointment();
        appointment.markNoShow();
        assertThat(appointment.getStatus()).isEqualTo(AppointmentStatus.NO_SHOW);
    }
}
