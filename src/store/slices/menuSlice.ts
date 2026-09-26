import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';

export interface MenuConfig {
    companyID?: number;
    projects?: number;
    company?: number;
    banners?: number;
    blog?: number;
    service?: number;
    contact?: number;
    quotation?: number;
    [key: string]: number | undefined;
}

interface MenuState {
    config: MenuConfig | null;
    loading: boolean;
    error: string | null;
}

const initialState: MenuState = {
    config: null,
    loading: false,
    error: null,
};

/** Load company menu feature flags (authenticated). */
export const fetchMenu = createAsyncThunk(
    'menu/fetchMenu',
    async (companyID: number, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`menu/${companyID}`);
            const data = response?.data?.data ?? response?.data;
            return data as MenuConfig;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to fetch menu');
        }
    }
);

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.config = action.payload;
            })
            .addCase(fetchMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default menuSlice.reducer;
