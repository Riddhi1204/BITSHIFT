import { fetchApi } from './api';

export const citizenApi = {
  /**
   * Get citizen dashboard information
   */
  async getDashboard(userId: string = 'c-001'): Promise<{
    user: any;
    citizenProfile: any;
    donations: any[];
    totalDonations: number;
    badges: any[];
    bloodRequests: any[];
    notifications: any[];
    donorMatches: any[];
    eligibility: {
      isEligible: boolean;
      nextEligibleDate: string;
      lastDonationDate: string | null;
    };
    stats?: {
      donated: number;
      received: number;
      hospitalsNearby: number;
      activeRequests: number;
    };
    donationProgress?: {
      total: number;
      lastDonated: string;
      nextEligible: string;
      streak: number;
    };
    nearbyHospitals?: any[];
  }> {
    return await fetchApi(`/citizens/${userId}/dashboard`);
  },

  /**
   * Update citizen profile
   */
  async updateProfile(userId: string, data: any): Promise<any> {
    return await fetchApi(`/citizens/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Search nearby blood availability
   */
  async searchNearby(bloodGroupOrParams: string | { bloodGroup?: string; city?: string }, cityParam?: string): Promise<any[]> {
    let bloodGroup = 'O+';
    let city = '';

    if (typeof bloodGroupOrParams === 'object') {
      bloodGroup = bloodGroupOrParams.bloodGroup || 'O+';
      city = bloodGroupOrParams.city || '';
    } else {
      bloodGroup = bloodGroupOrParams;
      city = cityParam || '';
    }

    const query = new URLSearchParams({ bloodGroup });
    if (city && city !== 'All') query.append('city', city);
    return await fetchApi<any[]>(`/citizens/search?${query.toString()}`);
  },
};

export default citizenApi;
