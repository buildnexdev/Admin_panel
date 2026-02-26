import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserloginService } from '../../services/api';

interface User {
    userId: number;
    name: string;
    phoneNumber: string;
    companyID: number;
    location: string;
    isActive: number;
    role: string;
    category: 'Builders' | 'Photography' | 'School' | null;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('auth_token'),
    user: localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null,
    token: localStorage.getItem('auth_token'),
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk<
    { token: string; data: User },
    { phone: string; password: string },
    { rejectValue: string }
>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await UserloginService.login(credentials) as { token: string; data: User };
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('auth_user', JSON.stringify(response.data));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        await UserloginService.logout();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        },
        setDemoAuth: (state) => {
            state.isAuthenticated = true;
            state.user = {
                userId: 999,
                name: 'Demo Admin',
                phoneNumber: '1234567890',
                companyID: 1,
                location: 'Demo City',
                isActive: 1,
                role: 'admin',
                category: 'Builders'
            };
            state.token = 'demo-token';
            localStorage.setItem('auth_token', 'demo-token');
            localStorage.setItem('auth_user', JSON.stringify(state.user));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            });
    },
});

export const { clearAuthError, setDemoAuth } = authSlice.actions;
export default authSlice.reducer;
