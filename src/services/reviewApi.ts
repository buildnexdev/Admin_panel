import apiClient from './apiClient';

export interface ReviewData {
    id?: number;
    reviewerName: string;
    rating: number;
    reviewText: string;
    socialLink?: string;
    isActive?: number;
    companyID?: number;
    userId?: number;
}

/** List reviews (authenticated; company scoped on backend). */
export const getReviewsList = async (params?: { companyID?: number; userId?: number }) => {
    const response = await apiClient.get('content/reviews', { params: params ?? {} });
    const data = response?.data?.data ?? response?.data;
    return Array.isArray(data) ? data : [];
};

export const createReview = async (payload: ReviewData) => {
    const response = await apiClient.post('content/reviews', payload);
    return response.data;
};

export const updateReviewApi = async (id: number, payload: Partial<ReviewData>) => {
    const response = await apiClient.put(`content/reviews/${id}`, payload);
    return response.data;
};

export const deleteReviewApi = async (id: number) => {
    const response = await apiClient.delete(`content/reviews/${id}`);
    return response.data;
};
