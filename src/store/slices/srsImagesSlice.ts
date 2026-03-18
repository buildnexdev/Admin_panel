import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSrsImagesList, createSrsImages as createSrsImagesApi, updateSrsImage as updateSrsImageApi, deleteSrsImage as deleteSrsImageApi, imageUploadToS3 } from '../../services/api';
import type { RootState } from '../store';

const S3_PATH = 'srsimages';

function getImagePathFromUploadResult(res: any): string | null {
    if (!res || res === 'Image Upload Failed') return null;
    if (typeof res === 'string') return res;
    return res && typeof res === 'object' && res.fileName ? res.fileName : null;
}

export interface SrsImageRecord {
    id: number;
    title: string | null;
    disc?: string | null;
    description?: string | null;
    location?: string | null;
    images?: string[];
    imageUrl?: string;
    image_url?: string;
    companyID?: number;
    userId?: number;
    isActive?: number;
    createdAt?: string;
    created_at?: string;
    [key: string]: any;
}

interface SrsImagesState {
    list: SrsImageRecord[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: SrsImagesState = {
    list: [],
    loading: false,
    error: null,
    successMessage: null,
};

export const fetchSrsImages = createAsyncThunk(
    'srsImages/fetchList',
    async (params: { companyID?: number; userId?: number } | void, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const companyID = params && 'companyID' in params ? params.companyID : state.auth.user?.companyID;
            const userId = params && 'userId' in params ? params.userId : state.auth.user?.userId;
            const data = await getSrsImagesList({ companyID: companyID ?? undefined, userId: userId ?? undefined });
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return rejectWithValue(e instanceof Error ? e.message : 'Failed to fetch SRS images');
        }
    }
);

/** Upload files one by one to S3, then send array of image URLs to backend */
export const createSrsImages = createAsyncThunk(
    'srsImages/create',
    async (
        payload: { title: string; description: string; location: string; files: File[] },
        { getState, rejectWithValue }
    ) => {
        const state = getState() as RootState;
        const user = state.auth.user;
        if (!user) return rejectWithValue('User not logged in');

        const loginData = { companyID: user.companyID, databaseName: (user as any).databaseName };
        const uploadedPaths: string[] = [];

        for (const file of payload.files) {
            const uploadResult = await imageUploadToS3(file, S3_PATH, loginData);
            const path = getImagePathFromUploadResult(uploadResult);
            if (path) uploadedPaths.push(path);
        }

        if (uploadedPaths.length === 0) return rejectWithValue('No images could be uploaded');

        await createSrsImagesApi({
            title: payload.title,
            description: payload.description,
            location: payload.location,
            images: uploadedPaths,
            companyID: user.companyID,
            userId: user.userId,
        });

        return { title: payload.title, images: uploadedPaths };
    }
);

/** Update SRS image: kept existing image URLs + new files (upload to S3), then send images array */
export const updateSrsImage = createAsyncThunk(
    'srsImages/update',
    async (
        params: {
            id: number;
            title?: string;
            disc?: string;
            description?: string;
            location?: string;
            keptImages: string[];
            newFiles: File[];
        },
        { getState, rejectWithValue }
    ) => {
        const state = getState() as RootState;
        const user = state.auth.user;
        if (!user) return rejectWithValue('User not logged in');

        const loginData = { companyID: user.companyID, databaseName: (user as any).databaseName };
        const uploadedPaths: string[] = [];
        for (const file of params.newFiles) {
            const uploadResult = await imageUploadToS3(file, S3_PATH, loginData);
            const path = getImagePathFromUploadResult(uploadResult);
            if (path) uploadedPaths.push(path);
        }

        const allImages = [...params.keptImages, ...uploadedPaths];
        if (allImages.length === 0) return rejectWithValue('At least one image is required');

        await updateSrsImageApi(params.id, {
            title: params.title,
            disc: params.disc ?? params.description,
            location: params.location,
            images: allImages,
        });
        return params.id;
    }
);

export const deleteSrsImage = createAsyncThunk(
    'srsImages/delete',
    async (id: number, { rejectWithValue }) => {
        await deleteSrsImageApi(id);
        return id;
    }
);

const srsImagesSlice = createSlice({
    name: 'srsImages',
    initialState,
    reducers: {
        clearSrsMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchSrsImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSrsImages.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchSrsImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // create
            .addCase(createSrsImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSrsImages.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = 'SRS images uploaded successfully';
            })
            .addCase(createSrsImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // update
            .addCase(updateSrsImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSrsImage.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = 'SRS image updated successfully';
            })
            .addCase(updateSrsImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // delete
            .addCase(deleteSrsImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSrsImage.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((item) => item.id !== action.payload);
                state.successMessage = 'SRS image deleted successfully';
            })
            .addCase(deleteSrsImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSrsMessages } = srsImagesSlice.actions;
export default srsImagesSlice.reducer;
