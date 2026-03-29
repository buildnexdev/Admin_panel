import axios from 'axios';
import { API_URL } from './api';

export interface CompanyData {
    companyID: number;
    name: string;
    logo?: string;
    address?: string;
    contactno1?: number;
    contactno2?: number;
    contactno3?: number;
    discription: string;
    location: string;
    category: string;
    productType: string;
    website?: string;
    sellingPrice?: string;
    staff?: string; // JSON string
    adminName?: string;
    adminPhone?: number;
    adminLocation?: string;
    adminCategory?: string;
    isActive: number;
}

export const fetchCompanyDetails = async (companyID: number) => {
    const response = await axios.get(`${API_URL}companies/${companyID}`);
    return response.data;
};

export const fetchAllCompanies = async () => {
    const response = await axios.get(`${API_URL}companies`);
    return response.data;
};

export const updateCompanyDetails = async (companyID: number, data: any) => {
    const response = await axios.put(`${API_URL}companies/${companyID}`, data);
    return response.data;
};

export const createCompanyDetails = async (data: any) => {
    const response = await axios.post(`${API_URL}companies`, data);
    return response.data;
};
