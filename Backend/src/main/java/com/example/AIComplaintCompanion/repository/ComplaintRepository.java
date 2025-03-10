package com.example.AIComplaintCompanion.repository;


import com.example.AIComplaintCompanion.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = :status")
    Long countByStatus(@Param("status") String status);

    @Query("SELECT c FROM Complaint c WHERE c.username = :username")
    List<Complaint> findByUsername(@Param("username") String username);


//    List<Complaint> findByUserUsernameOrderByUpdatedAtDesc(String username);
}
