import { configureStore } from '@reduxjs/toolkit';
import schoolReducer from './slices/schoolSlice';
import photoReducer from './slices/photoSlice';
import buildersReducer from './slices/buildersSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        school: schoolReducer,
        photo: photoReducer,
        builders: buildersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
