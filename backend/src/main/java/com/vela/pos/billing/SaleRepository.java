package com.vela.pos.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface SaleRepository extends JpaRepository<Sale, UUID> {

    List<Sale> findByCreatedAtBetweenOrderByCreatedAtDesc(Instant from, Instant to);

    @Query(value = "SELECT nextval('invoice_number_seq')", nativeQuery = true)
    long nextInvoiceSequence();

    @Query("""
            SELECT COALESCE(SUM(s.totalAmount), 0) FROM Sale s
            WHERE s.createdAt BETWEEN :from AND :to AND s.status = com.vela.pos.billing.SaleStatus.PAID
            """)
    BigDecimal sumPaidTotalBetween(@Param("from") Instant from, @Param("to") Instant to);
}
