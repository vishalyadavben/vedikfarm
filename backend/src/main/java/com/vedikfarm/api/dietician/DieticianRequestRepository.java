package com.vedikfarm.api.dietician;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DieticianRequestRepository extends JpaRepository<DieticianRequest, Long> {
    Optional<DieticianRequest> findByUserId(Long userId);
    List<DieticianRequest> findAllByOrderByUpdatedAtDesc();
}
