package com.capta.server.service;

import com.capta.server.model.User;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserById(int id);
    Map<String, Object> login(User user);
    List<User> getAllUsers();
    User updateUser(int id, User user);
    void deleteUser(int id);
}

