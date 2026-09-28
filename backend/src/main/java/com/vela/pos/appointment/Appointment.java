package com.vela.pos.appointment;

import com.vela.pos.common.audit.BaseEntity;
import com.vela.pos.common.exception.InvalidStateTransitionException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.EnumSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "appointment")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Appointment extends BaseEntity {

    private static final Set<AppointmentStatus> CANCELLABLE_FROM =
            EnumSet.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS);

    @Column(nullable = false)
    private UUID customerId;

    @Column(nullable = false)
    private UUID staffId;

    @Column(nullable = false)
    private UUID serviceId;

    @Column(nullable = false)
    private Instant startTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    public Appointment(UUID customerId, UUID staffId, UUID serviceId, Instant startTime) {
        this.customerId = customerId;
        this.staffId = staffId;
        this.serviceId = serviceId;
        this.startTime = startTime;
        this.status = AppointmentStatus.PENDING;
    }

    public void confirm() {
        requireStatus(AppointmentStatus.PENDING, "confirm");
        this.status = AppointmentStatus.CONFIRMED;
    }

    public void checkIn() {
        requireStatus(AppointmentStatus.CONFIRMED, "check in");
        this.status = AppointmentStatus.IN_PROGRESS;
    }

    public void complete() {
        requireStatus(AppointmentStatus.IN_PROGRESS, "complete");
        this.status = AppointmentStatus.COMPLETED;
    }

    /**
     * @param reason not yet persisted — the schema has no cancellation-reason
     *               column in V1; kept as a parameter so a future migration
     *               can wire it through without changing this method's shape.
     */
    public void cancel(String reason) {
        requireCancellable("cancel");
        this.status = AppointmentStatus.CANCELLED;
    }

    public void markNoShow() {
        requireCancellable("mark as no-show");
        this.status = AppointmentStatus.NO_SHOW;
    }

    private void requireStatus(AppointmentStatus required, String action) {
        if (this.status != required) {
            throw new InvalidStateTransitionException(
                    "Cannot %s an appointment in status %s".formatted(action, this.status));
        }
    }

    private void requireCancellable(String action) {
        if (!CANCELLABLE_FROM.contains(this.status)) {
            throw new InvalidStateTransitionException(
                    "Cannot %s an appointment in status %s".formatted(action, this.status));
        }
    }
}
