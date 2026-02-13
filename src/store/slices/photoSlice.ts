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
    async ({ file, category }: { file: File; category: string }, { rejectWithValue }) => {
        try {
            await photoService.uploadGalleryItem(file, category);
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
