package com.vela.pos.customer;

import com.vela.pos.common.exception.ResourceNotFoundException;
import com.vela.pos.customer.dto.CustomerRequest;
import com.vela.pos.customer.dto.CustomerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public Page<CustomerResponse> search(String search, Pageable pageable) {
        return customerRepository.search(search, pageable).map(customerMapper::toResponse);
    }

    public CustomerResponse getById(UUID id) {
        return customerMapper.toResponse(findEntity(id));
    }

    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        Customer customer = new Customer(request.fullName(), request.mobile(), request.email());
        // flush so @CreationTimestamp is populated before we map the response —
        // save() alone only schedules the INSERT, it doesn't execute it.
        return customerMapper.toResponse(customerRepository.saveAndFlush(customer));
    }

    @Transactional
    public CustomerResponse update(UUID id, CustomerRequest request) {
        Customer customer = findEntity(id);
        customer.updateProfile(request.fullName(), request.mobile(), request.email());
        return customerMapper.toResponse(customer);
    }

    private Customer findEntity(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Customer", id));
    }
}
