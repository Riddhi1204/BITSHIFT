import { fetchApi } from './api';

export const governmentApi = {
  /**
   * Get National & State Government Dashboard metrics
   */
  async getDashboard(): Promise<{
    stats: {
      totalHospitals: number;
      verifiedHospitals: number;
      pendingHospitals: number;
      totalBloodBanks: number;
      verifiedBloodBanks: number;
      totalDonations: number;
      activeRequests: number;
      urgentRequests: number;
      totalUnitsAvailable: number;
    };
    inventoryByGroup: Record<string, number>;
    shortagePredictions: any[];
    recentDonations: any[];
    verificationRequests: any[];
    regions: any[];
  }> {
    return await fetchApi('/government/dashboard');
  },

  /**
   * Get hospital verification requests
   */
  async getVerifications(): Promise<any[]> {
    return await fetchApi<any[]>('/government/verifications');
  },

  /**
   * Update hospital verification request (approve / reject)
   */
  async updateVerification(
    id: string,
    options: {
      status: 'approved' | 'rejected' | 'under_review' | 'resubmission_required';
      reviewNotes?: string;
      reviewerName?: string;
    } | 'approved' | 'rejected' | 'under_review' | 'resubmission_required',
    reviewNotes?: string
  ): Promise<any> {
    const payload = typeof options === 'string' ? { status: options, reviewNotes } : options;
    return await fetchApi(`/government/verifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get hotspots data
   */
  async getHotspots(): Promise<{
    urgentRequests: any[];
    highRiskPredictions: any[];
  }> {
    return await fetchApi('/government/hotspots');
  },

  /**
   * Get regional blood supply breakdown
   */
  async getSupply(): Promise<any[]> {
    return await fetchApi<any[]>('/government/supply');
  },
};

export default governmentApi;
