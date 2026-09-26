/**
 * Centralized Axios client — attaches Bearer token, normalizes errors, 401 redirect.
 */
import axios from 'axios';

export const API_URL =
    import.meta.env.VITE_API_URL ||
    (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
        ? 'http://localhost:3000/'
        : 'https://api.buildnexdev.in/');
export const Img_Url = import.meta.env.VITE_IMG_URL || 'https://s3.eu-north-1.amazonaws.com/buildnex-dev-bucket/';

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            const isLogin = error.config?.url?.includes('users/login');
            if (!isLogin) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                if (!window.location.pathname.includes('login') && !window.location.pathname.includes('quotation')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;

export function getAuthUser<T = any>(): T | null {
    try {
        const raw = localStorage.getItem('auth_user');
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}
