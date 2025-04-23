package com.capta.server.model;

import com.capta.server.utils.enums.ServiceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "services")
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int serviceId;

    @Enumerated(EnumType.STRING)
    @Column(name="service_type")
    private ServiceType serviceType;

    private String name;

    private String description;

    private Double price;

}
