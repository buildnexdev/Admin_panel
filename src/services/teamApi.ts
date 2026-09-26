import apiClient from './apiClient';

export interface TeamMemberData {
    id?: number;
    name: string;
    designation: string;
    bio?: string;
    phoneNumber?: string;
    tags?: string;
    imageUrl?: string;
    companyID: number;
    isActive?: number;
}

/** List team members for a company. */
export const fetchTeamMembers = async (companyID: number) => {
    const response = await apiClient.get(`content/team-members/${companyID}`);
    return response.data;
};

export const addTeamMember = async (data: any) => {
    const response = await apiClient.post('content/team-members', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateTeamMember = async (id: number, data: any) => {
    const response = await apiClient.put(`content/team-members/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteTeamMember = async (id: number) => {
    const response = await apiClient.delete(`content/team-members/${id}`);
    return response.data;
};
