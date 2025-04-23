package com.capta.server.service.serviceImpl;

import com.capta.server.model.User;
import com.capta.server.repository.UserRepository;
import com.capta.server.security.JwtTokenUtil;
import com.capta.server.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Log4j2
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, JwtTokenUtil jwtTokenUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User createUser(User user) {
        log.info("Creating new user with email: {}", user.getEmail());
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

        User createdUser = userRepository.save(user);
        log.info("Successfully created user with ID: {}", createdUser.getUserId());
        return createdUser;
    }

    @Override
    public Optional<User> getUserById(int id) {
        log.info("Fetching user by ID: {}", id);
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            log.info("Found user with ID: {}", id);
        } else {
            log.warn("No user found with ID: {}", id);
        }
        return user;
    }

    @Override
    public Map<String, Object> login(User userDetails) {
        log.info("Attempting login for user: {}", userDetails.getEmail());
        User user = userRepository.findByEmail(userDetails.getEmail());

        if (user != null && passwordEncoder.matches(userDetails.getPassword(), user.getPassword())) {
            String token = jwtTokenUtil.generateToken(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);

            log.info("Login successful for user: {}", userDetails.getEmail());
            return response;
        } else {
            log.warn("Login failed for user: {}", userDetails.getEmail());
            throw new RuntimeException("Invalid credentials");
        }
    }

    @Override
    public List<User> getAllUsers() {
        log.info("Fetching all users");
        List<User> users = userRepository.findAll();
        log.info("Found {} users", users.size());
        return users;
    }

    @Override
    public User updateUser(int id, User updatedUser) {
        log.info("Attempting to update user with ID: {}", id);
        return userRepository.findById(id).map(user -> {
            log.debug("Found existing user with ID: {}. Updating details", id);
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setMobile(updatedUser.getMobile());

            User savedUser = userRepository.save(user);
            log.info("Successfully updated user with ID: {}", id);
            return savedUser;
        }).orElseThrow(() -> {
            log.error("User not found with ID: {}", id);
            return new RuntimeException("User not found");
        });
    }

    @Override
    public void deleteUser(int id) {
        log.info("Attempting to delete user with ID: {}", id);
        userRepository.deleteById(id);
        log.info("Successfully deleted user with ID: {}", id);
    }
}