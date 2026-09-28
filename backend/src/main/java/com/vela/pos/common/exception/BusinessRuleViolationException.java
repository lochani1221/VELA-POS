package com.vela.pos.common.exception;

/**
 * Raised when a request is well-formed but violates a business rule
 * (e.g. payments not covering the sale total).
 */
public class BusinessRuleViolationException extends RuntimeException {

    public BusinessRuleViolationException(String message) {
        super(message);
    }
}
