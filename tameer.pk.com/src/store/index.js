import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { MainReducer } from './slices/main'
import { BaseApi } from './rtk-query'

const rootReducer = combineReducers({
  main: MainReducer,
  [BaseApi.reducerPath]: BaseApi.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(BaseApi.middleware),
  enhancers: [],
})
