package com.vela.pos.dashboard;

import com.vela.pos.appointment.AppointmentRepository;
import com.vela.pos.billing.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final SaleRepository saleRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardSummaryResponse getSummary() {
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);
        Instant from = today.atStartOfDay(zone).toInstant();
        Instant to = today.plusDays(1).atStartOfDay(zone).toInstant();

        var todaySalesTotal = saleRepository.sumPaidTotalBetween(from, to);
        var todayAppointmentCount = appointmentRepository.countByStartTimeBetween(from, to);
        return new DashboardSummaryResponse(todaySalesTotal, todayAppointmentCount);
    }
}
