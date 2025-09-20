import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import usersReducer from '../slices/usersSlice';
import assessmentReducer from '../slices/assessmentSlice';
import slotsReducer from '../slices/appointmentSlotsSlice';
import apptsReducer from '../slices/appointmentsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    assessment: assessmentReducer,
    appointmentSlots: slotsReducer,
    appointments: apptsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
