package com.example.tap.controller;

import com.example.tap.model.User;
import com.example.tap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        try {
            User user = userService.registerUser(body.get("username"), body.get("password"));
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return userService.authenticate(body.get("username"), body.get("password"))
                .map(user -> ResponseEntity.ok(Map.of("message", "Login successful")))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }
}
