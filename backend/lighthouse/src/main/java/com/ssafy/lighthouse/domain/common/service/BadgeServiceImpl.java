package com.ssafy.lighthouse.domain.common.service;

import com.ssafy.lighthouse.domain.common.dto.BadgeRequest;
import com.ssafy.lighthouse.domain.common.entity.Badge;
import com.ssafy.lighthouse.domain.common.exception.BadgeException;
import com.ssafy.lighthouse.domain.common.repository.BadgeRepository;
import com.ssafy.lighthouse.domain.common.util.S3Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class BadgeServiceImpl implements BadgeService {
    private final BadgeRepository badgeRepository;

    @Override
    public Badge createBadge(BadgeRequest badgeRequest) {
        // aws에 업로드
        String imgUrl = S3Utils.uploadFile("badge", badgeRequest.getImg());

        // db에 badge정보 저장
        return badgeRepository.save(Badge.builder()
                .name(badgeRequest.getName())
                .description(badgeRequest.getDescription())
                .imgUrl(imgUrl)
                .build());
    }

    @Override
    public void removeBadge(Long badgeId) {
        // db에서 삭제
        Badge badge = badgeRepository.findByBadgeId(badgeId).orElseThrow(BadgeException::new);
        badge.changeIsValid(0);

        // aws에서 삭제
        S3Utils.deleteFile(badge.getImgUrl());
    }
}
