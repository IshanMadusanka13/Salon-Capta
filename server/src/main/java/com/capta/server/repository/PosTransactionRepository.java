package com.capta.server.repository;

import com.capta.server.model.PosTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PosTransactionRepository extends JpaRepository<PosTransaction, Integer> {

    List<PosTransaction> findByTransactionTimeBetween(LocalDateTime start, LocalDateTime end);

}
