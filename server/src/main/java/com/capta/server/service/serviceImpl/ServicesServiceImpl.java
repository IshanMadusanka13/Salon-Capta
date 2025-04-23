package com.capta.server.service.serviceImpl;

import com.capta.server.model.Services;
import com.capta.server.repository.ServicesRepository;
import com.capta.server.service.ServicesService;
import com.capta.server.utils.enums.ServiceType;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Log4j2
public class ServicesServiceImpl implements ServicesService {

    private final ServicesRepository servicesRepository;

    @Autowired
    public ServicesServiceImpl(ServicesRepository servicesRepository) {
        this.servicesRepository = servicesRepository;
        log.info("ServicesServiceImpl initialized with ServicesRepository");
    }

    @Override
    public Services createService(Services service) {
        log.info("Creating new service with name: {}", service.getName());
        Services createdService = servicesRepository.save(service);
        log.info("Successfully created service with ID: {}", createdService.getServiceId());
        return createdService;
    }

    @Override
    public Optional<Services> getServiceById(int id) {
        log.info("Fetching service by ID: {}", id);
        Optional<Services> service = servicesRepository.findById(id);
        if (service.isPresent()) {
            log.info("Found service with ID: {}", id);
        } else {
            log.warn("No service found with ID: {}", id);
        }
        return service;
    }

    @Override
    public List<Services> getServicesByType(String type) {
        log.info("Fetching service by Type: {}", type);
        if (type.equals("ALL"))
            return servicesRepository.findAll();
        else
            return servicesRepository.findServicesByServiceType(ServiceType.valueOf(type));
    }

    @Override
    public List<Services> getAllServices() {
        log.info("Fetching all services");
        List<Services> services = servicesRepository.findAll();
        log.info("Found {} services", services.size());
        return services;
    }

    @Override
    public Services updateService(int id, Services updatedService) {
        log.info("Attempting to update service with ID: {}", id);
        return servicesRepository.findById(id).map(service -> {
            log.debug("Found existing service with ID: {}. Updating details", id);
            service.setName(updatedService.getName());
            service.setDescription(updatedService.getDescription());
            service.setPrice(updatedService.getPrice());

            Services savedService = servicesRepository.save(service);
            log.info("Successfully updated service with ID: {}", id);
            return savedService;
        }).orElseThrow(() -> {
            log.error("Service not found with ID: {}", id);
            return new RuntimeException("Service not found");
        });
    }

    @Override
    public void deleteService(int id) {
        log.info("Attempting to delete service with ID: {}", id);
        servicesRepository.deleteById(id);
        log.info("Successfully deleted service with ID: {}", id);
    }
}