import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import schoolReducer from './slices/schoolSlice';
import photoReducer from './slices/photoSlice';
import buildersReducer from './slices/buildersSlice';

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
