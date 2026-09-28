package com.vela.pos.catalog;

import com.vela.pos.catalog.dto.ServiceResponse;
import org.springframework.stereotype.Component;

@Component
public class ServiceMapper {

    public ServiceResponse toResponse(SalonService service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getCategory(),
                service.getDurationMin(),
                service.getPrice(),
                service.getCommissionRate()
        );
    }
}
