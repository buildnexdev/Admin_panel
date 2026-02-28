import axios from 'axios';
export const API_URL = 'http://localhost:3000/';
export const Img_Url = 'https://s3.eu-north-1.amazonaws.com/buildnex-dev-bucket/';
// User login Service
export const UserloginService = {
    login: async (credentials: { phone: string; password: string }) => {
        const response = await axios.post(API_URL + 'users/login', credentials, { timeout: 15000 });
        return response.data;
    },
    logout: async () => {
        return Promise.resolve(true);
    }
};

export const schoolService = {
    uploadContent: async (data: any) => {
        const response = await axios.post(API_URL + 'school/upload-content', data); return response.data;
    },
    uploadImage: async (file: File, caption: string) => {
        const response = await axios.post(API_URL + 'school/upload-image', { file, caption }); return response.data;
    }
};

export const photoService = {
    uploadGalleryItem: async (file: File, category: string) => {
        const response = await axios.post(API_URL + 'photo/upload-gallery-item', { file, category }); return response.data;
    }
};

export const buildersService = {
    uploadProject: async (data: any, file: File) => {
        const response = await axios.post(API_URL + 'builders/upload-project', { data, file }); return response.data;
    },
    uploadHomeBanners: async (userId: number, companyId: number, files: File[]) => {
        const response = await axios.post(API_URL + 'builders/upload-home-banners', { userId, companyId, files }); return response.data;
    }
}

export const homePageImageUpload = async (userId: number, companyId: number, category: string, file: File) => {
    const response = await axios.post(API_URL + 'home-page/upload-image', {
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
            const result = await axios.post(`${API_URL}home-page/upload-image`, imageData, {
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
            const result = await axios.post(`${API_URL}home-page/upload-image`, payload);
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

        const result = await axios.post(`${API_URL}builders/upload-project`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return result.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to upload builder project');
    }
}

export const contentCMSService = {
    // Projects
    addProject: async (formData: FormData) => {
        const response = await axios.post(`${API_URL}content/projects`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getProjects: async (companyID: number) => {
        const response = await axios.get(`${API_URL}content/projects/${companyID}`);
        return response.data;
    },
    updateProject: async (id: number, formData: FormData) => {
        const response = await axios.put(`${API_URL}content/projects/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    deleteProject: async (id: number) => {
        const response = await axios.delete(`${API_URL}content/projects/${id}`);
        return response.data;
    },

    // Banners
    addBanner: async (formData: FormData) => {
        const response = await axios.post(`${API_URL}content/banners`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getBanners: async (companyID: number, category?: string) => {
        const url = category ? `${API_URL}content/banners/${companyID}?category=${category}` : `${API_URL}content/banners/${companyID}`;
        const response = await axios.get(url);
        return response.data;
    },
    updateBanner: async (id: number, formData: FormData) => {
        const response = await axios.put(`${API_URL}content/banners/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    deleteBanner: async (id: number) => {
        const response = await axios.delete(`${API_URL}content/banners/${id}`);
        return response.data;
    },

    // Services
    addService: async (data: any) => {
        const response = await axios.post(`${API_URL}content/services`, data);
        return response.data;
    },
    getServices: async (companyID: number) => {
        const response = await axios.get(`${API_URL}content/services/${companyID}`);
        return response.data;
    },
    updateService: async (id: number, data: any) => {
        const response = await axios.put(`${API_URL}content/services/${id}`, data);
        return response.data;
    },
    deleteService: async (id: number) => {
        const response = await axios.delete(`${API_URL}content/services/${id}`);
        return response.data;
    },

    // Blogs
    addBlog: async (formData: FormData) => {
        const response = await axios.post(`${API_URL}content/blogs`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getBlogs: async (companyID: number) => {
        const response = await axios.get(`${API_URL}content/blogs/${companyID}`);
        return response.data;
    },
    updateBlog: async (id: number, formData: FormData) => {
        const response = await axios.put(`${API_URL}content/blogs/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    deleteBlog: async (id: number) => {
        const response = await axios.delete(`${API_URL}content/blogs/${id}`);
        return response.data;
    },

    addContact: async (data: any) => {
        const response = await axios.post(`${API_URL}content/contact`, data);
        return response.data;
    },
    getContactMessages: async (companyID: number) => {
        const response = await axios.get(`${API_URL}content/contact/${companyID}`);
        return response.data;
    }
};

// IMAGE UPLOAD TO SERVER
// Upload multiple banners and save to tblBannerImg
export const uploadBannersToTable = async (formData: FormData) => {
    try {
        const response = await axios.post(`${API_URL}banners/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to upload and save banners');
    }
};

// Save banner paths to tblBannerImg
export const saveBannerPaths = async (data: { bannerPaths: string[]; companyID: number; userId: number; category?: string }) => {
    try {
        const response = await axios.post(`${API_URL}banners/save-paths`, data);
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
