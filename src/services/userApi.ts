import axios from 'axios';
import { API_URL } from './api';

export interface StaffData {
    userId: number;
    name: string;
    role: string;
    phoneNumber: string;
}

export const fetchStaffList = async () => {
    const response = await axios.get(`${API_URL}users/staff`);
    return response.data;
};
