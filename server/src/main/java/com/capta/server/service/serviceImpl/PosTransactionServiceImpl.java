package com.capta.server.service.serviceImpl;

import com.capta.server.dto.PosTransactionDto;
import com.capta.server.model.*;
import com.capta.server.repository.EmployeeRepository;
import com.capta.server.repository.PosTransactionRepository;
import com.capta.server.repository.ProductRepository;
import com.capta.server.repository.ServicesRepository;
import com.capta.server.service.PosTransactionService;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
public class PosTransactionServiceImpl implements PosTransactionService {

    private final PosTransactionRepository transactionRepository;

    private final ProductRepository productRepository;

    private final ServicesRepository servicesRepository;

    private final EmployeeRepository employeeRepository;

    public PosTransactionServiceImpl(PosTransactionRepository transactionRepository, ProductRepository productRepository, ServicesRepository servicesRepository, EmployeeRepository employeeRepository) {
        this.transactionRepository = transactionRepository;
        this.productRepository = productRepository;
        this.servicesRepository = servicesRepository;
        this.employeeRepository = employeeRepository;
    }


    @Override
    public PosTransaction createTransaction(PosTransactionDto dto) {
        PosTransaction transaction = new PosTransaction();
        transaction.setCustomer(dto.getCustomer());
        transaction.setPaymentMethod(dto.getPaymentMethod());
        transaction.setTotalAmount(dto.getTotalAmount());
        transaction.setTransactionTime(dto.getTransactionTime());

        Employee employee = employeeRepository.findById(dto.getEmployee().getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        transaction.setEmployee(employee);

        List<PosTransactionItem> items = new ArrayList<>();

        if (dto.getServices() != null) {
            for (PosTransactionDto.ServiceItem s : dto.getServices()) {
                Services service = servicesRepository.findById(s.getServiceId())
                        .orElseThrow(() -> new RuntimeException("Service not found"));
                PosTransactionItem item = new PosTransactionItem();
                item.setService(service);
                item.setQuantity(s.getQuantity());
                item.setPrice(s.getPrice());
                items.add(item);
            }
        }

        if (dto.getProducts() != null) {
            for (PosTransactionDto.ProductItem p : dto.getProducts()) {
                Product product = productRepository.findById(p.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                if (product.getStockQuantity() < p.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName());
                }
                product.setStockQuantity(product.getStockQuantity() - p.getQuantity());
                productRepository.save(product);

                PosTransactionItem item = new PosTransactionItem();
                item.setProduct(product);
                item.setQuantity(p.getQuantity());
                item.setPrice(p.getPrice());
                items.add(item);
            }
        }

        transaction.setItems(items);
        return transactionRepository.save(transaction);
    }


    @Override
    public PosTransaction updateTransaction(PosTransaction transaction) {
        // You may want to add logic to check if the transaction exists, manage items, etc.
        // For now, this will update the transaction and its items.
        if (!transactionRepository.existsById(transaction.getTransactionId())) {
            throw new RuntimeException("Transaction not found: " + transaction.getTransactionId());
        }
        return transactionRepository.save(transaction);
    }

    @Override
    public List<PosTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public PosTransaction getTransactionById(int transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
    }

    @Override
    public void deleteTransaction(int transactionId) {
        if (!transactionRepository.existsById(transactionId)) {
            throw new RuntimeException("Transaction not found: " + transactionId);
        }
        transactionRepository.deleteById(transactionId);
    }

    @Override
    public List<PosTransaction> getTransactionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findByTransactionTimeBetween(start, end);
    }
}
