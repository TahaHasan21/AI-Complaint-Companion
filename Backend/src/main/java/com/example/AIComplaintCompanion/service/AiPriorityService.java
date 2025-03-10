package com.example.AIComplaintCompanion.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class AiPriorityService {

    @Value("${cohere.api.token}")
    private String apiToken;

    private final String apiUrl = "https://api.cohere.ai/v1/generate";

    public String assignPriority(String complaintDescription) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        JSONObject requestJson = new JSONObject();
        requestJson.put("prompt", "Assign priority as ONLY High, Medium, or Low without explanation based on this complaint: " + complaintDescription);
        requestJson.put("max_tokens", 1);

        HttpEntity<String> entity = new HttpEntity<>(requestJson.toString(), headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            JSONObject jsonResponse = new JSONObject(response.getBody());
            JSONArray generations = jsonResponse.getJSONArray("generations");
            return generations.getJSONObject(0).getString("text").trim();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error occurred while processing the request";
        }
    }
}
