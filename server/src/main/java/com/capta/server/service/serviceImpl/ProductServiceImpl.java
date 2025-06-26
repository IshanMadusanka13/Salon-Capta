package com.capta.server.service.serviceImpl;

import com.capta.server.model.Product;
import com.capta.server.repository.ProductRepository;
import com.capta.server.service.ProductService;
import com.capta.server.utils.enums.ProductType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(int productId) {
        Optional<Product> product = productRepository.findById(productId);
        return product.orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public void deleteProduct(int productId) {
        productRepository.deleteById(productId);
    }

    @Override
    public List<Product> getProductsByType(ProductType productType) {
        return productRepository.findByProductType(productType);
    }

    @Override
    @Transactional
    public Product updateStock(int productId, int quantityChange) {
        Product product = getProductById(productId);
        int newStock = product.getStockQuantity() + quantityChange;

        if(newStock < 0) {
            throw new IllegalStateException("Insufficient stock for product: " + product.getName());
        }

        product.setStockQuantity(newStock);
        return productRepository.save(product);
    }
}
