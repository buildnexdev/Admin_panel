import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { schoolService } from '../../services/api';

interface SchoolState {
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: SchoolState = {
    loading: false,
    error: null,
    successMessage: null,
};

export const uploadSchoolContent = createAsyncThunk(
    'school/uploadContent',
    async (data: any, { rejectWithValue }) => {
        try {
            await schoolService.uploadContent(data);
            return 'Content uploaded successfully';
        } catch (error) {
            return rejectWithValue('Failed to upload content');
        }
    }
);

export const uploadSchoolImage = createAsyncThunk(
    'school/uploadImage',
    async (
        payload: { file?: File; caption: string; imagePath?: string },
        { rejectWithValue }
    ) => {
        try {
            if (payload.imagePath) {
                await schoolService.uploadImageByPath(payload.caption, payload.imagePath);
            } else if (payload.file) {
                await schoolService.uploadImage(payload.file, payload.caption);
            } else {
                return rejectWithValue('Provide file or imagePath');
            }
            return 'Image uploaded successfully';
        } catch (error) {
            return rejectWithValue('Failed to upload image');
        }
    }
);

const schoolSlice = createSlice({
    name: 'school',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Upload Content
            .addCase(uploadSchoolContent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(uploadSchoolContent.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
            })
            .addCase(uploadSchoolContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Image Upload
            .addCase(uploadSchoolImage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(uploadSchoolImage.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
            })
            .addCase(uploadSchoolImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages } = schoolSlice.actions;
export default schoolSlice.reducer;
