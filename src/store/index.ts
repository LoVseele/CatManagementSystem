import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import usersReducer from '../slices/usersSlice';
import scoresReducer from '../slices/scoresSlice';
import slotsReducer from '../slices/appointmentSlotsSlice';
import apptsReducer from '../slices/appointmentsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    scores: scoresReducer,
    appointmentSlots: slotsReducer,
    appointments: apptsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
