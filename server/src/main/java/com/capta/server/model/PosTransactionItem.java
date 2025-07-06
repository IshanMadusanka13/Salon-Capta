package com.capta.server.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "pos_transaction_items")
public class PosTransactionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;

    private int quantity;
    private double price;
}
