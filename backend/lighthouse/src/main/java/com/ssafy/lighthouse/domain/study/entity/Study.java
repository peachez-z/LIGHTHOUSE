package com.ssafy.lighthouse.domain.study.entity;

import com.ssafy.lighthouse.domain.common.BaseEntity;
import com.ssafy.lighthouse.domain.common.entity.Gugun;
import com.ssafy.lighthouse.domain.common.entity.Sido;
import com.ssafy.lighthouse.domain.user.entity.User;
import com.ssafy.lighthouse.global.util.STATUS;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.util.Set;

@Entity
@Getter
@ToString
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Study extends BaseEntity {
    private String title;
    private String description;
    private int hit;
    private String rule;
    private String startedAt;
    private String endedAt;
    private String recruitFinishedAt;
    private int maxMember;
    private int minMember;
    private int currentMember;
    private int isOnline;
    private int likeCnt;
    private int bookmarkCnt;
    private int status;
    
    public void share() {
        this.status = STATUS.SHARE; // share중인 상태
    }

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "originalId")
    private Study original;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leaderId")
    private User leader;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sidoId")
    private Sido sido;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gugunId")
    private Gugun gugun;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyId")
    private Set<StudyTag> studyTags;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyId")
    private Set<StudyEval> studyEvals;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyId")
    private Set<StudyNotice> studyNotices;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyId")
    private Set<Session> sessions;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyId")
    private Set<Qna> qnas;
}
