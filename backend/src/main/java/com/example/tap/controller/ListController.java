package com.example.tap.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tap.model.SavedList;
import com.example.tap.model.User;
import com.example.tap.repository.SavedListRepository;
import com.example.tap.repository.UserRepository;

@RestController
@RequestMapping("/lists")
public class ListController {
    @Autowired
    private SavedListRepository savedListRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<SavedList> getLists(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        return savedListRepository.findByUser(user);
    }

    @PostMapping
    public ResponseEntity<?> saveList(@RequestBody Map<String, Object> body, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        SavedList list = new SavedList();
        list.setName((String) body.get("name"));
        list.setCreatedAt(LocalDateTime.now());
        list.setResponseCodes((List<String>) body.get("codes"));
        list.setImageLinks((List<String>) body.get("images"));
        list.setUser(user);
        savedListRepository.save(list);
        return ResponseEntity.ok(Map.of("message", "List saved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateList(@PathVariable Long id, @RequestBody Map<String, Object> body, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        SavedList list = savedListRepository.findById(id).orElse(null);
        if (list == null || !list.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "List not found or not authorized"));
        }
        if (body.containsKey("name")) {
            list.setName((String) body.get("name"));
        }
        savedListRepository.save(list);
        return ResponseEntity.ok(Map.of("message", "List updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteList(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        SavedList list = savedListRepository.findById(id).orElse(null);
        if (list == null || !list.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "List not found or not authorized"));
        }
        savedListRepository.delete(list);
        return ResponseEntity.ok(Map.of("message", "List deleted successfully"));
    }
} 