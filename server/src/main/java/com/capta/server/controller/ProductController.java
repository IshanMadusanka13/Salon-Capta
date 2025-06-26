package com.capta.server.controller;

import com.capta.server.model.Product;
import com.capta.server.service.ProductService;
import com.capta.server.utils.enums.ProductType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable int id, @RequestBody Product product) {
        product.setProductId(id);
        return productService.updateProduct(product);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable int id) {
        return productService.getProductById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
    }

    @GetMapping("/type/{type}")
    public List<Product> getProductsByType(@PathVariable ProductType type) {
        return productService.getProductsByType(type);
    }

    @PatchMapping("/{id}/stock")
    public Product updateStock(@PathVariable int id, @RequestParam int quantityChange) {
        return productService.updateStock(id, quantityChange);
    }
}
