import prisma from '../lib/prisma.js';

export class BloodBankService {
  /**
   * Get all registered blood banks & NGO partners
   */
  static async getBloodBanks(filters?: { city?: string; state?: string; search?: string; verified?: boolean }) {
    const where: any = { isActive: true };

    if (filters?.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }
    if (filters?.state) {
      where.state = { contains: filters.state, mode: 'insensitive' };
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { registrationNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters?.verified !== undefined) {
      where.verificationStatus = filters.verified ? 'verified' : 'pending';
    }

    const bloodBanks = await prisma.bloodBank.findMany({
      where,
      include: {
        inventories: true,
      },
      orderBy: { name: 'asc' },
    });

    return bloodBanks.map((bb) => {
      const inventory: Record<string, number> = {};
      const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
      bloodGroups.forEach((bg) => {
        const inv = bb.inventories.find((i) => i.bloodGroup === bg);
        inventory[bg] = inv?.unitsAvailable ?? 0;
      });

      return {
        ...bb,
        inventory,
        totalUnits: Object.values(inventory).reduce((a, b) => a + b, 0),
        verified: bb.verificationStatus === 'verified',
      };
    });
  }

  /**
   * Get a single blood bank by ID or Registration Number
   */
  static async getBloodBankById(id: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const where: any = isUuid ? { id } : { registrationNumber: id };

    const bloodBank = await prisma.bloodBank.findFirst({
      where,
      include: {
        inventories: {
          include: {
            batches: true,
          },
        },
        donations: {
          include: {
            donor: {
              select: { id: true, fullName: true, phone: true, bloodGroup: true, city: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        donationCampaigns: {
          orderBy: { startTime: 'desc' },
        },
        transfersAsSource: {
          include: {
            destinationHospital: { select: { id: true, name: true } },
          },
          orderBy: { requestedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!bloodBank) return null;

    const inventory: Record<string, number> = {};
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    bloodGroups.forEach((bg) => {
      const inv = bloodBank.inventories.find((i) => i.bloodGroup === bg);
      inventory[bg] = inv?.unitsAvailable ?? 0;
    });

    return {
      ...bloodBank,
      inventory,
      totalUnits: Object.values(inventory).reduce((a, b) => a + b, 0),
      verified: bloodBank.verificationStatus === 'verified',
    };
  }

  /**
   * Get dashboard data for a blood bank
   */
  static async getBloodBankDashboard(bloodBankId: string) {
    const bloodBank = await this.getBloodBankById(bloodBankId);
    if (!bloodBank) return null;

    const batches = await prisma.inventoryBatch.findMany({
      where: {
        inventory: {
          bloodBankId: bloodBank.id,
        },
      },
      orderBy: { expiryDate: 'asc' },
    });

    const donations = await prisma.donation.findMany({
      where: { bloodBankId: bloodBank.id },
      include: {
        donor: {
          select: { id: true, fullName: true, phone: true, bloodGroup: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const campaigns = await prisma.donationCampaign.findMany({
      where: { bloodBankId: bloodBank.id },
      orderBy: { startTime: 'desc' },
    });

    return {
      bloodBank,
      inventory: bloodBank.inventory,
      totalUnits: bloodBank.totalUnits,
      batches,
      donations,
      campaigns,
    };
  }

  /**
   * Update or add blood inventory units
   */
  static async updateInventory(bloodBankId: string, bloodGroup: string, units: number, component: string = 'whole_blood') {
    const bloodBank = await this.getBloodBankById(bloodBankId);
    const resolvedId = bloodBank ? bloodBank.id : bloodBankId;

    const existing = await prisma.bloodInventory.findFirst({
      where: { bloodBankId: resolvedId, bloodGroup, component },
    });

    if (existing) {
      return await prisma.bloodInventory.update({
        where: { id: existing.id },
        data: {
          unitsAvailable: units,
          lastUpdated: new Date(),
        },
      });
    } else {
      return await prisma.bloodInventory.create({
        data: {
          bloodBankId: resolvedId,
          bloodGroup,
          component,
          unitsAvailable: units,
          minimumRequiredUnits: 10,
        },
      });
    }
  }
}
