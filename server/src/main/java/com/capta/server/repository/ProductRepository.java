package com.capta.server.repository;

import com.capta.server.model.Product;
import com.capta.server.utils.enums.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByProductType(ProductType productType);

}
