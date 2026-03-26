import axios from 'axios';
import { API_URL } from './api';

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

// ─── Google Reviews API ────────────────────────────────────────────────────────

/** List all reviews for company */
export const getReviewsList = async (params?: { companyID?: number; userId?: number }) => {
    const response = await axios.get(`${API_URL}content/reviews`, { params: params ?? {} });
    const data = response?.data?.data ?? response?.data;
    return Array.isArray(data) ? data : [];
};

/** Create a review */
export const createReview = async (payload: ReviewData) => {
    const response = await axios.post(`${API_URL}content/reviews`, payload);
    return response.data;
};

/** Update a review by id */
export const updateReviewApi = async (id: number, payload: Partial<ReviewData>) => {
    const response = await axios.put(`${API_URL}content/reviews/${id}`, payload);
    return response.data;
};

/** Delete a review by id */
export const deleteReviewApi = async (id: number) => {
    const response = await axios.delete(`${API_URL}content/reviews/${id}`);
    return response.data;
};
