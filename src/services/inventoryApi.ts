import { fetchApi } from './api';

export const inventoryApi = {
  async getAll(): Promise<any[]> {
    return await fetchApi<any[]>('/inventory');
  },

  async getSummary(): Promise<Record<string, { unitsAvailable: number; minimumRequired: number; isShortage: boolean }>> {
    return await fetchApi<Record<string, { unitsAvailable: number; minimumRequired: number; isShortage: boolean }>>('/inventory/summary');
  },
};

export default inventoryApi;
