import { fetchApi } from './api';

export const bloodRequestApi = {
  async getAll(params?: { city?: string; bloodGroup?: string; status?: string; urgency?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.city) query.append('city', params.city);
    if (params?.bloodGroup) query.append('bloodGroup', params.bloodGroup);
    if (params?.status) query.append('status', params.status);
    if (params?.urgency) query.append('urgency', params.urgency);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return await fetchApi<any[]>(`/blood-requests${qs}`);
  },

  async create(data: {
    requesterId?: string;
    hospitalId?: string;
    patientName?: string;
    patientAge?: number;
    patientGender?: string;
    bloodGroup: string;
    unitsRequired: number;
    urgency?: string;
    hospitalName?: string;
    hospitalAddress?: string;
    city?: string;
    state?: string;
    requiredBy?: string;
    contactPhone?: string;
    notes?: string;
  }): Promise<any> {
    return await fetchApi('/blood-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id: string, status: string, unitsFulfilled?: number): Promise<any> {
    return await fetchApi(`/blood-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, unitsFulfilled }),
    });
  },
};

export default bloodRequestApi;
