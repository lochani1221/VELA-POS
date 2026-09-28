package com.vela.pos.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    @Query("""
            SELECT c FROM Customer c
            WHERE :search IS NULL
               OR LOWER(c.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
               OR c.mobile LIKE CONCAT('%', :search, '%')
            """)
    Page<Customer> search(@Param("search") String search, Pageable pageable);
}
