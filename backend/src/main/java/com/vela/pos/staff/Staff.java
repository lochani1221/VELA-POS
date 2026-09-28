package com.vela.pos.staff;

import com.vela.pos.common.audit.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Staff extends BaseEntity {

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role;

    @Column
    private String contact;

    @Column(nullable = false)
    private boolean active = true;

    public Staff(String fullName, String role, String contact) {
        this.fullName = fullName;
        this.role = role;
        this.contact = contact;
        this.active = true;
    }

    public void updateProfile(String fullName, String role, String contact, boolean active) {
        this.fullName = fullName;
        this.role = role;
        this.contact = contact;
        this.active = active;
    }
}
