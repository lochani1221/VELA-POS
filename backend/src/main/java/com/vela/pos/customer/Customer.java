package com.vela.pos.customer;

import com.vela.pos.common.audit.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "customer")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Customer extends BaseEntity {

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String mobile;

    @Column
    private String email;

    @Column(nullable = false)
    private Integer loyaltyPoints = 0;

    public Customer(String fullName, String mobile, String email) {
        this.fullName = fullName;
        this.mobile = mobile;
        this.email = email;
        this.loyaltyPoints = 0;
    }

    public void updateProfile(String fullName, String mobile, String email) {
        this.fullName = fullName;
        this.mobile = mobile;
        this.email = email;
    }
}
