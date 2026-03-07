import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchQuotationByToken, createQuotation as createQuotationApi, getQuotationList as getQuotationListApi, updateQuotation as updateQuotationApi, deleteQuotation as deleteQuotationApi } from "../../services/api";

export interface QuotationListItem {
  id?: number;
  token?: string;
  client_name: string;
  project_details?: string;
  price: number;
  view_count?: number;
  viewCount?: number;
  created_at?: string;
}

interface Quotation {
  id?: number;
  client_name: string;
  project_details: string;
  price: number;
  token?: string;
  company_name?: string;
}

interface QuotationState {
  data: Quotation | null;
  list: QuotationListItem[];
  listLoading: boolean;
  loading: boolean;
  error: string | null;
  lastCreatedToken: string | null;
}

const initialState: QuotationState = {
  data: null,
  list: [],
  listLoading: false,
  loading: false,
  error: null,
  lastCreatedToken: null,
};

export const getQuotation = createAsyncThunk(
  "quotation/getQuotation",
  async (token: string, { rejectWithValue }) => {
    try {
      return await fetchQuotationByToken(token);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);

export const fetchQuotationList = createAsyncThunk(
  "quotation/fetchQuotationList",
  async (params: { userId?: number; category?: string | null } | void, { rejectWithValue }) => {
    try {
      return await getQuotationListApi(params ?? undefined);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load quotations");
    }
  }
);

export const createQuotation = createAsyncThunk(
  "quotation/createQuotation",
  async (
    payload: {
      client_name: string;
      project_details: string;
      price: number;
      companyID?: number;
      userId?: number;
      category?: string | null;
      company_name?: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await createQuotationApi(payload);
      const token = res?.token ?? res?.data?.token ?? res?.data?.id ?? null;
      if (!token) throw new Error("No token returned");
      return { ...res, token: String(token) };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to create quotation");
    }
  }
);

export const updateQuotation = createAsyncThunk(
  "quotation/updateQuotation",
  async ({ token, data }: { token: string; data: { client_name?: string; project_details?: string; price?: number } }, { rejectWithValue }) => {
    try {
      const res = await updateQuotationApi(token, data);
      return { token, data: res?.data ?? data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update quotation");
    }
  }
);

export const deleteQuotation = createAsyncThunk(
  "quotation/deleteQuotation",
  async (token: string, { dispatch, rejectWithValue }) => {
    try {
      await deleteQuotationApi(token);
      // We don't necessarily need to refetch if we remove from state, but refetching is safer
      return token;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete quotation");
    }
  }
);

const quotationSlice = createSlice({
  name: "quotation",
  initialState,
  reducers: {
    clearQuotationLink: (state) => {
      state.lastCreatedToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getQuotation.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuotationList.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(fetchQuotationList.fulfilled, (state, action: any) => {
        state.listLoading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuotationList.rejected, (state) => {
        state.listLoading = false;
        state.list = [];
      })
      .addCase(createQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuotation.fulfilled, (state, action: any) => {
        state.loading = false;
        state.lastCreatedToken = action.payload?.token ?? null;
        const token = action.payload?.token;
        const client_name = action.meta?.arg?.client_name;
        const price = action.meta?.arg?.price;
        const project_details = action.meta?.arg?.project_details;
        if (token && client_name != null && price != null) {
          state.list = [{ token: String(token), client_name, price, project_details }, ...state.list];
        }
      })
      .addCase(createQuotation.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQuotation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuotation.fulfilled, (state, action) => {
        state.loading = false;
        const { token, data } = action.payload;
        const index = state.list.findIndex(q => q.token === token);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...data };
        }
      })
      .addCase(deleteQuotation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(q => q.token !== action.payload);
      });
  },
});

export const { clearQuotationLink } = quotationSlice.actions;

export default quotationSlice.reducer;