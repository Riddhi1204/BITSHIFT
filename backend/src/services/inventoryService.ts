import prisma from '../lib/prisma.js';

export class InventoryService {
  /**
   * Get all live inventory records across hospitals and blood banks
   */
  static async getAllInventory() {
    const inventories = await prisma.bloodInventory.findMany({
      include: {
        hospital: { select: { id: true, name: true, city: true, state: true, phone: true } },
        bloodBank: { select: { id: true, name: true, city: true, state: true, phone: true } },
        batches: true,
      },
      orderBy: { unitsAvailable: 'desc' },
    });

    return inventories;
  }

  /**
   * Get blood group availability across the grid
   */
  static async getGridSummary() {
    const inventories = await prisma.bloodInventory.findMany();
    const groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    const summary: Record<string, { unitsAvailable: number; minimumRequired: number; isShortage: boolean }> = {};

    groups.forEach((g) => {
      const items = inventories.filter((i) => i.bloodGroup === g);
      const available = items.reduce((acc, curr) => acc + (curr.unitsAvailable ?? 0), 0);
      const minimum = items.reduce((acc, curr) => acc + (curr.minimumRequiredUnits ?? 0), 0);

      summary[g] = {
        unitsAvailable: available,
        minimumRequired: minimum,
        isShortage: available < minimum,
      };
    });

    return summary;
  }
}
