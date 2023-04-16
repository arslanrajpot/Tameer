import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: localStorage.getItem('name'),
  username: localStorage.getItem('username'),
  email: localStorage.getItem('email'),
  phone: localStorage.getItem('phone'),
  address: {
    street: localStorage.getItem('street'),
    country: localStorage.getItem('country'),
  },
  userId: localStorage.getItem('sub'),
  auth_token: localStorage.getItem('auth_token'),
  loading: false,
  sidebarShow: true,
  sidebarFolded: false,
  currentProject: {},
  currentDetailsTracker: {},
  projects: [],
  currentProjectPreviousStatus: '',
}

const Main = createSlice({
  name: 'mainSlice',
  initialState: initialState,
  reducers: {
    UpdateCredentials(state, action) {
      state.username = action.payload.username
      state.email = action.payload.email
    },
    saveToken(state, action) {
      localStorage.setItem('auth_token', action.payload)
      state.auth_token = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },

    saveInformation(state, action) {
      localStorage.setItem('username', action.payload.username)
      localStorage.setItem('email', action.payload.email)
      localStorage.setItem('phone', action.payload.phone)
      localStorage.setItem('sub', action.payload.sub)
      localStorage.setItem('name', action.payload.name)
      state.username = action.payload.username
      state.email = action.payload.email
      state.phone = action.payload.phone
      state.userId = action.payload.sub
      state.name = action.payload.name
      if (action.payload.address && Object.keys(action.payload.address).length > 0) {
        localStorage.setItem(
          'street',
          action.payload.address.street && action.payload.address.street,
        )
        localStorage.setItem(
          'country',
          action.payload.address.country && action.payload.address.country,
        )
        state.address = {
          ...state.address,
          ...action.payload.address,
        }
      }
    },

    logout(state, action) {
      localStorage.clear()
      state = initialState /// clone this deeply with lodash later
    },

    setSidebarShow(state, action) {
      state.sidebarShow = action.payload
    },

    setSidebarFolded(state, action) {
      state.sidebarFolded = action.payload
    },

    setCurrentProject(state, action) {
      state.currentProject = action.payload
    },

    setCurrentDetailTracker(state, action) {
      state.currentDetailsTracker = action.payload
    },

    setProjects(state, action) {
      state.projects = action.payload
    },

    setCurrentProjectPreviousStatus(state, action) {
      state.currentProjectPreviousStatus = action.payload
    },
  },
})

export const {
  UpdateCredentials,
  saveToken,
  setLoading,
  saveInformation,
  logout,
  setSidebarShow,
  setSidebarFolded,
  setCurrentProject,
  setCurrentDetailTracker,
  setProjects,
  setCurrentProjectPreviousStatus,
} = Main.actions
export const MainReducer = Main.reducer
