package com.vela.pos.billing;

import com.vela.pos.common.audit.CreatedAtEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The POS invoice — aggregate root for SaleItem and Payment. Saving a Sale
 * cascades its items and payments so checkout is a single atomic write.
 */
@Entity
@Table(name = "sale")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Sale extends CreatedAtEntity {

    @Column(nullable = false, unique = true)
    private String invoiceNumber;

    @Column
    private UUID customerId;

    @Column(nullable = false)
    private UUID cashierId;

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Column(nullable = false)
    private BigDecimal discountAmount;

    @Column(nullable = false)
    private BigDecimal taxAmount;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SaleStatus status;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SaleItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Payment> payments = new ArrayList<>();

    public Sale(String invoiceNumber, UUID customerId, UUID cashierId,
                BigDecimal subtotal, BigDecimal discountAmount, BigDecimal taxAmount, BigDecimal totalAmount) {
        this.invoiceNumber = invoiceNumber;
        this.customerId = customerId;
        this.cashierId = cashierId;
        this.subtotal = subtotal;
        this.discountAmount = discountAmount;
        this.taxAmount = taxAmount;
        this.totalAmount = totalAmount;
        this.status = SaleStatus.PAID;
    }

    public void addItem(SaleItem item) {
        item.assignTo(this);
        this.items.add(item);
    }

    public void addPayment(Payment payment) {
        payment.assignTo(this);
        this.payments.add(payment);
    }
}
