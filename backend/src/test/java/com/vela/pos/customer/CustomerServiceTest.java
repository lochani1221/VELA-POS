package com.vela.pos.customer;

import com.vela.pos.common.exception.ResourceNotFoundException;
import com.vela.pos.customer.dto.CustomerRequest;
import com.vela.pos.customer.dto.CustomerResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        customerService = new CustomerService(customerRepository, new CustomerMapper());
    }

    @Test
    void createSavesANewCustomerWithZeroLoyaltyPoints() {
        CustomerRequest request = new CustomerRequest("Amaya Silva", "0771234567", "amaya@example.com");
        when(customerRepository.saveAndFlush(any(Customer.class))).thenAnswer(inv -> inv.getArgument(0));

        CustomerResponse response = customerService.create(request);

        assertThat(response.fullName()).isEqualTo("Amaya Silva");
        assertThat(response.loyaltyPoints()).isEqualTo(0);
        verify(customerRepository).saveAndFlush(any(Customer.class));
    }

    @Test
    void getByIdThrowsWhenCustomerDoesNotExist() {
        UUID id = UUID.randomUUID();
        when(customerRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customerService.getById(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateModifiesTheExistingCustomerProfile() {
        Customer existing = new Customer("Old Name", "0770000000", null);
        UUID id = UUID.randomUUID();
        when(customerRepository.findById(id)).thenReturn(Optional.of(existing));

        CustomerResponse response = customerService.update(
                id, new CustomerRequest("New Name", "0779999999", "new@example.com"));

        assertThat(response.fullName()).isEqualTo("New Name");
        assertThat(response.mobile()).isEqualTo("0779999999");
        assertThat(response.email()).isEqualTo("new@example.com");
    }
}
