package com.capta.server.repository;

import com.capta.server.model.Services;
import com.capta.server.utils.enums.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicesRepository extends JpaRepository<Services, Integer> {
    List<Services> findServicesByServiceType(ServiceType serviceType);
}

