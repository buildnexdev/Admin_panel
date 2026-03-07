import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadBuilderProjectApi, saveBannerPaths, contentCMSService, imageUploadToS3 } from '../../services/api';
import type { RootState } from '../store';

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
    imageUrl: string;
    companyID: number;
    createdAt: string;
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
    async (payload: number | { companyID: number; category?: string }, { getState, rejectWithValue }) => {
        try {
            const companyID = typeof payload === 'number' ? payload : payload.companyID;
            const category = typeof payload === 'object' ? payload.category : undefined;
            const categoryFromUser = category ?? (getState() as RootState).auth.user?.category ?? undefined;
            const response = await contentCMSService.getProjects(companyID, categoryFromUser);
            const data = response?.data ?? response;
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return rejectWithValue('Failed to fetch projects');
        }
    }
);

export const fetchBanners = createAsyncThunk(
    'builders/fetchBanners',
    async ({ companyID, category }: { companyID: number; category?: string }, { getState, rejectWithValue }) => {
        try {
            const { user } = (getState() as RootState).auth;
            const categoryFromLogin = user?.category ?? category;
            const response = await contentCMSService.getBanners(companyID, categoryFromLogin ?? undefined);
            const data = response?.data ?? response;
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return rejectWithValue('Failed to fetch banners');
        }
    }
);

export const fetchServices = createAsyncThunk(
    'builders/fetchServices',
    async (companyID: number, { getState, rejectWithValue }) => {
        try {
            const { user } = (getState() as RootState).auth;
            const category = user?.category ?? undefined;
            const response = await contentCMSService.getServices(companyID, category);
            const data = response?.data ?? response;
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return rejectWithValue('Failed to fetch services');
        }
    }
);

export const fetchBlogs = createAsyncThunk(
    'builders/fetchBlogs',
    async (companyID: number, { getState, rejectWithValue }) => {
        try {
            const { user } = (getState() as RootState).auth;
            const category = user?.category ?? undefined;
            const response = await contentCMSService.getBlogs(companyID, category);
            const data = response?.data ?? response;
            return Array.isArray(data) ? data : [];
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
            dispatch(fetchProjects({ companyID }));
            return 'Project deleted successfully';
        } catch (error) {
            return rejectWithValue('Failed to delete project');
        }
    }
);

export const deleteBanner = createAsyncThunk(
    'builders/deleteBanner',
    async ({ id, companyID, category }: { id: number; companyID: number; category?: string }, { dispatch, rejectWithValue }) => {
        try {
            await contentCMSService.deleteBanner(id);
            dispatch(fetchBanners({ companyID, category }));
            return 'Banner deleted successfully';
        } catch (error) {
            return rejectWithValue('Failed to delete banner');
        }
    }
);

const BANNER_UPLOAD_PATH = 'uploadsA/Company/Company-';
const BANNER_FOLDER = 'Builder/HomeBanner';

export const updateBanner = createAsyncThunk(
    'builders/updateBanner',
    async (
        { id, companyID, category, data, imageFile }: { id: number; companyID: number; category?: string; data: any; imageFile?: File | null },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { user } = (getState() as RootState).auth;
            if (!user) return rejectWithValue('User not authenticated');

            let payload: any = { ...data };

            // If there's an image file, upload it first
            if (imageFile) {
                const uploadPath = `${BANNER_UPLOAD_PATH}${companyID}/${BANNER_FOLDER}`;
                const loginData = { companyID: user.companyID, databaseName: (user as any).databaseName };
                const uploadResult = await imageUploadToS3(imageFile, uploadPath, loginData);
                const imagePath = getImagePathFromUploadResult(uploadResult);
                if (imagePath) {
                    payload.imagePath = imagePath;
                    payload.image = imagePath; // Some endpoints might expect 'image'
                }
            }

            // If data is just a toggle {isActive: boolean}, we enrich it
            if (!(data instanceof FormData) && typeof data === 'object' && Object.keys(data).length === 1 && 'isActive' in data) {
                const formData = new FormData();
                formData.append('isActive', data.isActive ? '1' : '0');
                formData.append('userId', String(user.userId));
                formData.append('category', user.category || category || 'HomeBanner');
                // If an image was uploaded, add it to the FormData as well
                if (payload.imagePath) {
                    formData.append('imagePath', payload.imagePath);
                    formData.append('image', payload.image);
                }
                payload = formData;
            }

            await contentCMSService.updateBanner(id, payload);
            dispatch(fetchBanners({ companyID, category: category || 'HomeBanner' }));
            return 'Banner updated successfully';
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to update banner');
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

const SERVICE_UPLOAD_PATH_PREFIX = 'uploadsA/Company/Company-';
const SERVICE_FOLDER = 'Builder/Services';

export const addService = createAsyncThunk(
    'builders/addService',
    async (
        { name, description, imageFile }: { name: string; description: string; imageFile: File | null },
        { getState, dispatch, rejectWithValue }
    ) => {
        try {
            const { user } = (getState() as RootState).auth;
            if (!user) return rejectWithValue('User not authenticated');
            const userId = user.userId ?? (user as any).id;
            const category = user.category ?? 'builders';
            const companyID = user.companyID;

            let imagePath: string | null = null;
            if (imageFile && companyID != null) {
                const uploadPath = `${SERVICE_UPLOAD_PATH_PREFIX}${companyID}/${SERVICE_FOLDER}`;
                const loginData = { companyID: user.companyID, databaseName: (user as any).databaseName };
                const uploadResult = await imageUploadToS3(imageFile, uploadPath, loginData);
                imagePath = getImagePathFromUploadResult(uploadResult);
            }

            const payload: { name: string; description: string; imagePath?: string; category: string; userId: number; companyID?: number } = {
                name,
                description,
                category,
                userId,
                ...(companyID != null && { companyID })
            };
            if (imagePath) payload.imagePath = imagePath;

            await contentCMSService.addService(payload);
            if (companyID != null) dispatch(fetchServices(companyID));
            return 'Service added successfully';
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to add service');
        }
    }
);

export const updateService = createAsyncThunk(
    'builders/updateService',
    async (
        { id, companyID, data, imageFile }: { id: number; companyID: number; data: any; imageFile?: File | null },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { user } = (getState() as RootState).auth;
            if (!user) return rejectWithValue('User not authenticated');

            let payload = { ...data };

            if (imageFile) {
                const uploadPath = `${SERVICE_UPLOAD_PATH_PREFIX}${companyID}/${SERVICE_FOLDER}`;
                const loginData = { companyID: user.companyID, databaseName: (user as any).databaseName };
                const uploadResult = await imageUploadToS3(imageFile, uploadPath, loginData);
                const imagePath = getImagePathFromUploadResult(uploadResult);
                if (imagePath) {
                    payload.imagePath = imagePath;
                }
            }

            await contentCMSService.updateService(id, payload);
            dispatch(fetchServices(companyID));
            return 'Service updated successfully';
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to update service');
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

const BLOG_UPLOAD_PATH_PREFIX = 'uploadsA/Company/Company-';
const BLOG_FOLDER = 'Builder/Blog';

export const addBlog = createAsyncThunk(
    'builders/addBlog',
    async (
        { title, description, link, imageFile }: { title: string; description: string; link: string; imageFile: File | null },
        { getState, dispatch, rejectWithValue }
    ) => {
        try {
            const { user } = (getState() as RootState).auth;
            if (!user) return rejectWithValue('User not authenticated');
            const userId = user.userId ?? (user as any).id;
            const category = user.category ?? 'Builders';
            const companyID = user.companyID;

            let imagePath: string | null = null;
            if (imageFile && companyID != null) {
                const uploadPath = `${BLOG_UPLOAD_PATH_PREFIX}${companyID}/${BLOG_FOLDER}`;
                const loginData = { companyID: user.companyID, databaseName: (user as any).databaseName };
                const uploadResult = await imageUploadToS3(imageFile, uploadPath, loginData);
                imagePath = getImagePathFromUploadResult(uploadResult);
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', description);
            formData.append('link', link);
            if (imagePath) formData.append('imagePath', imagePath);
            formData.append('userId', String(userId));
            formData.append('category', category);
            if (companyID != null) formData.append('companyID', String(companyID));

            await contentCMSService.addBlog(formData);
            if (companyID != null) dispatch(fetchBlogs(companyID));
            return 'Blog added successfully';
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to add blog');
        }
    }
);

export const updateBlog = createAsyncThunk(
    'builders/updateBlog',
    async (
        { id, companyID, data, imageFile }: { id: number; companyID: number; data: any; imageFile?: File | null },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { user } = (getState() as RootState).auth;
            if (!user) return rejectWithValue('User not authenticated');

            let payload = { ...data };

            if (imageFile) {
                const uploadPath = `${BLOG_UPLOAD_PATH_PREFIX}${companyID}/${BLOG_FOLDER}`;
                const loginData = { companyID: user.companyID, databaseName: (user as any).databaseName };
                const uploadResult = await imageUploadToS3(imageFile, uploadPath, loginData);
                const imagePath = getImagePathFromUploadResult(uploadResult);
                if (imagePath) {
                    payload.imagePath = imagePath;
                }
            }

            await contentCMSService.updateBlog(id, payload);
            dispatch(fetchBlogs(companyID));
            return 'Blog updated successfully';
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to update blog');
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
                dispatch(fetchProjects({ companyID: data.companyID }));
            }
            return 'Project uploaded successfully';
        } catch (error) {
            return rejectWithValue('Failed to upload project');
        }
    }
);



function getImagePathFromUploadResult(res: any): string | null {
    if (!res || res === 'Image Upload Failed') return null;
    if (typeof res === 'string') return res;
    return (res && typeof res === 'object' && res.fileName) ? res.fileName : null;
}

/** Add one banner: 1) upload image to server, 2) then call POST /banners */
export const addSingleBanner = createAsyncThunk(
    'builders/addSingleBanner',
    async (
        { file, companyID }: { file: File; companyID: number },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { user } = (getState() as RootState).auth;
            if (!user) return rejectWithValue('User not authenticated');
            const categoryFromLogin = user.category ?? 'HomeBanner';

            const uploadPath = `${BANNER_UPLOAD_PATH}${companyID}/${BANNER_FOLDER}`;
            const loginData = { companyID: user.companyID, databaseName: (user as any).databaseName };
            const uploadResult = await imageUploadToS3(file, uploadPath, loginData);
            const imagePath = getImagePathFromUploadResult(uploadResult);

            const formData = new FormData();
            if (imagePath) {
                formData.append('imagePath', imagePath);
            } else {
                formData.append('image', file);
            }
            formData.append('userId', String(user.userId));
            formData.append('category', categoryFromLogin);
            formData.append('companyID', String(companyID));

            await contentCMSService.addBanner(formData);
            dispatch(fetchBanners({ companyID, category: categoryFromLogin }));
            return 'Banner added successfully';
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to add banner');
        }
    }
);

const PROJECT_UPLOAD_PATH_PREFIX = 'uploadsA/Company/Company-';
const PROJECT_FOLDER = 'Builder/Projects';

/** Add one project (banner-style): upload image then POST /content/projects with category, title, imagePath */
export const addSingleProject = createAsyncThunk(
    'builders/addSingleProject',
    async (
        { category, title, file, companyID }: { category: string; title: string; file: File; companyID: number },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { user } = (getState() as RootState).auth;
            if (!user) return rejectWithValue('User not authenticated');
            const userId = user.userId ?? (user as any).id;

            const uploadPath = `${PROJECT_UPLOAD_PATH_PREFIX}${companyID}/${PROJECT_FOLDER}`;
            const loginData = { companyID: user.companyID, databaseName: (user as any).databaseName };
            const uploadResult = await imageUploadToS3(file, uploadPath, loginData);
            const imagePath = getImagePathFromUploadResult(uploadResult);

            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            if (imagePath) formData.append('imagePath', imagePath);
            else formData.append('image', file);
            formData.append('userId', String(userId));
            formData.append('companyID', String(companyID));

            await contentCMSService.addProject(formData);
            dispatch(fetchProjects({ companyID }));
            return 'Project added successfully';
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to add project');
        }
    }
);

export const updateProject = createAsyncThunk(
    'builders/updateProject',
    async (
        { id, companyID, data, imageFile }: { id: number; companyID: number; data: any; imageFile?: File | null },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { user } = (getState() as RootState).auth;
            if (!user) return rejectWithValue('User not authenticated');

            let payload = { ...data };

            if (imageFile) {
                const uploadPath = `${PROJECT_UPLOAD_PATH_PREFIX}${companyID}/${PROJECT_FOLDER}`;
                const loginData = { companyID: user.companyID, databaseName: (user as any).databaseName };
                const uploadResult = await imageUploadToS3(imageFile, uploadPath, loginData);
                const imagePath = getImagePathFromUploadResult(uploadResult);
                if (imagePath) {
                    payload.imagePath = imagePath;
                }
            }

            await contentCMSService.updateProject(id, payload);
            dispatch(fetchProjects({ companyID }));
            return 'Project updated successfully';
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to update project');
        }
    }
);

export const uploadHomeBanners = createAsyncThunk<
    string,
    { fileNames: string[]; companyID: number; userID: number; category?: string },
    { rejectValue: string }
>(
    'banners/uploadAndSaveBanners',
    async ({ fileNames, companyID, userID, category }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { user } = (getState() as RootState).auth;
            if (!user) return rejectWithValue('User not authenticated');
            const categoryFromLogin = user.category ?? category ?? 'HomeBanner';

            await saveBannerPaths({
                bannerPaths: fileNames,
                companyID,
                userId: userID,
                category: categoryFromLogin
            });
            dispatch(fetchBanners({ companyID, category: categoryFromLogin }));
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
                (action) => (action.type.startsWith('builders/') || action.type.startsWith('banners/')) &&
                    action.type.endsWith('/pending') &&
                    !action.type.includes('/fetch'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.successMessage = null;
                }
            )
            .addMatcher(
                (action: { type: string; payload?: unknown }) => (action.type.startsWith('builders/') || action.type.startsWith('banners/')) &&
                    action.type.endsWith('/fulfilled') &&
                    !action.type.includes('/fetch'),
                (state, action: { payload?: unknown }) => {
                    state.loading = false;
                    state.successMessage = typeof action.payload === 'string' ? action.payload : null;
                }
            )
            .addMatcher(
                (action: { type: string; payload?: unknown }) => (action.type.startsWith('builders/') || action.type.startsWith('banners/')) &&
                    action.type.endsWith('/rejected') &&
                    !action.type.includes('/fetch'),
                (state, action: { payload?: unknown }) => {
                    state.loading = false;
                    state.error = typeof action.payload === 'string' ? action.payload : 'An error occurred';
                }
            );
    },
});

export const { clearMessages } = buildersSlice.actions;
export default buildersSlice.reducer;
