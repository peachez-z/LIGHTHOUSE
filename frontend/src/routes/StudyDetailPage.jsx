import React, { useEffect, useState } from 'react'
import { Row, Col, Tag, Tabs, Button, Tooltip, Modal, Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookmark as faBookmarkSolid,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons'
import {
  faBookmark as faBookmarkRegular,
  faHeart as faHeartRegular,
} from '@fortawesome/free-regular-svg-icons'
import StudyInfo from '../components/Study/StudyInfo'
import StudyQnA from '../components/Study/StudyQnA'
import StudyEdit from '../components/Study/StudyEdit'
import JoinStudyInfo from '../components/Study/join/JoinStudyInfo'
import StudyMember from '../components/Study/StudyMember'
import { studyAction } from '../store/study'
import { userAction } from '../store/user'
import { coverImage } from '../utils/image'
import UserName from '../components/Study/UserName'
import { STATUS } from '../utils'
import { updateStudyStatus } from '../api/study'

export default function StudyDetailPage() {
  const dispatch = useDispatch()
  const studyId = window.location.pathname?.split('/')[2]
  const study = useSelector(state => state.study.studyDetail)

  // eslint-disable-next-line react/no-unstable-nested-components, react/jsx-props-no-spreading

  useEffect(() => {
    dispatch(studyAction.studyDetail(studyId))
    dispatch(userAction.profile(sessionStorage.getItem('userId')))
    dispatch(studyAction.getLike())
  }, [])

  const myInfo = useSelector(state => state.user.myProfile)
  const likeList = useSelector(state => state.study.likeList)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)
  const [message, setMessage] = useState('')
  const userId = sessionStorage.getItem('userId')
  // 해당 스터디 가입한 사람과 그렇지 않은 사람 구분
  const tabMenu = [
    { 정보: <StudyInfo study={study} /> },
    ...(study?.memberProfiles?.find(
      memberProfile => memberProfile.id === Number(userId),
    )?.id
      ? [{ 가입했을때정보: <JoinStudyInfo study={study} /> }]
      : [
          { 'Q&A': <StudyQnA study={study} /> },
          { '스터디원 정보': <StudyMember members={study?.memberProfiles} /> },
          myInfo.id === study.leaderProfile.id
            ? { '정보 수정': <StudyEdit study={study} /> }
            : '',
        ]),
  ]
  const showModal = () => {
    setIsModalVisible(true)
    // Body 스크롤 방지
    document.body.style.overflow = 'hidden'
  }

  const handleOk = () => {
    dispatch(studyAction.joinStudy(study.id)).then(res => {
      if (res.type !== 'study/joinStudy/rejected') {
        setMessage('')
        setIsModalVisible(false)
        setIsConfirmationVisible(true)
      }
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    // Body 스크롤 재개
    document.body.style.overflow = 'auto'
  }

  const handleConfirmationOk = () => {
    setIsConfirmationVisible(false)
    // Body 스크롤 재개
    document.body.style.overflow = 'auto'
  }

  const handleChangeMessage = e => {
    setMessage(e.target.value)
  }

  const handleChangeStatus = () => {
    let { status } = study
    if (study.status === STATUS.PREPARING) {
      status = STATUS.RECRUITING
    } else if (study.status === STATUS.RECRUITING) {
      status = STATUS.PROGRESS
    } else if (study.status === STATUS.PROGRESS) {
      status = STATUS.TERMINATED
    } else if (study.status === STATUS.TERMINATED) {
      status = STATUS.SHARE
    }
    updateStudyStatus(
      { studyId: study.id, status },
      () => {
        dispatch(studyAction.studyDetail(study.id))
      },
      () => {},
    )
  }

  let buttonMessage = ''
  if (study.status === STATUS.PREPARING) {
    buttonMessage = '모집 시작'
  } else if (study.status === STATUS.RECRUITING) {
    buttonMessage = '스터디 시작'
  } else if (study.status === STATUS.PROGRESS) {
    buttonMessage = '스터디 종료'
  } else if (study.status === STATUS.TERMINATED) {
    buttonMessage = '스터디 공유'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <Row
          style={{
            backgroundColor: 'rgb(218, 230, 255)',
            height: '300px',
            padding: '40px',
          }}
        >
          <Col xs={24} sm={24} md={10} style={{ marginRight: '40px' }}>
            <img
              style={{
                width: '100%',
                height: '220px',
                marginLeft: '50%',
                transform: 'translateX(-50%)',
                objectFit: 'cover',
              }}
              src={coverImage(study.coverImgUrl)}
              alt="coverImage"
            />
          </Col>
          <Col
            style={{
              padding: '30px 0 0 0',
            }}
          >
            <h1 style={{ height: '40px' }}>{study.title}</h1>
            <p style={{ fontSize: '16px' }}>
              스터디장: <UserName user={study.leaderProfile} />{' '}
            </p>
            <p style={{ marginTop: '20px' }}>
              {study.isOnline
                ? '온라인'
                : study.sido && study.gugun
                ? `오프라인: 장소 - ${study.sido}, ${study.gugun}`
                : '오프라인'}
              <br />
              현재 인원: {study.currentMember} 최대 인원: {study.maxMember} 최소
              인원: {study.minMember}
              <br />
              <br />
              스터디 기간: <br />
              {study.startedAt} - {study.endedAt}
            </p>

            <div
              style={{
                fontSize: '12px',
                marginTop: '5px',
                height: '55px',
                overflow: 'hidden',
                marginBottom: '10px',
              }}
            >
              {study.studyTags.map(tag => {
                return (
                  <Tag
                    key={tag.id}
                    style={{
                      margin: '3px',
                    }}
                  >
                    #{tag.tag.keyword}
                  </Tag>
                )
              })}
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <Row>
          <Col span={18}>
            <Tabs
              items={tabMenu.map((menu, index) => {
                return {
                  label: Object.keys(menu),
                  key: index,
                  children: Object.values(menu),
                }
              })}
            />
          </Col>
          {/* 사이드바 */}
          <Col span={6} style={{ paddingTop: '40px' }} align="middle">
            <div
              style={{
                width: '80%',
                height: '160px',
                border: 'solid 1px',
                borderColor: ' rgb(216, 216, 216)',
                borderRadius: '5%',
                position: 'sticky',
                top: '70px',
                padding: '10px',
              }}
            >
              <p style={{ fontSize: '12px', textAlign: 'left' }}>
                모집 기간: {study.createdAt} - {study.recruitFinishedAt}
              </p>
              <div style={{ paddingTop: '30px' }}>
                {myInfo.id === study.leaderProfile.id ? (
                  study.status !== STATUS.SHARE ? (
                    <Button
                      type="primary"
                      style={{
                        width: '100%',
                      }}
                      onClick={handleChangeStatus}
                    >
                      {buttonMessage}
                    </Button>
                  ) : (
                    ''
                  )
                ) : (
                  <Button
                    type="primary"
                    style={{
                      width: '100%',
                    }}
                    onClick={showModal}
                  >
                    스터디 참가 신청
                  </Button>
                )}

                <Modal
                  title="스터디 신청"
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <p>스터디장에게 하고 싶은 말을 남겨주세요.</p>
                  <Input
                    placeholder="스터디장에게 하고 싶은 말을 작성해주세요."
                    value={message}
                    onChange={handleChangeMessage}
                  />
                </Modal>

                <Modal
                  title="신청이 완료되었습니다."
                  visible={isConfirmationVisible}
                  onOk={handleConfirmationOk}
                  onCancel={handleConfirmationOk}
                >
                  <p>스터디 신청이 성공적으로 완료되었습니다.</p>
                </Modal>
              </div>
              <Row style={{ marginTop: '10px' }}>
                {myInfo.bookmarkStudies?.find(
                  bookmarkStudy => bookmarkStudy.id === study.id,
                ) ? (
                  <Col
                    span={12}
                    align="middle"
                    onClick={() => {
                      dispatch(studyAction.disbookmark(study.id)).then(() => {
                        dispatch(studyAction.studyDetail(study.id))
                        dispatch(userAction.profile(myInfo.id))
                      })
                    }}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    <Tooltip title="북마크 취소">
                      <FontAwesomeIcon
                        className="blue"
                        icon={faBookmarkSolid}
                      />{' '}
                      {study.bookmarkCnt}
                    </Tooltip>
                  </Col>
                ) : (
                  <Col
                    span={12}
                    align="middle"
                    onClick={() => {
                      dispatch(studyAction.bookmark(study.id)).then(() => {
                        dispatch(studyAction.studyDetail(study.id))
                        dispatch(userAction.profile(myInfo.id))
                      })
                    }}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    <Tooltip title="북마크">
                      <FontAwesomeIcon
                        className="blue"
                        icon={faBookmarkRegular}
                      />{' '}
                      {study.bookmarkCnt}
                    </Tooltip>
                  </Col>
                )}

                {likeList.find(id => id === study.id) ? (
                  <Col
                    span={12}
                    align="middle"
                    onClick={() => {
                      dispatch(studyAction.dislike(study.id)).then(() => {
                        dispatch(studyAction.studyDetail(study.id))
                        dispatch(studyAction.getLike())
                      })
                    }}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    <Tooltip title="좋아요 취소">
                      <FontAwesomeIcon className="red" icon={faHeartSolid} />{' '}
                      {study.likeCnt}
                    </Tooltip>
                  </Col>
                ) : (
                  <Col
                    span={12}
                    align="middle"
                    onClick={() => {
                      dispatch(studyAction.like(study.id)).then(() => {
                        dispatch(studyAction.studyDetail(study.id))
                        dispatch(studyAction.getLike())
                      })
                    }}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    <Tooltip title="좋아요">
                      <FontAwesomeIcon className="red" icon={faHeartRegular} />{' '}
                      {study.likeCnt}
                    </Tooltip>
                  </Col>
                )}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
