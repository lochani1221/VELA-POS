package com.vela.pos.appointment;

import com.vela.pos.appointment.dto.AppointmentRequest;
import com.vela.pos.appointment.dto.AppointmentResponse;
import com.vela.pos.catalog.CatalogService;
import com.vela.pos.common.exception.ResourceNotFoundException;
import com.vela.pos.customer.CustomerService;
import com.vela.pos.staff.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final CustomerService customerService;
    private final StaffService staffService;
    private final CatalogService catalogService;

    public List<AppointmentResponse> findByDate(LocalDate date) {
        ZoneId zone = ZoneId.systemDefault();
        Instant from = date.atStartOfDay(zone).toInstant();
        Instant to = date.plusDays(1).atStartOfDay(zone).toInstant();
        List<Appointment> appointments = appointmentRepository.findByStartTimeBetweenOrderByStartTimeAsc(from, to);
        return appointments.isEmpty() ? List.of() : appointmentMapper.toResponseList(appointments);
    }

    public AppointmentResponse getById(UUID id) {
        return appointmentMapper.toResponse(findEntity(id));
    }

    @Transactional
    public AppointmentResponse create(AppointmentRequest request) {
        // Existence checks — throws ResourceNotFoundException (404) for a bad reference
        // instead of letting the DB reject it with an opaque FK-violation error.
        customerService.getById(request.customerId());
        staffService.getById(request.staffId());
        catalogService.getById(request.serviceId());

        Appointment appointment = new Appointment(
                request.customerId(), request.staffId(), request.serviceId(), request.startTime());
        return appointmentMapper.toResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse updateStatus(UUID id, AppointmentStatus target) {
        Appointment appointment = findEntity(id);
        switch (target) {
            case CONFIRMED -> appointment.confirm();
            case IN_PROGRESS -> appointment.checkIn();
            case COMPLETED -> appointment.complete();
            case CANCELLED -> appointment.cancel(null);
            case NO_SHOW -> appointment.markNoShow();
            case PENDING -> throw new IllegalArgumentException("Cannot transition an appointment back to PENDING");
        }
        return appointmentMapper.toResponse(appointment);
    }

    private Appointment findEntity(UUID id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Appointment", id));
    }
}
