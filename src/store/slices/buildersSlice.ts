import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadBuilderProjectApi, saveBannerPaths } from '../../services/api';

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
    'banners/uploadProject',
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
    { fileNames: string[]; companyID: number; userID: number },
    { rejectValue: string }
>(
    'banners/uploadAndSaveBanners',
    async ({ fileNames, companyID, userID }, { rejectWithValue }) => {
        try {
            await saveBannerPaths({
                bannerPaths: fileNames,
                companyID,
                userId: userID
            });
            return 'Home banners uploaded and saved successfully';
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
