package com.capta.server.controller;

import com.capta.server.model.PosTransaction;
import com.capta.server.service.PosTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class PosTransactionController {

    private final PosTransactionService transactionService;

    @Autowired
    public PosTransactionController(PosTransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public PosTransaction createTransaction(@RequestBody PosTransaction transaction) {
        return transactionService.createTransaction(transaction);
    }

    @PutMapping("/{id}")
    public PosTransaction updateTransaction(@PathVariable int id, @RequestBody PosTransaction transaction) {
        transaction.setTransactionId(id);
        return transactionService.updateTransaction(transaction);
    }

    @GetMapping
    public List<PosTransaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/{id}")
    public PosTransaction getTransactionById(@PathVariable int id) {
        return transactionService.getTransactionById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable int id) {
        transactionService.deleteTransaction(id);
    }

    @GetMapping("/range")
    public List<PosTransaction> getTransactionsByDateRange(
            @RequestParam("start") String start,
            @RequestParam("end") String end) {
        LocalDateTime startDate = LocalDateTime.parse(start);
        LocalDateTime endDate = LocalDateTime.parse(end);
        return transactionService.getTransactionsByDateRange(startDate, endDate);
    }
}
