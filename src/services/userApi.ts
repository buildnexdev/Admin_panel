import apiClient from './apiClient';

export interface StaffData {
    userId: number;
    name: string;
    role: string;
    phoneNumber: string;
}

/** Fetch staff for the authenticated user's company. */
export const fetchStaffList = async () => {
    const response = await apiClient.get('users/staff');
    return response.data;
};
