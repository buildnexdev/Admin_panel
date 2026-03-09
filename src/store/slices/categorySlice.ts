import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories as getCategoriesApi } from "../../services/api";

export interface CategoryItem {
    id?: number;
    name: string;
    slug?: string;
    [key: string]: unknown;
}

interface CategoryState {
    list: CategoryItem[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    list: [],
    loading: false,
    error: null,
};

export const getCategories = createAsyncThunk(
    "category/getCategories",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getCategoriesApi();
            const list = Array.isArray(data) ? data : [];
            return list.map((item: any) => {
                if (typeof item === 'string') return { id: undefined, name: item, slug: item };
                return {
                    id: item.id,
                    name: item.name ?? item.categoryName ?? item.title ?? String(item.id ?? ""),
                    slug: item.slug ?? item.categorySlug,
                    ...item,
                };
            });
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to load categories");
        }
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action: any) => {
                state.loading = false;
                state.list = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getCategories.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to load categories";
                state.list = [];
            });
    },
});

export default categorySlice.reducer;
