import axios from 'axios';
import apiClient, { API_URL as CLIENT_API_URL, Img_Url as CLIENT_IMG_URL } from './apiClient';

export const API_URL = CLIENT_API_URL;
export const Img_Url = CLIENT_IMG_URL;

// User login Service
export const UserloginService = {
    login: async (credentials: { phone: string; password: string }) => {
        const response = await apiClient.post('users/login', credentials, { timeout: 15000 });
        return response.data;
    },
    logout: async () => {
        return Promise.resolve(true);
    },
    me: async () => {
        const response = await apiClient.get('users/me');
        return response.data;
    },
    changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
        const response = await apiClient.post('users/change-password', payload);
        return response.data;
    },
};

// SCHOOL SERVICE
export const schoolService = {
    uploadContent: async (data: any) => {
        const response = await apiClient.post('school/upload-content', data); return response.data;
    },
    uploadImage: async (file: File, caption: string) => {
        const response = await apiClient.post('school/upload-image', { file, caption }); return response.data;
    }
};

// PHOTO SERVICE
export const photoService = {
    uploadGalleryItem: async (file: File, category: string) => {
        const response = await apiClient.post('photo/upload-gallery-item', { file, category }); return response.data;
    }
};

// BUILDERS SERVICE
export const buildersService = {
    uploadProject: async (data: any, file: File) => {
        const response = await apiClient.post('builders/upload-project', { data, file }); return response.data;
    },
    uploadHomeBanners: async (userId: number, companyId: number, files: File[]) => {
        const response = await apiClient.post('builders/upload-home-banners', { userId, companyId, files }); return response.data;
    }
}

// HOME PAGE IMAGE UPLOAD SERVICE
export const homePageImageUpload = async (userId: number, companyId: number, category: string, file: File) => {
    const response = await apiClient.post('home-page/upload-image', {
        file,
        imageName: file.name,
        userId,
        companyId,
        category
    });
    return response.data;
}

// Helper function to get userId from localStorage
const getUserId = (): number | null => {
    const authUser = localStorage.getItem('auth_user');
    if (!authUser) return null;
    try {
        const user = JSON.parse(authUser);
        return user?.userId || null;
    } catch {
        return null;
    }
};

// Helper function to handle missing userId
const handleMissingUserId = () => {
    // Clear auth data if userId is missing
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    throw new Error('User ID is required. Please login again.');
};

// Upload home image - similar to addToCart pattern
export const uploadHomeImage = async (imageData: FormData | { file?: File; imageName?: string; category?: string; companyId?: number;[key: string]: any }) => {
    try {
        const userId = getUserId();
        if (!userId) {
            handleMissingUserId();
            throw new Error('User ID is required. Please login again.');
        }

        // Check if imageData is FormData (contains files) or regular object
        if (imageData instanceof FormData) {
            // FormData - append userId and send with multipart/form-data
            imageData.append('userId', userId.toString());
            const result = await apiClient.post(`home-page/upload-image`, imageData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return result.data;
        } else {
            // Regular JSON payload
            const payload = {
                ...imageData,
                userId: userId
            };
            const result = await apiClient.post(`home-page/upload-image`, payload);
            return result.data;
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to upload home image');
    }
}

// Upload builders project - always as multipart/form-data with user/company context
export const uploadBuilderProjectApi = async (projectData: { data: any; file: File }) => {
    try {
        const authUserRaw = localStorage.getItem('auth_user');
        if (!authUserRaw) {
            handleMissingUserId();
            throw new Error('User ID is required. Please login again.');
        }

        let authUser: any;
        try {
            authUser = JSON.parse(authUserRaw);
        } catch {
            handleMissingUserId();
            throw new Error('User ID is required. Please login again.');
        }

        const userId = authUser?.userId;
        if (!userId) {
            handleMissingUserId();
            throw new Error('User ID is required. Please login again.');
        }

        const formData = new FormData();
        const { data, file } = projectData;

        // Flatten project data fields into FormData (title, description, location, etc.)
        if (data && typeof data === 'object') {
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });
        }

        // Append file
        if (file) {
            formData.append('file', file);
        }

        // Append user context
        formData.append('userId', userId.toString());
        if (authUser.companyID) {
            formData.append('companyId', authUser.companyID.toString());
        }
        if (authUser.category) {
            formData.append('category', authUser.category);
        }

        const result = await apiClient.post(`builders/upload-project`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return result.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to upload builder project');
    }
}

/** Get all categories (for project gallery etc.). Expects array in res.data or res.data.data or res. */
export const getCategories = async () => {
    const response = await apiClient.get(`category`);
    const raw = response?.data?.data ?? response?.data ?? response;
    return Array.isArray(raw) ? raw : [];
};

export const contentCMSService = {
    // Projects
    addProject: async (formData: FormData) => {
        const response = await apiClient.post(`content/projects`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getProjects: async (companyID: number, category?: string) => {
        const url = category ? `content/projects/${companyID}?category=${encodeURIComponent(category)}` : `content/projects/${companyID}`;
        const response = await apiClient.get(url);
        return response.data;
    },
    updateProject: async (id: number, data: FormData | Record<string, unknown>) => {
        if (data instanceof FormData) {
            const response = await apiClient.put(`content/projects/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        }
        const response = await apiClient.put(`content/projects/${id}`, data);
        return response.data;
    },
    deleteProject: async (id: number) => {
        const response = await apiClient.delete(`content/projects/${id}`);
        return response.data;
    },

    // Banners - add uses POST /banners; get/update/delete use /content/banners
    addBanner: async (formData: FormData) => {
        const response = await apiClient.post(`content/banners`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getBanners: async (companyID: number, category?: string) => {
        const url = category ? `content/banners/${companyID}?category=${category}` : `content/banners/${companyID}`;
        const response = await apiClient.get(url);
        return response.data;
    },
    updateBanner: async (id: number, data: FormData | Record<string, unknown>) => {
        if (data instanceof FormData) {
            const response = await apiClient.put(`content/banners/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        }
        const response = await apiClient.put(`content/banners/${id}`, data);
        return response.data;
    },
    deleteBanner: async (id: number) => {
        const response = await apiClient.delete(`content/banners/${id}`);
        return response.data;
    },

    // Services - add with payload: name, description, photo, category, userId (FormData or JSON)
    addService: async (data: FormData | { name?: string; title?: string; description?: string; imagePath?: string; category: string; userId: number; companyID?: number }) => {
        if (data instanceof FormData) {
            const response = await apiClient.post(`content/services`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        }
        const response = await apiClient.post(`content/services`, data);
        return response.data;
    },
    getServices: async (companyID: number, category?: string) => {
        const url = category ? `content/services/${companyID}?category=${encodeURIComponent(category)}` : `content/services/${companyID}`;
        const response = await apiClient.get(url);
        return response.data;
    },
    updateService: async (id: number, data: any) => {
        const response = await apiClient.put(`content/services/${id}`, data);
        return response.data;
    },
    deleteService: async (id: number) => {
        const response = await apiClient.delete(`content/services/${id}`);
        return response.data;
    },

    // Blogs
    addBlog: async (formData: FormData) => {
        const response = await apiClient.post(`content/blogs`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getBlogs: async (companyID: number, category?: string) => {
        const url = category ? `content/blogs/${companyID}?category=${encodeURIComponent(category)}` : `content/blogs/${companyID}`;
        const response = await apiClient.get(url);
        return response.data;
    },
    updateBlog: async (id: number, data: FormData | Record<string, unknown>) => {
        if (data instanceof FormData) {
            const response = await apiClient.put(`content/blogs/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        }
        const response = await apiClient.put(`content/blogs/${id}`, data);
        return response.data;
    },
    deleteBlog: async (id: number) => {
        const response = await apiClient.delete(`content/blogs/${id}`);
        return response.data;
    },

    addContact: async (data: any) => {
        const response = await apiClient.post(`content/contact`, data);
        return response.data;
    },
    getContactMessages: async (companyID: number) => {
        const response = await apiClient.get(`content/contact/${companyID}`);
        return response.data;
    }
};

// IMAGE UPLOAD TO SERVER
// Upload multiple banners and save to tblBannerImg
export const uploadBannersToTable = async (formData: FormData) => {
    try {
        const response = await apiClient.post(`banners/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to upload and save banners');
    }
};

// Save banner paths to tblBannerImg (pass category and userId in payload)
export const saveBannerPaths = async (data: { bannerPaths: string[]; companyID: number; userId: number; category: string }) => {
    try {
        const response = await apiClient.post(`banners/save-paths`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to save banner paths');
    }
};

export const imageUploadToS3 = async (result: any, path: any, loginData: any, fileType?: any) => {
    const { companyID, databaseName } = loginData || {};
    const formData = new FormData();
    formData.append('photoimg', result);
    formData.append('typeval', path);
    if (companyID) formData.append('companyID', companyID);
    if (databaseName) formData.append('databaseName', databaseName);
    formData.append('fileFormat', fileType ? fileType : 'Image');

    const response = await fetch(`${API_URL}uploadImageToServer`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        console.error('Server returned an error:', response.status, response.statusText);
        return null;
    } else {
        const responseJson = await response.json();
        if (responseJson.status === 'Success' || responseJson.status === true) {
            return responseJson.response || responseJson;
        } else if ('error_message' in responseJson || responseJson.status === false) {
            return 'Image Upload Failed';
        }
    }
    return null;
};

export const fetchQuotationByToken = async (token: string) => {
    const response = await apiClient.get(`quotation/${token}`);
    const raw = response?.data;
    const data = raw?.data ?? raw?.response ?? raw?.quotation ?? raw;
    if (data && typeof data === "object") {
        return {
            client_name: data.client_name ?? data.clientName ?? "",
            project_details: data.project_details ?? data.projectDetails ?? "",
            price: data.price ?? 0,
            token: data.token ?? data.id ?? token,
            company_name: data.company_name ?? data.companyName ?? "",
        };
    }
    return raw;
};

/** List all quotations for the current user (optional userId, category). Expects array in res.data or res.data.data */
export const getQuotationList = async (params?: { userId?: number; category?: string | null }) => {
    const response = await apiClient.get(`quotation`, { params: params ?? {} });
    const data = response?.data?.data ?? response?.data;
    return Array.isArray(data) ? data : [];
};

export const createQuotation = async (data: {
    client_name: string;
    project_details: string;
    price: number;
    companyID?: number;
    userId?: number;
    category?: string | null;
    company_name?: string | null;
}) => {
    const response = await apiClient.post(`quotation`, data);
    return response.data;
};

/** Call when client opens the quotation link – backend should increment view/click count */
export const recordQuotationView = async (token: string) => {
    try {
        await apiClient.post(`quotation/${token}/view`, {});
        return true;
    } catch {
        return false;
    }
};

/** Get view/click count for a quotation. Tries /stats first, then GET quotation (view_count in body). */
export const getQuotationViewCount = async (token: string): Promise<number> => {
    try {
        const res = await apiClient.get(`quotation/${token}/stats`);
        const count = res?.data?.view_count ?? res?.data?.viewCount ?? res?.data?.clicks ?? 0;
        return Number(count);
    } catch {
        try {
            const res = await apiClient.get(`quotation/${token}`);
            const data = res?.data?.data ?? res?.data;
            const count = data?.view_count ?? data?.viewCount ?? data?.clicks ?? 0;
            return Number(count);
        } catch {
            return 0;
        }
    }
};

export const updateQuotation = async (token: string, data: { client_name?: string; project_details?: string; price?: number }) => {
    const response = await apiClient.put(`quotation/${token}`, data);
    return response.data;
};

export const deleteQuotation = async (token: string) => {
    const response = await apiClient.delete(`quotation/${token}`);
    return response.data;
};

// ─── SRS Images ─────────────────────────────────────────────────────────────
/** List SRS images for company. Expects array in res.data or res.data.data */
export const getSrsImagesList = async (params?: { companyID?: number; userId?: number }) => {
    const response = await apiClient.get(`srs-images`, { params: params ?? {} });
    const data = response?.data?.data ?? response?.data;
    return Array.isArray(data) ? data : [];
};

/** Create one SRS images record. Backend receives array of image URLs (upload to S3 first, one by one). Sends description as `disc`. */
export const createSrsImages = async (payload: {
    title: string;
    description?: string;
    disc?: string;
    location?: string;
    images: string[];
    companyID?: number;
    userId?: number;
}) => {
    const body = {
        title: payload.title,
        disc: payload.disc ?? payload.description,
        location: payload.location,
        images: payload.images,
        companyID: payload.companyID,
        userId: payload.userId,
    };
    const response = await apiClient.post(`srs-images`, body);
    return response.data;
};

/** Update SRS image record by id */
export const updateSrsImage = async (
    id: number,
    payload: { title?: string; disc?: string; description?: string; location?: string; imageUrl?: string; images?: string[] }
) => {
    const body: Record<string, unknown> = { ...payload };
    if (payload.description !== undefined && payload.disc === undefined) body.disc = payload.description;
    if (body.description !== undefined) delete body.description;
    const response = await apiClient.put(`srs-images/${id}`, body);
    return response.data;
};

/** Delete SRS image record by id */
export const deleteSrsImage = async (id: number) => {
    const response = await apiClient.delete(`srs-images/${id}`);
    return response.data;
};
