import prisma from '../lib/prisma.js';

export class CitizenService {
  /**
   * Get citizen full profile & dashboard info
   */
  static async getCitizenDashboard(userId: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    if (!isUuid) return null;

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
    gender?: string;
    dateOfBirth?: string | Date;
    city?: string;
    state?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    donorAvailable?: boolean;
    emergencyAvailable?: boolean;
    healthNotes?: string;
    address?: string;
  }) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    let user = await prisma.user.findFirst({
      where: isUuid ? { id: userId } : { email: userId },
    });

    if (!user) {
      // Fallback: look up first citizen or create
      user = await prisma.user.findFirst({ where: { role: 'citizen' } });
      if (!user) {
        throw new Error('Citizen user record not found');
      }
    }

    const actualUserId = user.id;

    // Update User
    const updatedUser = await prisma.user.update({
      where: { id: actualUserId },
      data: {
        ...(data.fullName ? { fullName: data.fullName } : {}),
        ...(data.phone ? { phone: data.phone } : {}),
        ...(data.bloodGroup ? { bloodGroup: data.bloodGroup } : {}),
        ...(data.gender ? { gender: data.gender } : {}),
        ...(data.dateOfBirth ? { dateOfBirth: new Date(data.dateOfBirth) } : {}),
        ...(data.city ? { city: data.city } : {}),
        ...(data.state ? { state: data.state } : {}),
      },
    });

    // Upsert Citizen Profile
    const updatedProfile = await prisma.citizenProfile.upsert({
      where: { userId: actualUserId },
      update: {
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        donorAvailable: data.donorAvailable !== undefined ? data.donorAvailable : true,
        emergencyAvailable: data.emergencyAvailable !== undefined ? data.emergencyAvailable : true,
        healthNotes: data.healthNotes,
        address: data.address,
      },
      create: {
        userId: actualUserId,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        donorAvailable: data.donorAvailable !== undefined ? data.donorAvailable : true,
        emergencyAvailable: data.emergencyAvailable !== undefined ? data.emergencyAvailable : true,
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
