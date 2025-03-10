package com.example.AIComplaintCompanion.controller;

import com.example.AIComplaintCompanion.entity.Complaint;
import com.example.AIComplaintCompanion.repository.ComplaintRepository;
import com.example.AIComplaintCompanion.security.JwtTokenUtil;
import com.example.AIComplaintCompanion.service.ChatbotService;
import com.example.AIComplaintCompanion.service.ComplaintService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin("*")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private final ChatbotService chatbotService;

    private final ComplaintService complaintService;

    @Autowired
    public ComplaintController(ChatbotService chatbotService, ComplaintService complaintService) {
        this.chatbotService = chatbotService;
        this.complaintService = complaintService;
    }

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint, Principal principal) {
        String username = principal.getName();
        return complaintService.createComplaint(complaint, username);
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

//    @GetMapping
//    public List<Complaint> getComplaintsByUser(@RequestParam String username) {
//        return complaintService.getComplaintsByUser(username);
//    }


    @GetMapping("/{id}")
    public Optional<Complaint> getComplaintById(@PathVariable Long id) {
        return complaintService.getComplaintById(id);
    }

    @PutMapping("/{id}")
    public Complaint updateComplaint(@PathVariable Long id, @RequestBody Complaint complaint) {
        return complaintService.updateComplaint(id, complaint);
    }

    @PutMapping("/{id}/status")
    public Complaint updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        Complaint complaint = complaintService.getComplaintById(id).orElseThrow();
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }

    //    @GetMapping("/complaints/history/{username}")
    //    public List<Complaint> getComplaintHistory(@PathVariable String username) {
    //        return complaintRepository.findByUserUsernameOrderByUpdatedAtDesc(username);
    //    }






    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok().body(Map.of("message", "Complaint deleted successfully!")); // JSON Response
    }

    @GetMapping("/statistics")
    public Map<String, Long> getComplaintStatistics(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7); // Remove Bearer prefix
        String username = jwtTokenUtil.getUsernameFromToken(jwt);


        List<Complaint> userComplaints = complaintService.getComplaintsByUser(jwt);

        Map<String, Long> stats = new HashMap<>();
        stats.put("open", userComplaints.stream().filter(c -> c.getStatus().equalsIgnoreCase("OPEN")).count());
        stats.put("inProgress", userComplaints.stream().filter(c -> c.getStatus().equalsIgnoreCase("IN_PROGRESS")).count());
        stats.put("closed", userComplaints.stream().filter(c -> c.getStatus().equalsIgnoreCase("CLOSED")).count());

        return stats;
    }

    @GetMapping("/{id}/refresh-suggestion")
    public Optional<Complaint> refreshSuggestion(@PathVariable Long id) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        String newSuggestion = chatbotService.getSuggestions(complaint.getDescription());
        complaint.setSuggestion(newSuggestion);
        complaintRepository.save(complaint);
        return Optional.of(complaint);
    }

//    @GetMapping
//    public List<Complaint> getAllComplaints() {
//        return complaintService.getAllComplaints();
//    }

    @GetMapping("/user")
    public List<Complaint> getComplaintsByUser(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7); // Remove Bearer prefix
        return complaintService.getComplaintsByUser(jwt);
    }


}
