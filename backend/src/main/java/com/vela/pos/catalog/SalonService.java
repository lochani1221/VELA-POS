package com.vela.pos.catalog;

import com.vela.pos.common.audit.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * The service-catalog item. Named SalonService, not Service, to avoid
 * colliding with Spring's @Service annotation.
 */
@Entity
@Table(name = "salon_service")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SalonService extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceCategory category;

    @Column(nullable = false)
    private Integer durationMin;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private BigDecimal commissionRate;

    public SalonService(String name, ServiceCategory category, Integer durationMin,
                         BigDecimal price, BigDecimal commissionRate) {
        this.name = name;
        this.category = category;
        this.durationMin = durationMin;
        this.price = price;
        this.commissionRate = commissionRate;
    }

    public void update(String name, ServiceCategory category, Integer durationMin,
                        BigDecimal price, BigDecimal commissionRate) {
        this.name = name;
        this.category = category;
        this.durationMin = durationMin;
        this.price = price;
        this.commissionRate = commissionRate;
    }
}
