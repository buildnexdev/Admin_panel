import axios from 'axios';

import { API_URL } from './api';

export interface TeamMemberData {
    id?: number;
    name: string;
    designation: string;
    bio?: string;
    phoneNumber?: string;
    tags?: string; // Comma separated
    imageUrl?: string;
    companyID: number;
    isActive?: number;
}

export const fetchTeamMembers = async (companyID: number) => {
    // API_URL already has a trailing slash in api.ts
    const response = await axios.get(`${API_URL}content/team-members/${companyID}`);
    return response.data;
};

export const addTeamMember = async (data: any) => {
    const response = await axios.post(`${API_URL}content/team-members`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateTeamMember = async (id: number, data: any) => {
    const response = await axios.put(`${API_URL}content/team-members/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteTeamMember = async (id: number) => {
    const response = await axios.delete(`${API_URL}content/team-members/${id}`);
    return response.data;
};
