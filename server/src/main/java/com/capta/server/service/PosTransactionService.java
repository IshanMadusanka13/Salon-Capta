package com.capta.server.service;

import com.capta.server.dto.PosTransactionDto;
import com.capta.server.model.PosTransaction;

import java.time.LocalDateTime;
import java.util.List;

public interface PosTransactionService {
    PosTransaction createTransaction(PosTransactionDto dto);
    PosTransaction updateTransaction(PosTransaction transaction);
    List<PosTransaction> getAllTransactions();
    PosTransaction getTransactionById(int transactionId);
    void deleteTransaction(int transactionId);
    List<PosTransaction> getTransactionsByDateRange(LocalDateTime start, LocalDateTime end);
}

