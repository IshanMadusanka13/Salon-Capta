package com.capta.server.controller;

import com.capta.server.dto.PosTransactionDto;
import com.capta.server.model.PosTransaction;
import com.capta.server.service.PosTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class PosTransactionController {

    @Autowired
    private PosTransactionService posTransactionService;

    @PostMapping
    public PosTransaction createTransaction(@RequestBody PosTransactionDto request) {
        return posTransactionService.createTransaction(request);
    }

    @GetMapping
    public List<PosTransaction> getAllTransactions() {
        return posTransactionService.getAllTransactions();
    }

    @GetMapping("/{id}")
    public PosTransaction getTransactionById(@PathVariable int id) {
        return posTransactionService.getTransactionById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable int id) {
        posTransactionService.deleteTransaction(id);
    }

    @GetMapping("/range")
    public List<PosTransaction> getTransactionsByDateRange(
            @RequestParam("start") String start,
            @RequestParam("end") String end) {
        LocalDateTime startDate = LocalDateTime.parse(start);
        LocalDateTime endDate = LocalDateTime.parse(end);
        return posTransactionService.getTransactionsByDateRange(startDate, endDate);
    }
}
