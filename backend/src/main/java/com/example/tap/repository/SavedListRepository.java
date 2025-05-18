package com.example.tap.repository;

import com.example.tap.model.SavedList;
import com.example.tap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavedListRepository extends JpaRepository<SavedList, Long> {
    List<SavedList> findByUser(User user);
} 