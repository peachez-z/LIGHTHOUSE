package com.ssafy.lighthouse.domain.study.dto;

import com.ssafy.lighthouse.domain.study.entity.StudyEval;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StudyEvalDto {
    private Long studyId;
    private Long userId;
    private String comment;
    private int score;

    public StudyEvalDto(StudyEval studyEval) {
        this.studyId = studyEval.getStudyId();
        this.userId = studyEval.getUserId();
        this.comment = studyEval.getComment();
        this.score = studyEval.getScore();
    }

    public StudyEval toEntity() {
        return StudyEval.builder()
                .studyId(this.studyId)
                .userId(this.userId)
                .comment(this.comment)
                .score(this.score)
                .build();
    }
}