package com.vela.pos.security;

import com.vela.pos.security.dto.LoginRequest;
import com.vela.pos.security.dto.LoginResponse;
import com.vela.pos.support.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class AuthControllerIT extends AbstractIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void loginWithSeededAdminReturnsAToken() {
        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
                "/api/v1/auth/login", new LoginRequest("admin", "admin123"), LoginResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().token()).isNotBlank();
        assertThat(response.getBody().role()).isEqualTo(Role.ADMIN);
    }

    @Test
    void loginWithWrongPasswordIsRejected() {
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/v1/auth/login", new LoginRequest("admin", "wrong-password"), String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void unauthenticatedRequestToAProtectedEndpointIsRejected() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/v1/staff", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }
}
