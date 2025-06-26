package com.capta.server.model;

import com.capta.server.utils.enums.ProductType;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductType productType;

    @Column(nullable = false)
    private String name;

    private String description;

    private String brand;

    private double price;

    private int stockQuantity;

    private String inventoryLevel;

    private boolean active;
}