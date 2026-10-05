import prisma from '../lib/prisma.js';

export class HospitalService {
  /**
   * Get all registered hospitals
   */
  static async getHospitals(filters?: { city?: string; state?: string; status?: string; search?: string }) {
    const where: any = { isActive: true };

    if (filters?.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }
    if (filters?.state) {
      where.state = { contains: filters.state, mode: 'insensitive' };
    }
    if (filters?.status) {
      where.verificationStatus = filters.status;
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { registrationNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const hospitals = await prisma.hospital.findMany({
      where,
      include: {
        inventories: true,
        bloodRequests: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return hospitals.map((h) => {
      // Map stock record
      const stock: Record<string, number> = {};
      const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
      bloodGroups.forEach((bg) => {
        const inv = h.inventories.find((i) => i.bloodGroup === bg);
        stock[bg] = inv?.unitsAvailable ?? 0;
      });

      return {
        ...h,
        stock,
        totalStock: Object.values(stock).reduce((a, b) => a + b, 0),
      };
    });
  }

  /**
   * Get a single hospital by ID or Registration Number
   */
  static async getHospitalById(id: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const where: any = isUuid ? { id } : { registrationNumber: id };

    const hospital = await prisma.hospital.findFirst({
      where,
      include: {
        inventories: {
          include: {
            batches: true,
          },
        },
        bloodRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        donations: {
          include: {
            donor: {
              select: { id: true, fullName: true, phone: true, bloodGroup: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 15,
        },
        shortagePredictions: {
          orderBy: { predictionDate: 'desc' },
          take: 8,
        },
      },
    });

    if (!hospital) return null;

    const stock: Record<string, number> = {};
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    bloodGroups.forEach((bg) => {
      const inv = hospital.inventories.find((i) => i.bloodGroup === bg);
      stock[bg] = inv?.unitsAvailable ?? 0;
    });

    return {
      ...hospital,
      stock,
      totalStock: Object.values(stock).reduce((a, b) => a + b, 0),
    };
  }

  /**
   * Get detailed hospital dashboard data
   */
  static async getHospitalDashboard(hospitalId: string) {
    const hospital = await this.getHospitalById(hospitalId);
    if (!hospital) return null;

    const requests = await prisma.bloodRequest.findMany({
      where: { hospitalId: hospital.id },
      orderBy: { createdAt: 'desc' },
    });

    const donations = await prisma.donation.findMany({
      where: { hospitalId: hospital.id },
      include: {
        donor: {
          select: { id: true, fullName: true, phone: true, bloodGroup: true, gender: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transfers = await prisma.inventoryTransfer.findMany({
      where: {
        OR: [{ sourceHospitalId: hospital.id }, { destinationHospitalId: hospital.id }],
      },
      include: {
        sourceBloodBank: { select: { id: true, name: true } },
        sourceHospital: { select: { id: true, name: true } },
      },
      orderBy: { requestedAt: 'desc' },
      take: 10,
    });

    const predictions = await prisma.shortagePrediction.findMany({
      where: { hospitalId: hospital.id },
      orderBy: { predictionDate: 'desc' },
    });

    return {
      hospital,
      stock: hospital.stock,
      totalStock: hospital.totalStock,
      requests,
      donations,
      transfers,
      predictions,
    };
  }

  /**
   * Update blood stock for a hospital
   */
  static async updateStock(hospitalId: string, bloodGroup: string, change: number) {
    const hospital = await this.getHospitalById(hospitalId);
    const resolvedId = hospital ? hospital.id : hospitalId;

    const existing = await prisma.bloodInventory.findFirst({
      where: { hospitalId: resolvedId, bloodGroup },
    });

    if (existing) {
      const current = existing.unitsAvailable ?? 0;
      const newUnits = Math.max(0, current + change);
      return await prisma.bloodInventory.update({
        where: { id: existing.id },
        data: {
          unitsAvailable: newUnits,
          lastUpdated: new Date(),
        },
      });
    } else {
      return await prisma.bloodInventory.create({
        data: {
          hospitalId: resolvedId,
          bloodGroup,
          unitsAvailable: Math.max(0, change),
          minimumRequiredUnits: 5,
        },
      });
    }
  }

  /**
   * Submit a donor pledge for a hospital
   */
  static async createDonorPledge(data: {
    hospitalId: string;
    donorName: string;
    phone: string;
    bloodGroup: string;
    age?: number;
    gender?: string;
    preferredSlot?: string;
    notes?: string;
  }) {
    // Find or create dummy guest user for donor
    let user = await prisma.user.findFirst({
      where: { phone: data.phone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: data.donorName,
          email: `donor_${Date.now()}@hemovite.local`,
          phone: data.phone,
          passwordHash: 'volunteer_pledge_guest',
          bloodGroup: data.bloodGroup,
          gender: data.gender || 'Not specified',
          role: 'citizen',
        },
      });
    }

    const donation = await prisma.donation.create({
      data: {
        donorId: user.id,
        hospitalId: data.hospitalId,
        bloodGroup: data.bloodGroup,
        units: 1,
        status: 'scheduled',
        notes: data.notes
          ? `${data.notes} | Slot: ${data.preferredSlot || 'Immediate'}`
          : `Slot: ${data.preferredSlot || 'Immediate'}`,
      },
      include: {
        donor: true,
      },
    });

    return donation;
  }
}
