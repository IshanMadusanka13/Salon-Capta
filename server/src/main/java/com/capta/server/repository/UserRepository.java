package com.capta.server.repository;

import com.capta.server.model.User;
import com.capta.server.utils.enums.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
    List<User> findByUserType(UserType userType);
}
