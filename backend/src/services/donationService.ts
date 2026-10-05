import prisma from '../lib/prisma.js';

export class DonationService {
  /**
   * Log a new donation and optionally increment hospital/blood bank inventory
   */
  static async createDonation(data: {
    donorId: string;
    hospitalId?: string;
    bloodBankId?: string;
    bloodGroup: string;
    units?: number;
    notes?: string;
    status?: string;
  }) {
    const donation = await prisma.donation.create({
      data: {
        donorId: data.donorId,
        hospitalId: data.hospitalId,
        bloodBankId: data.bloodBankId,
        bloodGroup: data.bloodGroup,
        units: data.units || 1,
        status: data.status || 'completed',
        notes: data.notes,
      },
      include: {
        donor: true,
        hospital: true,
        bloodBank: true,
      },
    });

    // If completed, increment inventory stock
    if (donation.status === 'completed') {
      if (data.hospitalId) {
        const inv = await prisma.bloodInventory.findFirst({
          where: { hospitalId: data.hospitalId, bloodGroup: data.bloodGroup },
        });
        if (inv) {
          await prisma.bloodInventory.update({
            where: { id: inv.id },
            data: { unitsAvailable: (inv.unitsAvailable ?? 0) + (data.units || 1) },
          });
        }
      } else if (data.bloodBankId) {
        const inv = await prisma.bloodInventory.findFirst({
          where: { bloodBankId: data.bloodBankId, bloodGroup: data.bloodGroup },
        });
        if (inv) {
          await prisma.bloodInventory.update({
            where: { id: inv.id },
            data: { unitsAvailable: (inv.unitsAvailable ?? 0) + (data.units || 1) },
          });
        }
      }

      // Update citizen total donations counter
      await prisma.citizenProfile.updateMany({
        where: { userId: data.donorId },
        data: {
          totalDonations: { increment: 1 },
          lastDonationDate: new Date(),
        },
      });
    }

    return donation;
  }

  /**
   * Get donations with filter
   */
  static async getDonations(filters?: {
    donorId?: string;
    hospitalId?: string;
    bloodBankId?: string;
    status?: string;
  }) {
    const where: any = {};
    if (filters?.donorId) where.donorId = filters.donorId;
    if (filters?.hospitalId) where.hospitalId = filters.hospitalId;
    if (filters?.bloodBankId) where.bloodBankId = filters.bloodBankId;
    if (filters?.status) where.status = filters.status;

    return await prisma.donation.findMany({
      where,
      include: {
        donor: { select: { id: true, fullName: true, phone: true, bloodGroup: true, email: true } },
        hospital: { select: { id: true, name: true, city: true } },
        bloodBank: { select: { id: true, name: true, city: true } },
      },
      orderBy: { donationDate: 'desc' },
    });
  }

  /**
   * Update donation status (e.g. fulfill a scheduled pledge)
   */
  static async updateDonationStatus(id: string, status: string, notes?: string) {
    const donation = await prisma.donation.update({
      where: { id },
      data: {
        status,
        ...(notes ? { notes } : {}),
      },
      include: {
        hospital: true,
        bloodBank: true,
      },
    });

    if (status === 'completed') {
      if (donation.hospitalId) {
        const inv = await prisma.bloodInventory.findFirst({
          where: { hospitalId: donation.hospitalId, bloodGroup: donation.bloodGroup },
        });
        if (inv) {
          await prisma.bloodInventory.update({
            where: { id: inv.id },
            data: { unitsAvailable: (inv.unitsAvailable ?? 0) + (donation.units ?? 1) },
          });
        }
      }
    }

    return donation;
  }
}
