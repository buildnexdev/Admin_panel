import { configureStore } from '@reduxjs/toolkit';
import schoolReducer from './slices/schoolSlice';
import photoReducer from './slices/photoSlice';
import buildersReducer from './slices/buildersSlice';
import authReducer from './slices/authSlice';
import quotationReducer from './slices/quotationSlice';
import menuReducer from './slices/menuSlice';
import categoryReducer from './slices/categorySlice';
import srsImagesReducer from './slices/srsImagesSlice';
import reviewReducer from './slices/reviewSlice';
import teamReducer from './slices/teamSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        school: schoolReducer,
        photo: photoReducer,
        builders: buildersReducer,
        quotation: quotationReducer,
        menu: menuReducer,
        category: categoryReducer,
        srsImages: srsImagesReducer,
        reviews: reviewReducer,
        team: teamReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
