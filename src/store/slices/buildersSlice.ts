import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { buildersService } from '../../services/api';

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
            await buildersService.uploadProject(data, file);
            return 'Project uploaded successfully';
        } catch (error) {
            return rejectWithValue('Failed to upload project');
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
            });
    },
});

export const { clearMessages } = buildersSlice.actions;
export default buildersSlice.reducer;
