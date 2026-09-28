package com.vela.pos.staff;

import com.vela.pos.staff.dto.StaffResponse;
import org.springframework.stereotype.Component;

@Component
public class StaffMapper {

    public StaffResponse toResponse(Staff staff) {
        return new StaffResponse(
                staff.getId(),
                staff.getFullName(),
                staff.getRole(),
                staff.getContact(),
                staff.isActive()
        );
    }
}
