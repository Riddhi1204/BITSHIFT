import prisma from '../lib/prisma.js';

export class CitizenService {
  /**
   * Get citizen full profile & dashboard info
   */
  static async getCitizenDashboard(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        citizenProfile: true,
        donations: {
          include: {
            hospital: { select: { id: true, name: true, city: true } },
            bloodBank: { select: { id: true, name: true, city: true } },
          },
          orderBy: { donationDate: 'desc' },
        },
        citizenBadges: {
          include: {
            badge: true,
          },
        },
        bloodRequests: {
          orderBy: { createdAt: 'desc' },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        donorMatches: {
          include: {
            request: true,
          },
          orderBy: { matchScore: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) return null;

    // Next eligible donation date calculation
    const lastDonation = user.donations[0];
    let nextEligibleDate = new Date();
    if (lastDonation) {
      const rawDate = lastDonation.donationDate ?? lastDonation.createdAt;
      const lastDate = rawDate ? new Date(rawDate) : new Date();
      nextEligibleDate = new Date(lastDate.setDate(lastDate.getDate() + 90));
    }

    const isEligible = new Date() >= nextEligibleDate;

    return {
      user,
      citizenProfile: user.citizenProfile,
      donations: user.donations,
      totalDonations: user.donations.length,
      badges: user.citizenBadges.map((cb) => cb.badge),
      bloodRequests: user.bloodRequests,
      notifications: user.notifications,
      donorMatches: user.donorMatches,
      eligibility: {
        isEligible,
        nextEligibleDate: nextEligibleDate.toISOString().split('T')[0],
        lastDonationDate: lastDonation ? lastDonation.donationDate : null,
      },
    };
  }

  /**
   * Update citizen profile details
   */
  static async updateCitizenProfile(userId: string, data: {
    fullName?: string;
    phone?: string;
    bloodGroup?: string;
    city?: string;
    state?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    donorAvailable?: boolean;
    emergencyAvailable?: boolean;
    healthNotes?: string;
    address?: string;
  }) {
    // Update User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.fullName ? { fullName: data.fullName } : {}),
        ...(data.phone ? { phone: data.phone } : {}),
        ...(data.bloodGroup ? { bloodGroup: data.bloodGroup } : {}),
        ...(data.city ? { city: data.city } : {}),
        ...(data.state ? { state: data.state } : {}),
      },
    });

    // Upsert Citizen Profile
    const updatedProfile = await prisma.citizenProfile.upsert({
      where: { userId },
      update: {
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        donorAvailable: data.donorAvailable,
        emergencyAvailable: data.emergencyAvailable,
        healthNotes: data.healthNotes,
        address: data.address,
      },
      create: {
        userId,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        donorAvailable: data.donorAvailable || false,
        emergencyAvailable: data.emergencyAvailable || false,
        healthNotes: data.healthNotes,
        address: data.address,
      },
    });

    return { user: updatedUser, profile: updatedProfile };
  }

  /**
   * Search nearby facilities by blood group and city
   */
  static async searchNearbyAvailability(bloodGroup: string, city?: string) {
    const whereInventory: any = {
      bloodGroup,
      unitsAvailable: { gt: 0 },
    };

    const inventories = await prisma.bloodInventory.findMany({
      where: whereInventory,
      include: {
        hospital: true,
        bloodBank: true,
      },
      orderBy: { unitsAvailable: 'desc' },
    });

    const results = inventories
      .map((inv) => {
        const facility = inv.hospital || inv.bloodBank;
        if (!facility) return null;
        if (city && facility.city && !facility.city.toLowerCase().includes(city.toLowerCase())) {
          return null;
        }

        return {
          id: facility.id,
          name: facility.name,
          type: inv.hospital ? 'Hospital' : 'Blood Bank',
          city: facility.city,
          state: facility.state,
          address: facility.address,
          phone: facility.phone,
          bloodGroup: inv.bloodGroup,
          unitsAvailable: inv.unitsAvailable,
          verified: facility.verificationStatus === 'verified',
        };
      })
      .filter(Boolean);

    return results;
  }
}
