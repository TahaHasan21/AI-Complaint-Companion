package com.example.AIComplaintCompanion.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class ChatbotService {

    @Value("${cohere.api.token}")
    private String apiToken;

    private final String apiUrl = "https://api.cohere.ai/v1/generate";

    public String getSuggestions(String complaintDescription) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        JSONObject requestJson = new JSONObject();
        requestJson.put("prompt", "Suggest solutions for: " + complaintDescription);
        requestJson.put("max_tokens", 1000);

        HttpEntity<String> entity = new HttpEntity<>(requestJson.toString(), headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            JSONObject jsonResponse = new JSONObject(response.getBody());
            JSONArray generations = jsonResponse.getJSONArray("generations");
            return generations.getJSONObject(0).getString("text");
        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I couldn't generate a suggestion at the moment.";
        }
    }
}





//package com.example.AIComplaintCompanion.service;
//
//import org.json.JSONArray;
//import org.json.JSONObject;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.http.*;
//
//@Service
//public class ChatbotService {
//
//    @Value("${huggingface.api.token}")
//    private String apiToken;
//
//    private final String apiUrl = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";
//
//    public String getSuggestions(String complaintDescription) {
//        RestTemplate restTemplate = new RestTemplate();
//        HttpHeaders headers = new HttpHeaders();
//        headers.setBearerAuth(apiToken);
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        JSONObject requestJson = new JSONObject();
//        requestJson.put("inputs", complaintDescription);
//
//        HttpEntity<String> entity = new HttpEntity<>(requestJson.toString(), headers);
//
//        try {
//            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
//            JSONArray jsonResponse = new JSONArray(response.getBody());
//            return jsonResponse.getJSONObject(0).getString("generated_text");
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "Sorry, AI is on Vacation 🌴🥲";
//        }
//    }
//}
