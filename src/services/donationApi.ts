import { fetchApi } from './api';

export const donationApi = {
  async getAll(params?: { donorId?: string; hospitalId?: string; bloodBankId?: string; status?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.donorId) query.append('donorId', params.donorId);
    if (params?.hospitalId) query.append('hospitalId', params.hospitalId);
    if (params?.bloodBankId) query.append('bloodBankId', params.bloodBankId);
    if (params?.status) query.append('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return await fetchApi<any[]>(`/donations${qs}`);
  },

  async create(data: {
    donorId?: string;
    donorName?: string;
    hospitalId?: string;
    bloodBankId?: string;
    bloodGroup: string;
    units?: number;
    donationDate?: string;
    notes?: string;
    status?: string;
  }): Promise<any> {
    return await fetchApi('/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id: string, status: string, notes?: string): Promise<any> {
    return await fetchApi(`/donations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },
};

export default donationApi;
