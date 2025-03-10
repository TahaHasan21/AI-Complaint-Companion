package com.example.AIComplaintCompanion.service;

import com.example.AIComplaintCompanion.dto.UserDto;
import com.example.AIComplaintCompanion.entity.User;
import com.example.AIComplaintCompanion.repository.UserRepository;
import com.example.AIComplaintCompanion.security.JwtTokenUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String registerUser(UserDto userDto) {
        if (userRepository.existsByUsername(userDto.getUsername()) || userRepository.existsByEmail(userDto.getEmail())) {
            return "Username or Email already exists!";
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());

        userRepository.save(user);
        return "User Registered Successfully!";
    }

    public String login(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                Map<String, String> response = new HashMap<>();
                response.put("user", user.getUsername());
                response.put("email", user.getEmail());
                response.put("token", jwtTokenUtil.generateToken(username));
                return new JSONObject(response).toString();

            }
        }
        return "Invalid Credentials!";
    }

    public User uploadProfileImage(String username, MultipartFile file) throws IOException {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfileImage(file.getBytes());
        return userRepository.save(user);
    }

    public byte[] getProfileImage(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getProfileImage();
    }
}
