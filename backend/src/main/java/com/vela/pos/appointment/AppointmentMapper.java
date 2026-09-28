package com.vela.pos.appointment;

import com.vela.pos.appointment.dto.AppointmentResponse;
import com.vela.pos.catalog.SalonService;
import com.vela.pos.catalog.SalonServiceRepository;
import com.vela.pos.customer.Customer;
import com.vela.pos.customer.CustomerRepository;
import com.vela.pos.staff.Staff;
import com.vela.pos.staff.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Builds the nested customer/staff/service display refs on AppointmentResponse.
 * Reads other modules' repositories directly (read-only, display purpose only) —
 * FK constraints guarantee the referenced rows exist, so no existence checks are needed here.
 */
@Component
@RequiredArgsConstructor
public class AppointmentMapper {

    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;
    private final SalonServiceRepository salonServiceRepository;

    public AppointmentResponse toResponse(Appointment appointment) {
        return toResponseList(List.of(appointment)).get(0);
    }

    public List<AppointmentResponse> toResponseList(List<Appointment> appointments) {
        List<UUID> customerIds = appointments.stream()
                .map(appointment -> appointment.getCustomerId())
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
        Map<UUID, Customer> customers = customerRepository
                .findAllById(customerIds)
                .stream().collect(Collectors.toMap(Customer::getId, Function.identity()));

        List<UUID> staffIds = appointments.stream()
                .map(appointment -> appointment.getStaffId())
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
        Map<UUID, Staff> staffById = staffRepository
                .findAllById(staffIds)
                .stream().collect(Collectors.toMap(Staff::getId, Function.identity()));

        List<UUID> serviceIds = appointments.stream()
                .map(appointment -> appointment.getServiceId())
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
        Map<UUID, SalonService> servicesById = salonServiceRepository
                .findAllById(serviceIds)
                .stream().collect(Collectors.toMap(SalonService::getId, Function.identity()));

        return appointments.stream().map(appt -> {
            Customer customer = customers.get(appt.getCustomerId());
            Staff staff = staffById.get(appt.getStaffId());
            SalonService service = servicesById.get(appt.getServiceId());
            return new AppointmentResponse(
                    appt.getId(),
                    new AppointmentResponse.CustomerRef(customer.getId(), customer.getFullName()),
                    new AppointmentResponse.StaffRef(staff.getId(), staff.getFullName()),
                    new AppointmentResponse.ServiceRef(service.getId(), service.getName()),
                    appt.getStartTime(),
                    appt.getStatus()
            );
        }).toList();
    }
}
