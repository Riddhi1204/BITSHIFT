import { fetchApi } from './api';

export interface HospitalApiData {
  id: string;
  name: string;
  registrationNumber?: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  emergencyPhone?: string;
  email?: string;
  verificationStatus: string;
  status?: string;
  bloodBankLinked?: string;
  stock: Record<string, number>;
  totalStock: number;
  inventories?: any[];
  bloodRequests?: any[];
  donations?: any[];
  shortagePredictions?: any[];
}

export const hospitalApi = {
  /**
   * Get all registered hospitals
   */
  async getAll(params?: { city?: string; search?: string }): Promise<HospitalApiData[]> {
    const query = new URLSearchParams();
    if (params?.city) query.append('city', params.city);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return await fetchApi<HospitalApiData[]>(`/hospitals${qs}`);
  },

  /**
   * Get a single hospital by ID or Registration Number
   */
  async getById(id: string): Promise<HospitalApiData> {
    return await fetchApi<HospitalApiData>(`/hospitals/${id}`);
  },

  /**
   * Get hospital dashboard
   */
  async getDashboard(id: string): Promise<{
    hospital: HospitalApiData;
    stock: Record<string, number>;
    totalStock: number;
    requests: any[];
    donations: any[];
    transfers: any[];
    predictions: any[];
  }> {
    return await fetchApi(`/hospitals/${id}/dashboard`);
  },

  /**
   * Update hospital blood inventory stock
   */
  async updateStock(id: string, bloodGroup: string, change: number): Promise<any> {
    return await fetchApi(`/hospitals/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ bloodGroup, change }),
    });
  },

  /**
   * Pledge blood donation directly for a hospital
   */
  async createPledge(id: string, data: {
    donorName: string;
    phone: string;
    bloodGroup: string;
    age?: number;
    gender?: string;
    preferredSlot?: string;
    notes?: string;
  }): Promise<any> {
    return await fetchApi(`/hospitals/${id}/pledge`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export default hospitalApi;
