package com.ssafy.lighthouse.domain.study.repository;

import com.ssafy.lighthouse.domain.study.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    // insert는 기본 제공 save 사용
    
    // remove -> find로 찾아와서 isValid 0으로 변경
    @Query("select bm from Bookmark bm where bm.studyId = :studyId and bm.userId = :userId and bm.isValid = 1")
    Optional<Bookmark> find(@Param("studyId") Long studyId, @Param("userId") Long userId);

    // userId 가 bookmark한 studyIdList
    @Query("select bm from Bookmark bm where bm.userId = :userId and bm.isValid = 1")
    List<Long> findAllByUserId(@Param("userId") Long userId);
}
