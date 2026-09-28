package com.vela.pos.customer;

import com.vela.pos.customer.dto.CustomerResponse;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getMobile(),
                customer.getEmail(),
                customer.getLoyaltyPoints(),
                customer.getCreatedAt()
        );
    }
}
