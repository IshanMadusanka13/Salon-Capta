package com.capta.server.service;

import com.capta.server.model.Product;
import com.capta.server.utils.enums.ProductType;

import java.util.List;

public interface ProductService {
    Product createProduct(Product product);

    Product updateProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(int productId);

    void deleteProduct(int productId);

    List<Product> getProductsByType(ProductType productType);

    Product updateStock(int productId, int quantityChange);
}
