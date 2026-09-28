package com.vela.pos.billing;

import com.vela.pos.billing.dto.PaymentRequest;
import com.vela.pos.billing.dto.SaleItemRequest;
import com.vela.pos.billing.dto.SaleRequest;
import com.vela.pos.billing.dto.SaleResponse;
import com.vela.pos.catalog.CatalogService;
import com.vela.pos.catalog.SalonService;
import com.vela.pos.catalog.ServiceCategory;
import com.vela.pos.common.exception.BusinessRuleViolationException;
import com.vela.pos.customer.CustomerService;
import com.vela.pos.staff.StaffService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BillingServiceTest {

    @Mock
    private SaleRepository saleRepository;
    @Mock
    private SaleMapper saleMapper;
    @Mock
    private CustomerService customerService;
    @Mock
    private StaffService staffService;
    @Mock
    private CatalogService catalogService;

    private BillingService billingService;

    private final UUID cashierId = UUID.randomUUID();
    private final UUID serviceId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        billingService = new BillingService(saleRepository, saleMapper, customerService, staffService, catalogService);
    }

    private SalonService haircut(BigDecimal price) {
        return new SalonService("Haircut", ServiceCategory.HAIR, 30, price, new BigDecimal("10.00"));
    }

    @Test
    void checkoutComputesTotalsAndPersistsTheSaleAggregate() {
        when(catalogService.findEntity(serviceId)).thenReturn(haircut(new BigDecimal("50.00")));
        when(saleRepository.nextInvoiceSequence()).thenReturn(3000L);
        when(saleRepository.saveAndFlush(any(Sale.class))).thenAnswer(inv -> inv.getArgument(0));
        when(saleMapper.toResponse(any(Sale.class))).thenReturn(
                new SaleResponse(null, "INV-3000", null, null, List.of(), null, null, null, null, List.of(), null, null));

        SaleRequest request = new SaleRequest(
                null, cashierId,
                List.of(new SaleItemRequest(serviceId, 1)),
                null,
                List.of(new PaymentRequest(PaymentMethod.CASH, new BigDecimal("50.00"))));

        billingService.checkout(request);

        ArgumentCaptor<Sale> captor = ArgumentCaptor.forClass(Sale.class);
        verify(saleRepository).saveAndFlush(captor.capture());
        Sale saved = captor.getValue();

        assertThat(saved.getInvoiceNumber()).isEqualTo("INV-3000");
        assertThat(saved.getSubtotal()).isEqualByComparingTo("50.00");
        assertThat(saved.getDiscountAmount()).isEqualByComparingTo("0.00");
        assertThat(saved.getTaxAmount()).isEqualByComparingTo("0.00");
        assertThat(saved.getTotalAmount()).isEqualByComparingTo("50.00");
        assertThat(saved.getItems()).hasSize(1);
        assertThat(saved.getPayments()).hasSize(1);
    }

    @Test
    void checkoutRejectsADiscountLargerThanTheSubtotal() {
        when(catalogService.findEntity(serviceId)).thenReturn(haircut(new BigDecimal("50.00")));

        SaleRequest request = new SaleRequest(
                null, cashierId,
                List.of(new SaleItemRequest(serviceId, 1)),
                new BigDecimal("100.00"),
                List.of(new PaymentRequest(PaymentMethod.CASH, new BigDecimal("50.00"))));

        assertThatThrownBy(() -> billingService.checkout(request))
                .isInstanceOf(BusinessRuleViolationException.class);
        verify(saleRepository, never()).saveAndFlush(any());
    }

    @Test
    void checkoutRejectsPaymentsThatDoNotMatchTheTotal() {
        when(catalogService.findEntity(serviceId)).thenReturn(haircut(new BigDecimal("50.00")));

        SaleRequest request = new SaleRequest(
                null, cashierId,
                List.of(new SaleItemRequest(serviceId, 1)),
                null,
                List.of(new PaymentRequest(PaymentMethod.CASH, new BigDecimal("30.00"))));

        assertThatThrownBy(() -> billingService.checkout(request))
                .isInstanceOf(BusinessRuleViolationException.class);
        verify(saleRepository, never()).saveAndFlush(any());
    }
}
