package com.vela.pos.catalog;

import com.vela.pos.catalog.dto.ServiceRequest;
import com.vela.pos.catalog.dto.ServiceResponse;
import com.vela.pos.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogService {

    private final SalonServiceRepository salonServiceRepository;
    private final ServiceMapper serviceMapper;

    public List<ServiceResponse> findAll(ServiceCategory category) {
        List<SalonService> services = category == null
                ? salonServiceRepository.findAll()
                : salonServiceRepository.findByCategory(category);
        return services.stream().map(serviceMapper::toResponse).toList();
    }

    public ServiceResponse getById(UUID id) {
        return serviceMapper.toResponse(findEntity(id));
    }

    @Transactional
    public ServiceResponse create(ServiceRequest request) {
        SalonService service = new SalonService(
                request.name(), request.category(), request.durationMin(),
                request.price(), request.commissionRate());
        return serviceMapper.toResponse(salonServiceRepository.save(service));
    }

    @Transactional
    public ServiceResponse update(UUID id, ServiceRequest request) {
        SalonService service = findEntity(id);
        service.update(request.name(), request.category(), request.durationMin(),
                request.price(), request.commissionRate());
        return serviceMapper.toResponse(service);
    }

    public SalonService findEntity(UUID id) {
        return salonServiceRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("SalonService", id));
    }
}
