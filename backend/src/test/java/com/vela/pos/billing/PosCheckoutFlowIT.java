package com.vela.pos.billing;

import com.vela.pos.billing.dto.PaymentRequest;
import com.vela.pos.billing.dto.SaleItemRequest;
import com.vela.pos.billing.dto.SaleRequest;
import com.vela.pos.billing.dto.SaleResponse;
import com.vela.pos.catalog.ServiceCategory;
import com.vela.pos.catalog.dto.ServiceRequest;
import com.vela.pos.catalog.dto.ServiceResponse;
import com.vela.pos.customer.dto.CustomerRequest;
import com.vela.pos.customer.dto.CustomerResponse;
import com.vela.pos.security.dto.LoginRequest;
import com.vela.pos.security.dto.LoginResponse;
import com.vela.pos.staff.dto.StaffRequest;
import com.vela.pos.staff.dto.StaffResponse;
import com.vela.pos.support.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * End-to-end smoke test across the master-data + POS checkout modules,
 * exercised the same way the React frontend would: login, then real HTTP
 * calls carrying the returned JWT.
 */
class PosCheckoutFlowIT extends AbstractIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    private HttpHeaders authHeaders() {
        ResponseEntity<LoginResponse> login = restTemplate.postForEntity(
                "/api/v1/auth/login", new LoginRequest("admin", "admin123"), LoginResponse.class);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(login.getBody().token());
        return headers;
    }

    @Test
    void checkoutCreatesAnAtomicSaleAcrossItemsAndPayments() {
        HttpHeaders headers = authHeaders();

        StaffResponse cashier = restTemplate.exchange(
                "/api/v1/staff", org.springframework.http.HttpMethod.POST,
                new HttpEntity<>(new StaffRequest("Nadeesha Perera", "Receptionist", "0771112222", null), headers),
                StaffResponse.class).getBody();

        ServiceResponse service = restTemplate.exchange(
                "/api/v1/services", org.springframework.http.HttpMethod.POST,
                new HttpEntity<>(new ServiceRequest("Classic Manicure", ServiceCategory.NAIL, 45,
                        new BigDecimal("35.00"), new BigDecimal("10.00")), headers),
                ServiceResponse.class).getBody();

        CustomerResponse customer = restTemplate.exchange(
                "/api/v1/customers", org.springframework.http.HttpMethod.POST,
                new HttpEntity<>(new CustomerRequest("Ishara Fernando", "0779998888", null), headers),
                CustomerResponse.class).getBody();

        SaleRequest saleRequest = new SaleRequest(
                customer.id(), cashier.id(),
                List.of(new SaleItemRequest(service.id(), 1)),
                null,
                List.of(new PaymentRequest(PaymentMethod.CASH, new BigDecimal("35.00"))));

        ResponseEntity<SaleResponse> checkoutResponse = restTemplate.exchange(
                "/api/v1/sales", org.springframework.http.HttpMethod.POST,
                new HttpEntity<>(saleRequest, headers), SaleResponse.class);

        assertThat(checkoutResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        SaleResponse sale = checkoutResponse.getBody();
        assertThat(sale).isNotNull();
        assertThat(sale.invoiceNumber()).startsWith("INV-");
        assertThat(sale.totalAmount()).isEqualByComparingTo("35.00");
        assertThat(sale.status()).isEqualTo(SaleStatus.PAID);
        assertThat(sale.items()).hasSize(1);
        assertThat(sale.items().get(0).description()).isEqualTo("Classic Manicure");

        ResponseEntity<SaleResponse> fetched = restTemplate.exchange(
                "/api/v1/sales/" + sale.id(), org.springframework.http.HttpMethod.GET,
                new HttpEntity<>(headers), SaleResponse.class);
        assertThat(fetched.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(fetched.getBody().invoiceNumber()).isEqualTo(sale.invoiceNumber());
    }

    @Test
    void checkoutRejectsPaymentsThatDoNotCoverTheTotal() {
        HttpHeaders headers = authHeaders();

        StaffResponse cashier = restTemplate.exchange(
                "/api/v1/staff", org.springframework.http.HttpMethod.POST,
                new HttpEntity<>(new StaffRequest("Nadeesha Perera", "Receptionist", "0771112222", null), headers),
                StaffResponse.class).getBody();

        ServiceResponse service = restTemplate.exchange(
                "/api/v1/services", org.springframework.http.HttpMethod.POST,
                new HttpEntity<>(new ServiceRequest("Deluxe Facial", ServiceCategory.AESTHETIC, 60,
                        new BigDecimal("80.00"), new BigDecimal("15.00")), headers),
                ServiceResponse.class).getBody();

        SaleRequest saleRequest = new SaleRequest(
                null, cashier.id(),
                List.of(new SaleItemRequest(service.id(), 1)),
                null,
                List.of(new PaymentRequest(PaymentMethod.CARD, new BigDecimal("50.00"))));

        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/sales", org.springframework.http.HttpMethod.POST,
                new HttpEntity<>(saleRequest, headers), String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
