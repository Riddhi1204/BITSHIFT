import prisma from '../lib/prisma.js';

export class GovernmentService {
  /**
   * Get complete National & State Government Dashboard metrics
   */
  static async getGovernmentDashboard() {
    const [
      totalHospitals,
      verifiedHospitals,
      pendingHospitals,
      totalBloodBanks,
      verifiedBloodBanks,
      totalDonations,
      activeRequests,
      urgentRequests,
      allInventories,
      shortagePredictions,
      recentDonations,
      verificationRequests,
      regions,
    ] = await Promise.all([
      prisma.hospital.count({ where: { isActive: true } }),
      prisma.hospital.count({ where: { verificationStatus: 'verified', isActive: true } }),
      prisma.hospital.count({ where: { verificationStatus: 'pending', isActive: true } }),
      prisma.bloodBank.count({ where: { isActive: true } }),
      prisma.bloodBank.count({ where: { verificationStatus: 'verified', isActive: true } }),
      prisma.donation.count(),
      prisma.bloodRequest.count({ where: { status: 'active' } }),
      prisma.bloodRequest.count({ where: { status: 'active', urgency: { in: ['urgent', 'critical'] } } }),
      prisma.bloodInventory.findMany(),
      prisma.shortagePrediction.findMany({
        include: {
          hospital: { select: { id: true, name: true, city: true } },
          bloodBank: { select: { id: true, name: true, city: true } },
          region: true,
        },
        orderBy: { riskScore: 'desc' },
        take: 10,
      }),
      prisma.donation.findMany({
        include: {
          donor: { select: { id: true, fullName: true, city: true, bloodGroup: true } },
          hospital: { select: { id: true, name: true, city: true } },
          bloodBank: { select: { id: true, name: true, city: true } },
        },
        orderBy: { donationDate: 'desc' },
        take: 15,
      }),
      prisma.hospitalVerificationRequest.findMany({
        include: {
          hospital: true,
          submitter: { select: { id: true, fullName: true, email: true, phone: true } },
        },
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.region.findMany({
        where: { type: 'state', isActive: true },
      }),
    ]);

    // Aggregate total units in grid
    const totalUnitsAvailable = allInventories.reduce((acc, curr) => acc + (curr.unitsAvailable ?? 0), 0);

    // Group inventory by blood group
    const inventoryByGroup: Record<string, number> = {};
    ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].forEach((bg) => {
      inventoryByGroup[bg] = allInventories
        .filter((i) => i.bloodGroup === bg)
        .reduce((sum, curr) => sum + (curr.unitsAvailable ?? 0), 0);
    });

    return {
      stats: {
        totalHospitals,
        verifiedHospitals,
        pendingHospitals,
        totalBloodBanks,
        verifiedBloodBanks,
        totalDonations,
        activeRequests,
        urgentRequests,
        totalUnitsAvailable,
      },
      inventoryByGroup,
      shortagePredictions,
      recentDonations,
      verificationRequests,
      regions,
    };
  }

  /**
   * Get all hospital verification requests
   */
  static async getVerificationRequests() {
    return await prisma.hospitalVerificationRequest.findMany({
      include: {
        hospital: true,
        submitter: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        reviewer: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  /**
   * Review a hospital verification request (approve / reject)
   */
  static async updateVerificationStatus(
    requestId: string,
    status: 'approved' | 'rejected' | 'under_review',
    reviewerId?: string,
    reviewNotes?: string
  ) {
    const verification = await prisma.hospitalVerificationRequest.update({
      where: { id: requestId },
      data: {
        status,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewNotes,
      },
      include: {
        hospital: true,
      },
    });

    // If approved, update the hospital model status to verified
    if (status === 'approved') {
      await prisma.hospital.update({
        where: { id: verification.hospitalId },
        data: {
          verificationStatus: 'verified',
          verifiedBy: reviewerId,
          verifiedAt: new Date(),
        },
      });
    } else if (status === 'rejected') {
      await prisma.hospital.update({
        where: { id: verification.hospitalId },
        data: {
          verificationStatus: 'rejected',
        },
      });
    }

    return verification;
  }

  /**
   * Get active hotspots across regions/cities
   */
  static async getHotspots() {
    // Get high urgency requests grouped by city
    const requests = await prisma.bloodRequest.findMany({
      where: {
        status: 'active',
        urgency: { in: ['urgent', 'critical'] },
      },
      include: {
        hospital: true,
      },
    });

    const predictions = await prisma.shortagePrediction.findMany({
      where: {
        riskLevel: { in: ['high', 'critical'] },
      },
      include: {
        hospital: true,
        bloodBank: true,
        region: true,
      },
      orderBy: { riskScore: 'desc' },
    });

    return {
      urgentRequests: requests,
      highRiskPredictions: predictions,
    };
  }

  /**
   * Get regional blood supply breakdown
   */
  static async getRegionalSupply() {
    const regions = await prisma.region.findMany({
      include: {
        hospitals: {
          include: { inventories: true },
        },
        bloodBanks: {
          include: { inventories: true },
        },
      },
    });

    return regions.map((r) => {
      let totalAvailable = 0;
      r.hospitals.forEach((h) => {
        h.inventories.forEach((inv) => (totalAvailable += inv.unitsAvailable ?? 0));
      });
      r.bloodBanks.forEach((bb) => {
        bb.inventories.forEach((inv) => (totalAvailable += inv.unitsAvailable ?? 0));
      });

      return {
        id: r.id,
        name: r.name,
        type: r.type,
        hospitalCount: r.hospitals.length,
        bloodBankCount: r.bloodBanks.length,
        totalAvailable,
        status: totalAvailable < 50 ? 'critical' : totalAvailable < 150 ? 'low' : 'healthy',
      };
    });
  }
}
