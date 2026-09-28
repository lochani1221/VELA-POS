package com.vela.pos.billing;

import com.vela.pos.billing.dto.SaleRequest;
import com.vela.pos.billing.dto.SaleResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sales")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public class BillingController {

    private final BillingService billingService;

    @PostMapping
    public ResponseEntity<SaleResponse> checkout(@Valid @RequestBody SaleRequest request) {
        return ResponseEntity.ok(billingService.checkout(request));
    }

    @GetMapping("/{id}")
    public SaleResponse getById(@PathVariable UUID id) {
        return billingService.getById(id);
    }

    @GetMapping
    public List<SaleResponse> findByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return billingService.findByDate(date);
    }
}
