import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getReviewsList, createReview, updateReviewApi, deleteReviewApi } from '../../services/reviewApi';
import type { ReviewData } from '../../services/reviewApi';

interface ReviewState {
    reviews: ReviewData[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null,
    successMessage: null,
};

// ─── Thunks ────────────────────────────────────────────────────────────────────

export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async (companyID: number, { rejectWithValue }) => {
        try {
            return await getReviewsList({ companyID });
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch reviews');
        }
    }
);

export const addReview = createAsyncThunk(
    'reviews/addReview',
    async (payload: ReviewData, { rejectWithValue }) => {
        try {
            const res = await createReview(payload);
            return res?.data ?? res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to add review');
        }
    }
);

export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async ({ id, data }: { id: number; data: Partial<ReviewData> }, { rejectWithValue }) => {
        try {
            const res = await updateReviewApi(id, data);
            return { id, ...data, ...(res?.data ?? res) };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update review');
        }
    }
);

export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteReviewApi(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete review');
        }
    }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        clearReviewMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch
        builder.addCase(fetchReviews.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(fetchReviews.fulfilled, (state, action) => { state.loading = false; state.reviews = action.payload; });
        builder.addCase(fetchReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // Add
        builder.addCase(addReview.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(addReview.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = 'Review added successfully!';
            if (action.payload) state.reviews.unshift(action.payload);
        });
        builder.addCase(addReview.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // Update
        builder.addCase(updateReview.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(updateReview.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = 'Review updated successfully!';
            const idx = state.reviews.findIndex((r) => r.id === action.payload.id);
            if (idx !== -1) state.reviews[idx] = { ...state.reviews[idx], ...action.payload };
        });
        builder.addCase(updateReview.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // Delete
        builder.addCase(deleteReview.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(deleteReview.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = 'Review deleted successfully!';
            state.reviews = state.reviews.filter((r) => r.id !== action.payload);
        });
        builder.addCase(deleteReview.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearReviewMessages } = reviewSlice.actions;
export default reviewSlice.reducer;
