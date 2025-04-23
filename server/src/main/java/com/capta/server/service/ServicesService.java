package com.capta.server.service;

import com.capta.server.model.Services;

import java.util.List;
import java.util.Optional;

public interface ServicesService {
    Services createService(Services service);
    Optional<Services> getServiceById(int id);
    List<Services> getServicesByType(String type);
    List<Services> getAllServices();
    Services updateService(int id, Services service);
    void deleteService(int id);
}

