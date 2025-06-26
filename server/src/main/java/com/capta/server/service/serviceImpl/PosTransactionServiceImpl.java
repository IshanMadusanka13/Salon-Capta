package com.capta.server.service.serviceImpl;

import com.capta.server.model.PosTransaction;
import com.capta.server.model.Product;
import com.capta.server.model.Services;
import com.capta.server.repository.PosTransactionRepository;
import com.capta.server.service.PosTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PosTransactionServiceImpl implements PosTransactionService {

    private final PosTransactionRepository transactionRepository;

    @Autowired
    public PosTransactionServiceImpl(PosTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public PosTransaction createTransaction(PosTransaction transaction) {
        double total = 0;

        if(transaction.getServices() != null) {
            for(Services service : transaction.getServices()) {
                total += service.getPrice();
            }
        }

        if(transaction.getProducts() != null) {
            for(Product product : transaction.getProducts()) {
                total += product.getPrice();
            }
        }

        transaction.setTotalAmount(total);
        return transactionRepository.save(transaction);
    }

    @Override
    public PosTransaction updateTransaction(PosTransaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public List<PosTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public PosTransaction getTransactionById(int transactionId) {
        Optional<PosTransaction> transaction = transactionRepository.findById(transactionId);
        return transaction.orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    @Override
    public void deleteTransaction(int transactionId) {
        transactionRepository.deleteById(transactionId);
    }

    @Override
    public List<PosTransaction> getTransactionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findByTransactionTimeBetween(start, end);
    }
}
