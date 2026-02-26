import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadBuilderProjectApi, saveBannerPaths, contentCMSService } from '../../services/api';

interface Project {
    id: number;
    title: string;
    description: string;
    image_url: string;
    companyID: number;
    created_at: string;
}

interface Banner {
    id: number;
    image_url: string;
    companyID: number;
    created_at: string;
}

interface Service {
    id: number;
    title: string;
    description: string;
    icon: string;
    companyID: number;
}

interface Blog {
    id: number;
    title: string;
    content: string;
    image_url: string;
    companyID: number;
    created_at: string;
}

interface BuildersState {
    projects: Project[];
    banners: Banner[];
    services: Service[];
    blogs: Blog[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: BuildersState = {
    projects: [],
    banners: [],
    services: [],
    blogs: [],
    loading: false,
    error: null,
    successMessage: null,
};

// FETCH THUNKS
export const fetchProjects = createAsyncThunk(
    'builders/fetchProjects',
    async (companyID: number, { rejectWithValue }) => {
        try {
            const response = await contentCMSService.getProjects(companyID);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch projects');
        }
    }
);

export const fetchBanners = createAsyncThunk(
    'builders/fetchBanners',
    async (companyID: number, { rejectWithValue }) => {
        try {
            const response = await contentCMSService.getBanners(companyID);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch banners');
        }
    }
);

export const fetchServices = createAsyncThunk(
    'builders/fetchServices',
    async (companyID: number, { rejectWithValue }) => {
        try {
            const response = await contentCMSService.getServices(companyID);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch services');
        }
    }
);

export const fetchBlogs = createAsyncThunk(
    'builders/fetchBlogs',
    async (companyID: number, { rejectWithValue }) => {
        try {
            const response = await contentCMSService.getBlogs(companyID);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch blogs');
        }
    }
);

// DELETE THUNKS
export const deleteProject = createAsyncThunk(
    'builders/deleteProject',
    async ({ id, companyID }: { id: number; companyID: number }, { dispatch, rejectWithValue }) => {
        try {
            await contentCMSService.deleteProject(id);
            dispatch(fetchProjects(companyID));
            return 'Project deleted successfully';
        } catch (error) {
            return rejectWithValue('Failed to delete project');
        }
    }
);

export const deleteBanner = createAsyncThunk(
    'builders/deleteBanner',
    async ({ id, companyID }: { id: number; companyID: number }, { dispatch, rejectWithValue }) => {
        try {
            await contentCMSService.deleteBanner(id);
            dispatch(fetchBanners(companyID));
            return 'Banner deleted successfully';
        } catch (error) {
            return rejectWithValue('Failed to delete banner');
        }
    }
);

export const deleteService = createAsyncThunk(
    'builders/deleteService',
    async ({ id, companyID }: { id: number; companyID: number }, { dispatch, rejectWithValue }) => {
        try {
            await contentCMSService.deleteService(id);
            dispatch(fetchServices(companyID));
            return 'Service deleted successfully';
        } catch (error) {
            return rejectWithValue('Failed to delete service');
        }
    }
);

export const deleteBlog = createAsyncThunk(
    'builders/deleteBlog',
    async ({ id, companyID }: { id: number; companyID: number }, { dispatch, rejectWithValue }) => {
        try {
            await contentCMSService.deleteBlog(id);
            dispatch(fetchBlogs(companyID));
            return 'Blog post deleted successfully';
        } catch (error) {
            return rejectWithValue('Failed to delete blog');
        }
    }
);

// UPLOAD / UPDATE THUNKS
export const uploadBuilderProject = createAsyncThunk(
    'banners/uploadProject',
    async ({ data, file }: { data: any; file: File }, { dispatch, rejectWithValue }) => {
        try {
            await uploadBuilderProjectApi({ data, file });
            if (data.companyID) {
                dispatch(fetchProjects(data.companyID));
            }
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
            // Projects
            .addCase(fetchProjects.pending, (state) => { state.loading = true; })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload || [];
            })
            // Individual fetch status handling
            .addCase(fetchBanners.fulfilled, (state, action) => { state.banners = action.payload || []; })
            .addCase(fetchServices.fulfilled, (state, action) => { state.services = action.payload || []; })
            .addCase(fetchBlogs.fulfilled, (state, action) => { state.blogs = action.payload || []; })
            // Upload & Delete Actions
            .addMatcher(
                (action) => action.type.endsWith('/pending') && !action.type.startsWith('builders/fetch'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.successMessage = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled') && !action.type.startsWith('builders/fetch'),
                (state, action) => {
                    state.loading = false;
                    state.successMessage = action.payload as string;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected') && !action.type.startsWith('builders/fetch'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string;
                }
            );
    },
});

export const { clearMessages } = buildersSlice.actions;
export default buildersSlice.reducer;
