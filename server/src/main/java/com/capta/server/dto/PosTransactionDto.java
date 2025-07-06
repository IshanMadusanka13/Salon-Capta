package com.capta.server.dto;

import com.capta.server.model.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class PosTransactionDto {
    private String customer;
    private Employee employee;
    private List<ServiceItem> services;
    private List<ProductItem> products;
    private String paymentMethod;
    private double totalAmount;
    private LocalDateTime transactionTime;

    @Data
    public static class ServiceItem {
        private int serviceId;
        private double price;
        private int quantity;
    }

    @Data
    public static class ProductItem {
        private int productId;
        private int quantity;
        private double price;
    }

}
