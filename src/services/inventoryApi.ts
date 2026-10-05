import { fetchApi } from './api';

export interface ExpiryBatchItem {
  id: string;
  batchNumber: string;
  bloodGroup: string;
  component: string;
  units: number;
  collectionDate?: string;
  expiryDate: string;
  rawStatus?: string;
  calculatedStatus: 'SAFE' | 'EXPIRING_SOON' | 'EXPIRED' | 'WASTED' | 'USED';
  daysRemaining: number;
  badgeColor: string;
  organizationName: string;
  organizationType: string;
  organizationId?: string;
  location?: string;
  donor?: {
    id: string;
    fullName: string;
    bloodGroup?: string;
  };
}

export interface ExpirySummary {
  totalUnits: number;
  safeUnits: number;
  expiringSoonUnits: number;
  expiredUnits: number;
  wastedUnits: number;
  usedUnits: number;
  wasteRate: number;
  expiringTodayUnits: number;
  expiringIn3DaysUnits: number;
  expiringIn7DaysUnits: number;
  expiringIn30DaysUnits: number;
  totalBatches: number;
  warningDaysApplied: number;
}

export interface WasteAnalyticsData {
  totalWastedUnits: number;
  totalInventoryUnits: number;
  wasteRate: number;
  historicalComparison: {
    hasEnoughData: boolean;
    previousPeriodUnits?: number;
    currentPeriodUnits?: number;
    diffPercent?: number;
    trend?: 'decrease' | 'increase' | 'neutral';
    message: string;
  };
  wasteByGroup: Record<string, number>;
  wasteByReason: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    wastedUnits: number;
    recordCount: number;
  }>;
  wasteByOrganization: Array<{
    id: string;
    name: string;
    type: string;
    city: string;
    wastedUnits: number;
  }>;
  expiryVsUsedVsWasted: {
    safe: number;
    expiringSoon: number;
    expired: number;
    used: number;
    wasted: number;
  };
  recentWasteRecords: any[];
}

export interface WastePreventionInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'alert';
  title: string;
  description: string;
  actionRecommendation: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ExpiryAlertItem {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  bloodGroup: string;
  units: number;
  batchNumber: string;
  daysRemaining: number;
  facilityName: string;
  timestamp: string;
}

export const inventoryApi = {
  async getAll(): Promise<any[]> {
    return await fetchApi<any[]>('/inventory');
  },

  async getSummary(): Promise<Record<string, { unitsAvailable: number; minimumRequired: number; isShortage: boolean }>> {
    return await fetchApi<Record<string, { unitsAvailable: number; minimumRequired: number; isShortage: boolean }>>('/inventory/summary');
  },

  /**
   * Get dynamic expiry batches and summary
   */
  async getExpiry(params: {
    bloodBankId?: string;
    hospitalId?: string;
    warningDays?: number;
    bloodGroup?: string;
    status?: string;
    component?: string;
    search?: string;
    state?: string;
    city?: string;
  } = {}): Promise<{ batches: ExpiryBatchItem[]; summary: ExpirySummary }> {
    const query = new URLSearchParams();
    if (params.bloodBankId) query.set('bloodBankId', params.bloodBankId);
    if (params.hospitalId) query.set('hospitalId', params.hospitalId);
    if (params.warningDays !== undefined) query.set('warningDays', String(params.warningDays));
    if (params.bloodGroup && params.bloodGroup !== 'all') query.set('bloodGroup', params.bloodGroup);
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (params.component && params.component !== 'all') query.set('component', params.component);
    if (params.search) query.set('search', params.search);
    if (params.state) query.set('state', params.state);
    if (params.city) query.set('city', params.city);

    const queryString = query.toString();
    return await fetchApi<{ batches: ExpiryBatchItem[]; summary: ExpirySummary }>(
      `/inventory/expiry${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get batches expiring soon
   */
  async getExpiringSoon(params: { bloodBankId?: string; hospitalId?: string; warningDays?: number } = {}): Promise<{ batches: ExpiryBatchItem[]; summary: ExpirySummary }> {
    const query = new URLSearchParams();
    if (params.bloodBankId) query.set('bloodBankId', params.bloodBankId);
    if (params.hospitalId) query.set('hospitalId', params.hospitalId);
    if (params.warningDays !== undefined) query.set('warningDays', String(params.warningDays));

    const queryString = query.toString();
    return await fetchApi<{ batches: ExpiryBatchItem[]; summary: ExpirySummary }>(
      `/inventory/expiry/soon${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get expired blood units
   */
  async getExpired(params: { bloodBankId?: string; hospitalId?: string } = {}): Promise<{ batches: ExpiryBatchItem[]; summary: ExpirySummary }> {
    const query = new URLSearchParams();
    if (params.bloodBankId) query.set('bloodBankId', params.bloodBankId);
    if (params.hospitalId) query.set('hospitalId', params.hospitalId);

    const queryString = query.toString();
    return await fetchApi<{ batches: ExpiryBatchItem[]; summary: ExpirySummary }>(
      `/inventory/expired${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get comprehensive waste & expiry analytics
   */
  async getWasteAnalytics(params: {
    bloodBankId?: string;
    hospitalId?: string;
    state?: string;
    city?: string;
    bloodGroup?: string;
    dateRange?: string;
  } = {}): Promise<WasteAnalyticsData> {
    const query = new URLSearchParams();
    if (params.bloodBankId) query.set('bloodBankId', params.bloodBankId);
    if (params.hospitalId) query.set('hospitalId', params.hospitalId);
    if (params.state) query.set('state', params.state);
    if (params.city) query.set('city', params.city);
    if (params.bloodGroup && params.bloodGroup !== 'all') query.set('bloodGroup', params.bloodGroup);
    if (params.dateRange) query.set('dateRange', params.dateRange);

    const queryString = query.toString();
    return await fetchApi<WasteAnalyticsData>(`/inventory/waste${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Record a new blood unit waste entry
   */
  async recordWaste(data: {
    batchId?: string;
    inventoryId?: string;
    bloodBankId?: string;
    hospitalId?: string;
    bloodGroup: string;
    component?: string;
    units: number;
    reason: string;
    notes?: string;
    recordedById?: string;
  }): Promise<any> {
    return await fetchApi<any>('/inventory/waste', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update batch status (e.g. mark as used, wasted)
   */
  async updateBatchStatus(batchId: string, status: 'available' | 'used' | 'wasted' | 'reserved', reason?: string): Promise<any> {
    return await fetchApi<any>(`/inventory/batches/${batchId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },

  /**
   * Get rule-based data-driven waste prevention insights
   */
  async getWastePreventionInsights(params: { bloodBankId?: string; hospitalId?: string } = {}): Promise<WastePreventionInsight[]> {
    const query = new URLSearchParams();
    if (params.bloodBankId) query.set('bloodBankId', params.bloodBankId);
    if (params.hospitalId) query.set('hospitalId', params.hospitalId);

    const queryString = query.toString();
    return await fetchApi<WastePreventionInsight[]>(`/inventory/insights${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get real-time live expiry alerts
   */
  async getExpiryAlerts(params: { bloodBankId?: string; hospitalId?: string } = {}): Promise<ExpiryAlertItem[]> {
    const query = new URLSearchParams();
    if (params.bloodBankId) query.set('bloodBankId', params.bloodBankId);
    if (params.hospitalId) query.set('hospitalId', params.hospitalId);

    const queryString = query.toString();
    return await fetchApi<ExpiryAlertItem[]>(`/inventory/alerts${queryString ? `?${queryString}` : ''}`);
  },
};

export default inventoryApi;
