package com.example.AIComplaintCompanion.service;

import com.example.AIComplaintCompanion.entity.Complaint;
import com.example.AIComplaintCompanion.entity.User;
import com.example.AIComplaintCompanion.repository.ComplaintRepository;
import com.example.AIComplaintCompanion.repository.UserRepository;
import com.example.AIComplaintCompanion.security.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private AiPriorityService aiPriorityService;

    @Autowired
    private ChatbotService chatBotService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private UserRepository userRepository;


    public Complaint createComplaint(Complaint complaint, String username) {
        String priority = aiPriorityService.assignPriority(complaint.getDescription());
        String suggestion = chatBotService.getSuggestions(complaint.getDescription());
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get(); // This will extract the User from Optional
            complaint.setUsername(user.getUsername());
        }
        complaint.setPriority(priority);
        complaint.setSuggestion(suggestion);
        complaint.setStatus("OPEN");

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByUser(String token) {
        String username = jwtTokenUtil.getUsernameFromToken(token);
        return complaintRepository.findByUsername(username);
    }

    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepository.findById(id);
    }

    public Complaint updateComplaint(Long id, Complaint updatedComplaint) {
        Optional<Complaint> optionalComplaint = complaintRepository.findById(id);
        if (optionalComplaint.isPresent()) {
            Complaint complaint = optionalComplaint.get();
            complaint.setTitle(updatedComplaint.getTitle());
            complaint.setDescription(updatedComplaint.getDescription());
            String token = request.getHeader("Authorization").substring(7);
            String priority = aiPriorityService.assignPriority(complaint.getDescription());
            String suggestion = chatBotService.getSuggestions(complaint.getDescription());
            complaint.setPriority(priority);
            complaint.setSuggestion(suggestion);
            complaint.setStatus(updatedComplaint.getStatus());
            complaint.setUsername(jwtTokenUtil.getUsernameFromToken(token)); // Set Username
            return complaintRepository.save(complaint);
        }
        return null;
    }

    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }
}
