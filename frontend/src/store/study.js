import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { authApi } from './user'
import { authFormInstance } from '../api'

const API_URL = process.env.REACT_APP_API_URL
const authFormApi = authFormInstance()

const initialState = {
  params: {
    status: 1,
    page: 0,
    key: 'title',
    word: '',
    isOnline: 1,
    orderKey: 'createdAt',
    orderBy: 'asc',
    tagIds: [],
    sidoId: '',
    gugunId: '',
  },
  studies: [],
  totalPage: 0,
  studyDetail: {
    id: 0,
    createdAt: '',
    isValid: 0,
    title: '',
    description: '',
    hit: 0,
    rule: '',
    startedAt: '',
    endedAt: '',
    recruitFinishedAt: '',
    maxMember: 0,
    minMember: 0,
    currentMember: 0,
    isOnline: 0,
    likeCnt: 0,
    bookmarkCnt: 0,
    status: 0,
    originalId: 0,
    sidoId: 0,
    gugunId: 0,
    coverImgUrl: null,
    badge: {
      id: 0,
      imgUrl: '',
      name: '',
      description: '',
    },
    studyTags: [],
    leaderProfile: {
      id: 0,
      isValid: 0,
      nickname: '',
      profileImgUrl: '',
      description: '',
      tags: [],
      badges: [
        {
          id: 0,
          imgUrl: '',
          name: '',
          description: '',
        },
      ],
      score: 0,
    },
  },
  tags: [],
  likeList: [],
}

export const studyAction = {
  studyList: createAsyncThunk('study/list', async (payload, thunkAPI) => {
    try {
      const options = payload
      let uri = '/study?'
      Object.keys(options).forEach((option, index) => {
        if (option === 'tagIds') {
          if (!option.length) {
            options[option]?.forEach(tagId => {
              uri += `${option}=${tagId}`
            })
            uri += '&'
          }
        } else {
          if (index !== 0) uri += '&'
          uri += `${option}=${options[option]}`
        }
      })
      const response = await axios.get(`${API_URL}${uri}`)
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  studyDetail: createAsyncThunk('study/detail', async (payload, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/study/${payload}`)
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  studyUpdate: createAsyncThunk('study/update', async (payload, thunkAPI) => {
    try {
      const response = await authFormApi.put(`/study`, payload)
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  // 태그 리스트
  getTags: createAsyncThunk('study/getTags', async (payload, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/tags`)
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  joinStudy: createAsyncThunk('study/joinStudy', async (payload, thunkAPI) => {
    try {
      const response = await authApi.post(
        `${API_URL}/participation-history/${payload}`,
      )
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  getLike: createAsyncThunk('study/getLike', async (payload, thunkAPI) => {
    try {
      const response = await authApi.get(`${API_URL}/study/like`)
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  like: createAsyncThunk('study/like', async (payload, thunkAPI) => {
    try {
      const response = await authApi.post(`${API_URL}/study/like/${payload}`)
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  dislike: createAsyncThunk('study/dislike', async (payload, thunkAPI) => {
    try {
      const response = await authApi.delete(`${API_URL}/study/like/${payload}`)
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  bookmark: createAsyncThunk('study/bookmark', async (payload, thunkAPI) => {
    try {
      const response = await authApi.post(
        `${API_URL}/study/bookmark/${payload}`,
      )
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  disbookmark: createAsyncThunk(
    'study/disbookmark',
    async (payload, thunkAPI) => {
      try {
        const response = await authApi.delete(
          `${API_URL}/study/bookmark/${payload}`,
        )
        return thunkAPI.fulfillWithValue(response.data)
      } catch (error) {
        return thunkAPI.rejectWithValue(error)
      }
    },
  ),
  addNotice: createAsyncThunk('study/addNotice', async (payload, thunkAPI) => {
    try {
      const response = await authApi.post(`${API_URL}/study-notice`, payload)
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  updateNotice: createAsyncThunk(
    'study/updateNotice',
    async (payload, thunkAPI) => {
      try {
        const data = {
          studyId: payload.studyId,
          content: payload.content,
        }
        const response = await authApi.put(
          `${API_URL}/study-notice/${payload.noticeId}`,
          data,
        )
        return thunkAPI.fulfillWithValue(response.data)
      } catch (error) {
        return thunkAPI.rejectWithValue(error)
      }
    },
  ),
  addQnA: createAsyncThunk('study/addQnA', async (payload, thunkAPI) => {
    try {
      const response = await authApi.post(`${API_URL}/qna`, payload)
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  updateQnA: createAsyncThunk('study/updateQnA', async (payload, thunkAPI) => {
    try {
      const data = {
        userId: payload.userId,
        studyId: payload.studyId,
        question: payload.question,
        answer: payload.answer,
      }
      const response = await authApi.put(
        `${API_URL}/qna/${payload.qnaId}`,
        data,
      )
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  addEval: createAsyncThunk('study/addEval', async (payload, thunkAPI) => {
    try {
      const response = await authApi.post(`${API_URL}/study/eval`, payload)
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  addCurr: createAsyncThunk('study/addCurr', async (payload, thunkAPI) => {
    try {
      const response = await authApi.post(`${API_URL}/session`, payload, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }),
  deleteCurr: createAsyncThunk(
    'study/deleteCurr',
    async (payload, thunkAPI) => {
      try {
        const response = await authApi.delete(`${API_URL}/session/${payload}`)
        return thunkAPI.fulfillWithValue(response.data)
      } catch (error) {
        return thunkAPI.rejectWithValue(error)
      }
    },
  ),
}

export const studySlice = createSlice({
  name: 'study',
  initialState,
  reducers: {
    setText: (state, action) => {
      if (action.payload === null) {
        action.payload = ''
      }
      state.params.word = action.payload
    },
    setOnline: state => {
      if (state.params.isOnline) {
        state.params.isOnline = 0
      } else {
        state.params.isOnline = 1
      }
    },
    setParams: (state, action) => {
      state.params = action.payload
    },
    initParams: state => {
      state.params = {
        status: 1,
        page: 0,
        key: 'title',
        word: '',
        isOnline: 1,
        orderKey: 'like',
        orderBy: 'desc',
        tagIds: [],
        sidoId: '',
        gugunId: '',
      }
    },
  },
  extraReducers: {
    [studyAction.studyList.fulfilled]: (state, action) => {
      state.studies = action.payload.content
      state.totalPage = action.payload.totalPagess
    },
    [studyAction.studyDetail.fulfilled]: (state, action) => {
      state.studyDetail = action.payload
    },
    [studyAction.studyUpdate.fulfilled]: (state, action) => {
      state.studyDetail = action.payload
    },
    [studyAction.getTags.fulfilled]: (state, action) => {
      state.tags = action.payload.tagList
      localStorage.setItem('tags', JSON.stringify(action.payload.tagList))
    },
    [studyAction.getLike.fulfilled]: (state, action) => {
      state.likeList = action.payload
    },
    [studyAction.bookmark.fulfilled]: () => {
      // alert('북마크')
    },
    [studyAction.disbookmark.fulfilled]: () => {
      // alert('북마크 취소')
    },
    [studyAction.joinStudy.rejected]: () => {
      alert('이미 신청 된 스터디입니다!')
    },
  },
})

export const { setText, setOnline, setParams } = studySlice.actions

export default studySlice.reducer
