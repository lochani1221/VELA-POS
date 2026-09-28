package com.vela.pos.billing;

import com.vela.pos.billing.dto.SaleResponse;
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
 * Reads Customer/Staff repositories directly (read-only, display purpose only) —
 * FK constraints guarantee the referenced staff row exists; customerId may be null
 * for an anonymous walk-in sale.
 */
@Component
@RequiredArgsConstructor
public class SaleMapper {

    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;

    public SaleResponse toResponse(Sale sale) {
        return toResponseList(List.of(sale)).get(0);
    }

    public List<SaleResponse> toResponseList(List<Sale> sales) {
        Map<UUID, Customer> customers = customerRepository
                .findAllById(sales.stream().map(Sale::getCustomerId).filter(java.util.Objects::nonNull).distinct().toList())
                .stream().collect(Collectors.toMap(Customer::getId, Function.identity()));

        Map<UUID, Staff> staffById = staffRepository
                .findAllById(sales.stream().map(Sale::getCashierId).distinct().toList())
                .stream().collect(Collectors.toMap(Staff::getId, Function.identity()));

        return sales.stream().map(sale -> {
            Customer customer = sale.getCustomerId() == null ? null : customers.get(sale.getCustomerId());
            Staff cashier = staffById.get(sale.getCashierId());

            List<SaleResponse.ItemResponse> items = sale.getItems().stream()
                    .map(item -> new SaleResponse.ItemResponse(
                            item.getDescription(), item.getQuantity(), item.getUnitPrice(), item.getLineTotal()))
                    .toList();

            List<SaleResponse.PaymentResponse> payments = sale.getPayments().stream()
                    .map(payment -> new SaleResponse.PaymentResponse(payment.getMethod(), payment.getAmount()))
                    .toList();

            return new SaleResponse(
                    sale.getId(),
                    sale.getInvoiceNumber(),
                    customer == null ? null : new SaleResponse.CustomerRef(customer.getId(), customer.getFullName()),
                    new SaleResponse.StaffRef(cashier.getId(), cashier.getFullName()),
                    items,
                    sale.getSubtotal(),
                    sale.getDiscountAmount(),
                    sale.getTaxAmount(),
                    sale.getTotalAmount(),
                    payments,
                    sale.getStatus(),
                    sale.getCreatedAt()
            );
        }).toList();
    }
}
