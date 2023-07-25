package com.ssafy.lighthouse.domain.study.entity;

import com.ssafy.lighthouse.domain.common.BaseEntity;
import com.ssafy.lighthouse.domain.common.entity.Tag;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyTag extends BaseEntity {
    private Long studyId;
    private Long tagId;

    public StudyTag(StudyTag studyTag) {
        this.studyId = studyTag.getStudyId();
        this.tagId = studyTag.getTagId();
    }
}
