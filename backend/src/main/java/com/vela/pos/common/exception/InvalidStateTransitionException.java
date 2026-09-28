package com.vela.pos.common.exception;

/**
 * Raised when a domain method rejects an invalid state transition
 * (e.g. completing a CANCELLED appointment).
 */
public class InvalidStateTransitionException extends RuntimeException {

    public InvalidStateTransitionException(String message) {
        super(message);
    }
}
