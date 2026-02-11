import axios from 'axios';

// Create an Axios instance (for future API integration)
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Placeholder for local database
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mock Service for now
export const authService = {
    login: async (credentials: any) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    user: { id: 1, name: 'Admin', email: credentials.email },
                    token: 'mock-jwt-token',
                });
            }, 1000); // 1-second delay
        });
    },
    logout: async () => {
        return new Promise((resolve) => resolve(true));
    }
};

export const schoolService = {
    uploadContent: async (data: any) => {
        console.log('Uploading School Content:', data);
        return new Promise((resolve) => setTimeout(() => resolve({ success: true, id: Date.now() }), 1000));
    },
    uploadImage: async (file: File, caption: string) => {
        console.log('Uploading School Image:', file.name, caption);
        return new Promise((resolve) => setTimeout(() => resolve({ success: true, url: URL.createObjectURL(file) }), 1000));
    }
};

export const photoService = {
    uploadGalleryItem: async (file: File, category: string, title: string) => {
        console.log('Uploading Photo Gallery:', file.name, category);
        return new Promise((resolve) => setTimeout(() => resolve({ success: true, url: URL.createObjectURL(file) }), 1000));
    }
};

export const buildersService = {
    uploadProject: async (data: any, file: File) => {
        console.log('Uploading Builder Project:', data, file.name);
        return new Promise((resolve) => setTimeout(() => resolve({ success: true, id: Date.now(), imageUrl: URL.createObjectURL(file) }), 1000));
    }
}

export default api;
