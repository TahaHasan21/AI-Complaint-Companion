package com.example.AIComplaintCompanion.controller;

import com.example.AIComplaintCompanion.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @Autowired
    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/suggestions")
    public ResponseEntity<Map<String, String>> getSuggestions(@RequestBody Map<String, String> request) {
        String description = request.get("description");
        String suggestion = chatbotService.getSuggestions(description);
        return ResponseEntity.ok(Map.of("suggestion", suggestion));
    }
}
