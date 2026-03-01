import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { photoService } from '../../services/api';

interface PhotoState {
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: PhotoState = {
    loading: false,
    error: null,
    successMessage: null,
};

export const uploadGalleryPhoto = createAsyncThunk(
    'photo/uploadGalleryPhoto',
    async (
        payload: { file?: File; category: string; imagePath?: string },
        { rejectWithValue }
    ) => {
        try {
            if (payload.imagePath) {
                await photoService.uploadGalleryItemByPath(payload.category, payload.imagePath);
            } else if (payload.file) {
                await photoService.uploadGalleryItem(payload.file, payload.category);
            } else {
                return rejectWithValue('Provide file or imagePath');
            }
            return 'Photo added to gallery successfully';
        } catch (error) {
            return rejectWithValue('Failed to upload photo');
        }
    }
);

const photoSlice = createSlice({
    name: 'photo',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Upload Gallery Photo
            .addCase(uploadGalleryPhoto.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(uploadGalleryPhoto.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
            })
            .addCase(uploadGalleryPhoto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages } = photoSlice.actions;
export default photoSlice.reducer;
