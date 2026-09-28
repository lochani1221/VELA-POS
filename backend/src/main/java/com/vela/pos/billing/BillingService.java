package com.vela.pos.billing;

import com.vela.pos.billing.dto.PaymentRequest;
import com.vela.pos.billing.dto.SaleItemRequest;
import com.vela.pos.billing.dto.SaleRequest;
import com.vela.pos.billing.dto.SaleResponse;
import com.vela.pos.catalog.CatalogService;
import com.vela.pos.catalog.SalonService;
import com.vela.pos.common.exception.BusinessRuleViolationException;
import com.vela.pos.common.exception.ResourceNotFoundException;
import com.vela.pos.customer.CustomerService;
import com.vela.pos.staff.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BillingService {

    private final SaleRepository saleRepository;
    private final SaleMapper saleMapper;
    private final CustomerService customerService;
    private final StaffService staffService;
    private final CatalogService catalogService;

    public List<SaleResponse> findByDate(LocalDate date) {
        ZoneId zone = ZoneId.systemDefault();
        Instant from = date.atStartOfDay(zone).toInstant();
        Instant to = date.plusDays(1).atStartOfDay(zone).toInstant();
        List<Sale> sales = saleRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(from, to);
        return sales.isEmpty() ? List.of() : saleMapper.toResponseList(sales);
    }

    public SaleResponse getById(UUID id) {
        return saleMapper.toResponse(findEntity(id));
    }

    /**
     * Single atomic checkout: builds the Sale aggregate (items + payments) and
     * persists it in one write. There is no server-side cart in V1 — the cart
     * is assembled client-side and submitted whole.
     */
    @Transactional
    public SaleResponse checkout(SaleRequest request) {
        staffService.getById(request.cashierId());
        if (request.customerId() != null) {
            customerService.getById(request.customerId());
        }

        BigDecimal discountAmount = request.discountAmount() == null ? BigDecimal.ZERO : request.discountAmount();
        BigDecimal taxAmount = BigDecimal.ZERO; // V1 has no tax engine yet — always zero.

        List<SaleItem> items = request.items().stream().map(this::toSaleItem).toList();
        BigDecimal subtotal = items.stream().map(SaleItem::getLineTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

        if (discountAmount.compareTo(subtotal) > 0) {
            throw new BusinessRuleViolationException("Discount amount cannot exceed the subtotal");
        }
        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(taxAmount);

        BigDecimal paidAmount = request.payments().stream()
                .map(PaymentRequest::amount).reduce(BigDecimal.ZERO, BigDecimal::add);
        if (paidAmount.compareTo(totalAmount) != 0) {
            throw new BusinessRuleViolationException(
                    "Payments (%s) do not match the total amount (%s)".formatted(paidAmount, totalAmount));
        }

        String invoiceNumber = "INV-" + saleRepository.nextInvoiceSequence();
        Sale sale = new Sale(invoiceNumber, request.customerId(), request.cashierId(),
                subtotal, discountAmount, taxAmount, totalAmount);
        items.forEach(sale::addItem);
        request.payments().forEach(p -> sale.addPayment(new Payment(p.method(), p.amount())));

        // flush so @CreationTimestamp is populated before we map the response —
        // save() alone only schedules the INSERT, it doesn't execute it.
        return saleMapper.toResponse(saleRepository.saveAndFlush(sale));
    }

    private SaleItem toSaleItem(SaleItemRequest itemRequest) {
        SalonService service = catalogService.findEntity(itemRequest.serviceId());
        return new SaleItem(service.getId(), service.getName(), itemRequest.quantity(), service.getPrice());
    }

    private Sale findEntity(UUID id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Sale", id));
    }
}
