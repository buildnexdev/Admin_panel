import apiClient from './apiClient';

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
    staff?: string;
    adminName?: string;
    adminPhone?: number;
    adminLocation?: string;
    adminCategory?: string;
    isActive: number;
}

/** Fetch a single company by ID (Bearer via apiClient). */
export const fetchCompanyDetails = async (companyID: number) => {
    const response = await apiClient.get(`companies/${companyID}`);
    return response.data;
};

/** List companies — Super Admin only on backend. */
export const fetchAllCompanies = async () => {
    const response = await apiClient.get('companies');
    return response.data;
};

export const updateCompanyDetails = async (companyID: number, data: any) => {
    const response = await apiClient.put(`companies/${companyID}`, data);
    return response.data;
};

export const createCompanyDetails = async (data: any) => {
    const response = await apiClient.post('companies', data);
    return response.data;
};
