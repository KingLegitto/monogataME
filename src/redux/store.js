import { configureStore } from '@reduxjs/toolkit'
import overallReducer from './reduxStates'

export const store = configureStore({
  reducer: {
    overallStates: overallReducer
  },
})