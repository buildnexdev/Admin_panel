import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTeamMembers as getTeamMembersApi, addTeamMember as createTeamMemberApi, updateTeamMember as updateTeamMemberApi, deleteTeamMember as deleteTeamMemberApi } from '../../services/teamApi';
import type { TeamMemberData } from '../../services/teamApi';

interface TeamState {
    members: TeamMemberData[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: TeamState = {
    members: [],
    loading: false,
    error: null,
    successMessage: null,
};

// ─── Thunks ────────────────────────────────────────────────────────────────────

export const fetchTeamMembers = createAsyncThunk(
    'team/fetchTeamMembers',
    async (companyID: number, { rejectWithValue }) => {
        try {
            const res = await getTeamMembersApi(companyID);
            return res?.data ?? res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch team members');
        }
    }
);

export const addTeamMember = createAsyncThunk(
    'team/addTeamMember',
    async (payload: any, { rejectWithValue }) => {
        try {
            const res = await createTeamMemberApi(payload);
            return res?.data ?? res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to add team member');
        }
    }
);

export const updateTeamMember = createAsyncThunk(
    'team/updateTeamMember',
    async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
        try {
            const res = await updateTeamMemberApi(id, data);
            return res?.data ?? res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update team member');
        }
    }
);

export const deleteTeamMember = createAsyncThunk(
    'team/deleteTeamMember',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteTeamMemberApi(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete team member');
        }
    }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────

const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        clearTeamMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTeamMembers.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(fetchTeamMembers.fulfilled, (state, action) => { state.loading = false; state.members = action.payload || []; });
        builder.addCase(fetchTeamMembers.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        builder.addCase(addTeamMember.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(addTeamMember.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = 'Member added successfully!';
            if (action.payload) state.members.push(action.payload);
        });
        builder.addCase(addTeamMember.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        builder.addCase(updateTeamMember.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(updateTeamMember.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = 'Member updated successfully!';
            const idx = state.members.findIndex((m) => m.id === action.payload.id);
            if (idx !== -1) state.members[idx] = action.payload;
        });
        builder.addCase(updateTeamMember.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        builder.addCase(deleteTeamMember.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(deleteTeamMember.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = 'Member deleted successfully!';
            state.members = state.members.filter((m) => m.id !== action.payload);
        });
        builder.addCase(deleteTeamMember.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearTeamMessages } = teamSlice.actions;
export default teamSlice.reducer;
