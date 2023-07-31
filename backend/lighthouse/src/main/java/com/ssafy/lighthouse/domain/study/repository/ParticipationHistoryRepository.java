package com.ssafy.lighthouse.domain.study.repository;

import com.ssafy.lighthouse.domain.study.entity.ParticipationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ParticipationHistoryRepository extends JpaRepository<ParticipationHistory, Long> {
    // insert는 기본 제공 save 사용

    // remove -> find로 찾아와서 isValid 0으로 변경
    @Query("select ph from ParticipationHistory ph where ph.studyId = :studyId and ph.userId = :userId and ph.isValid = 1")
    Optional<ParticipationHistory> find(@Param("studyId") Long studyId, @Param("userId") Long userId);
}
