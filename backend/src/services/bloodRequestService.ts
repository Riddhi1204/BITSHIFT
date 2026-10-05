import prisma from '../lib/prisma.js';

export class BloodRequestService {
  /**
   * Create a new blood request (Emergency or Standard)
   */
  static async createBloodRequest(data: {
    requesterId: string;
    hospitalId?: string;
    patientName?: string;
    patientAge?: number;
    patientGender?: string;
    bloodGroup: string;
    unitsRequired: number;
    urgency?: 'normal' | 'urgent' | 'critical';
    hospitalName?: string;
    hospitalAddress?: string;
    city?: string;
    state?: string;
    requiredBy?: Date;
    contactPhone?: string;
    notes?: string;
  }) {
    const request = await prisma.bloodRequest.create({
      data: {
        requesterId: data.requesterId,
        hospitalId: data.hospitalId,
        patientName: data.patientName,
        patientAge: data.patientAge,
        patientGender: data.patientGender,
        bloodGroup: data.bloodGroup,
        unitsRequired: data.unitsRequired,
        urgency: data.urgency || 'normal',
        hospitalName: data.hospitalName,
        hospitalAddress: data.hospitalAddress,
        city: data.city,
        state: data.state,
        requiredBy: data.requiredBy,
        contactPhone: data.contactPhone,
        notes: data.notes,
        status: 'active',
      },
      include: {
        requester: { select: { id: true, fullName: true, phone: true } },
        hospital: { select: { id: true, name: true, phone: true } },
      },
    });

    // Smart Match: Find available donors with matching blood group
    const matchingDonors = await prisma.user.findMany({
      where: {
        bloodGroup: data.bloodGroup,
        citizenProfile: {
          donorAvailable: true,
          donationEligible: true,
        },
      },
      take: 10,
    });

    // Create DonorMatch records for matching donors
    for (const donor of matchingDonors) {
      await prisma.donorMatch.create({
        data: {
          requestId: request.id,
          donorId: donor.id,
          matchScore: 92.5,
          bloodGroupMatch: true,
          availabilityMatch: true,
          locationMatch: donor.city === data.city,
          eligibilityMatch: true,
          aiReason: 'Blood group and active voluntary availability matched.',
          status: 'suggested',
        },
      });

      // Dispatch alert notification to matched donor
      await prisma.notification.create({
        data: {
          userId: donor.id,
          title: `Emergency ${data.bloodGroup} Blood Needed!`,
          message: `Urgent requirement for ${data.unitsRequired} units at ${data.hospitalName || 'Local Medical Center'}.`,
          type: 'emergency_request',
          priority: data.urgency === 'critical' ? 'critical' : 'high',
          relatedRequestId: request.id,
        },
      });
    }

    return request;
  }

  /**
   * Get all blood requests with optional filters
   */
  static async getBloodRequests(filters?: {
    city?: string;
    bloodGroup?: string;
    urgency?: string;
    status?: string;
    hospitalId?: string;
  }) {
    const where: any = {};
    if (filters?.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }
    if (filters?.bloodGroup) {
      where.bloodGroup = filters.bloodGroup;
    }
    if (filters?.urgency) {
      where.urgency = filters.urgency;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.hospitalId) {
      where.hospitalId = filters.hospitalId;
    }

    return await prisma.bloodRequest.findMany({
      where,
      include: {
        requester: { select: { id: true, fullName: true, phone: true } },
        hospital: { select: { id: true, name: true } },
        donorMatches: {
          include: {
            donor: { select: { id: true, fullName: true, phone: true, bloodGroup: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update blood request status or units fulfilled
   */
  static async updateStatus(id: string, status: string, unitsFulfilled?: number) {
    return await prisma.bloodRequest.update({
      where: { id },
      data: {
        status,
        ...(unitsFulfilled !== undefined ? { unitsFulfilled } : {}),
      },
    });
  }
}
