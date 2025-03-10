package com.example.AIComplaintCompanion.controller;

import com.example.AIComplaintCompanion.dto.UserDto;
import com.example.AIComplaintCompanion.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        String result = userService.registerUser(userDto);
        return ResponseEntity.ok().body(Map.of("message", result)); // ✅ Return as JSON
    }

    @PostMapping("/login")
    public String login(@RequestBody UserDto userDto) {
        return userService.login(userDto.getUsername(), userDto.getPassword());
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("username") String username,
                                                     @RequestParam("image") MultipartFile file) {
        try {
            userService.uploadProfileImage(username, file);
            System.out.println("Received username: " + username);
            System.out.println("Received file: " + file.getOriginalFilename());
            return ResponseEntity.ok("Profile Image Uploaded Successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }
    }

    @GetMapping("/profile-image/{username}")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable String username) {
        byte[] image = userService.getProfileImage(username);
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(image);
    }
}
