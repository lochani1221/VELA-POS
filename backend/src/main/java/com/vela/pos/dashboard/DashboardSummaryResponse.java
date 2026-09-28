package com.vela.pos.dashboard;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        BigDecimal todaySalesTotal,
        long todayAppointmentCount
) {
}
