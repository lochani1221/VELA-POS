package com.vela.pos.staff;

import com.vela.pos.common.exception.ResourceNotFoundException;
import com.vela.pos.staff.dto.StaffRequest;
import com.vela.pos.staff.dto.StaffResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StaffService {

    private final StaffRepository staffRepository;
    private final StaffMapper staffMapper;

    public List<StaffResponse> findAll() {
        return staffRepository.findAll().stream().map(staffMapper::toResponse).toList();
    }

    public StaffResponse getById(UUID id) {
        return staffMapper.toResponse(findEntity(id));
    }

    @Transactional
    public StaffResponse create(StaffRequest request) {
        Staff staff = new Staff(request.fullName(), request.role(), request.contact());
        return staffMapper.toResponse(staffRepository.save(staff));
    }

    @Transactional
    public StaffResponse update(UUID id, StaffRequest request) {
        Staff staff = findEntity(id);
        boolean active = request.active() == null || request.active();
        staff.updateProfile(request.fullName(), request.role(), request.contact(), active);
        return staffMapper.toResponse(staff);
    }

    private Staff findEntity(UUID id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Staff", id));
    }
}
