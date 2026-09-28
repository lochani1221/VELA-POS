package com.vela.pos.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
        int status,
        String message,
        Instant timestamp,
        List<FieldError> errors
) {

    public record FieldError(String field, String message) {
    }

    public static ApiError of(int status, String message) {
        return new ApiError(status, message, Instant.now(), null);
    }

    public static ApiError of(int status, String message, List<FieldError> errors) {
        return new ApiError(status, message, Instant.now(), errors);
    }
}
