import { fetchApi } from './api';

export interface BloodBankApiData {
  id: string;
  name: string;
  registrationNumber?: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  operatingHours?: string;
  verificationStatus: string;
  status?: string;
  emergencyContact?: string;
  lastUpdated?: string;
  inventory: Record<string, number>;
  totalUnits: number;
  verified: boolean;
  donations?: any[];
  donationCampaigns?: any[];
}

export const bloodBankApi = {
  /**
   * Get all registered blood banks
   */
  async getAll(params?: { city?: string; search?: string; verified?: boolean }): Promise<BloodBankApiData[]> {
    const query = new URLSearchParams();
    if (params?.city) query.append('city', params.city);
    if (params?.search) query.append('search', params.search);
    if (params?.verified !== undefined) query.append('verified', String(params.verified));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return await fetchApi<BloodBankApiData[]>(`/blood-banks${qs}`);
  },

  /**
   * Get single blood bank by ID
   */
  async getById(id: string): Promise<BloodBankApiData> {
    return await fetchApi<BloodBankApiData>(`/blood-banks/${id}`);
  },

  /**
   * Get blood bank dashboard
   */
  async getDashboard(id: string): Promise<{
    bloodBank: BloodBankApiData;
    inventory: Record<string, number>;
    totalUnits: number;
    batches: any[];
    donations: any[];
    campaigns: any[];
  }> {
    return await fetchApi(`/blood-banks/${id}/dashboard`);
  },

  /**
   * Update blood bank inventory units
   */
  async updateInventory(
    id: string,
    optionsOrGroup:
      | {
          bloodGroup?: string;
          group?: string;
          units?: number;
          quantity?: number;
          operation?: string;
          component?: string;
          reason?: string;
        }
      | string,
    unitsParam?: number,
    componentParam?: string
  ): Promise<any> {
    let payload: any = {};
    if (typeof optionsOrGroup === 'object') {
      const units = optionsOrGroup.units ?? optionsOrGroup.quantity ?? 0;
      const bloodGroup = optionsOrGroup.bloodGroup || optionsOrGroup.group || 'O+';
      const change = optionsOrGroup.operation === 'remove' ? -Math.abs(units) : units;
      payload = {
        bloodGroup,
        units: change,
        component: optionsOrGroup.component || 'whole_blood',
        reason: optionsOrGroup.reason,
      };
    } else {
      payload = {
        bloodGroup: optionsOrGroup,
        units: unitsParam,
        component: componentParam || 'whole_blood',
      };
    }

    return await fetchApi(`/blood-banks/${id}/inventory`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};

export default bloodBankApi;
