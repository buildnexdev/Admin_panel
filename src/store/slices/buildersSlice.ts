import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadHomeImage, uploadBuilderProjectApi } from '../../services/api';
import type { RootState } from '../store';

interface BuildersState {
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: BuildersState = {
    loading: false,
    error: null,
    successMessage: null,
};

export const uploadBuilderProject = createAsyncThunk(
    'builders/uploadProject',
    async ({ data, file }: { data: any; file: File }, { rejectWithValue }) => {
        try {
            await uploadBuilderProjectApi({ data, file });
            return 'Project uploaded successfully';
        } catch (error) {
            return rejectWithValue('Failed to upload project');
        }
    }
);

export const uploadHomeBanners = createAsyncThunk<
    string,
    File[],
    { state: RootState; rejectValue: string }
>(
    'builders/uploadHomeBanners',
    async (files, { getState, rejectWithValue }) => {
        const { user } = (getState() as RootState).auth;
        if (!user) return rejectWithValue('User not authenticated');

        try {
            // Upload each file using FormData with uploadHomeImage API
            await Promise.all(files.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('imageName', file.name);
                formData.append('category', user.category || 'Builders');
                formData.append('companyId', user.companyID.toString());
                
                return uploadHomeImage(formData);
            }));
            return 'Home banners uploaded successfully';
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to upload home banners');
        }
    }
);

const buildersSlice = createSlice({
    name: 'builders',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Upload Project
            .addCase(uploadBuilderProject.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(uploadBuilderProject.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
            })
            .addCase(uploadBuilderProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Upload Home Banners
            .addCase(uploadHomeBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(uploadHomeBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
            })
            .addCase(uploadHomeBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages } = buildersSlice.actions;
export default buildersSlice.reducer;
