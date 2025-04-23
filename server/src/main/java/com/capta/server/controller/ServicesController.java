package com.capta.server.controller;

import com.capta.server.model.Services;
import com.capta.server.service.ServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServicesController {

    private final ServicesService servicesService;

    @Autowired
    public ServicesController(ServicesService servicesService) {
        this.servicesService = servicesService;
    }

    @PostMapping
    public ResponseEntity<Services> create(@RequestBody Services service) {
        return ResponseEntity.ok(servicesService.createService(service));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Services> get(@PathVariable int id) {
        return servicesService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{serviceType}")
    public ResponseEntity<List<Services>> getByServiceType(@PathVariable String serviceType) {
        return ResponseEntity.ok(servicesService.getServicesByType(serviceType));
    }

    @GetMapping
    public ResponseEntity<List<Services>> getAll() {
        return ResponseEntity.ok(servicesService.getAllServices());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Services> update(@PathVariable int id, @RequestBody Services service) {
        return ResponseEntity.ok(servicesService.updateService(id, service));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        servicesService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
