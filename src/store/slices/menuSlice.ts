import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../services/api';

export interface MenuConfig {
    companyID?: number;
    projects?: number;   // 1 = show, 0 = hide
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

export const fetchMenu = createAsyncThunk(
    'menu/fetchMenu',
    async (companyID: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}menu/${companyID}`);
            // API returns { success: true, data: { companyID, projects, banners, ... } }
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
