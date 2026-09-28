package com.vela.pos.appointment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    List<Appointment> findByStartTimeBetweenOrderByStartTimeAsc(Instant from, Instant to);

    long countByStartTimeBetween(Instant from, Instant to);
}
