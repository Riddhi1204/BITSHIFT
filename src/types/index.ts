export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'citizen' | 'government' | 'hospital_staff' | 'blood_bank_staff' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  bloodGroup?: BloodGroup;
  dateOfBirth?: string;
  gender?: string;
  regionId?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hospital {
  id: string;
  name: string;
  registrationNumber?: string;
  address: string;
  city: string;
  state: string;
  regionId?: string;
  phone: string;
  emergencyPhone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  emergencyAvailable?: boolean;
  bloodServiceAvailable?: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'suspended' | string;
  status?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  websiteUrl?: string;
  isActive?: boolean;
  stock?: Record<string, number>;
  totalStock?: number;
  bloodBankLinked?: string;
  category?: string;
  totalBeds?: number;
  bloodInventoryUnits?: number;
  contactPerson?: string;
  submittedAt?: string;
  type?: string;
}

export interface BloodBank {
  id: string;
  name: string;
  registrationNumber?: string;
  address: string;
  city: string;
  state: string;
  regionId?: string;
  phone: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  operatingHours?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'suspended' | string;
  status?: string;
  websiteUrl?: string;
  isActive?: boolean;
  stock?: Record<string, number>;
  totalStock?: number;
  type?: string;
  operationalStatus?: string;
}

export interface HospitalDonorPledge {
  id: string;
  hospitalId: string;
  donorName: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  urgencyOrSlot: string;
  status: 'Pledged' | 'Contacted' | 'Scheduled' | 'Fulfilled' | 'Cancelled';
  createdAt: string;
  notes?: string;
}

export interface HospitalApplication {
  id: string;
  name: string;
  licenseNumber?: string;
  city: string;
  state: string;
  address?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  bedCount?: number;
  linkedBloodBank?: string;
  documentUrl?: string;
  status: 'Pending' | 'Verified' | 'Rejected' | 'Requires Info' | 'resubmission_required' | string;
  submittedAt: string;
  notes?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface GovStats {
  totalHospitals?: number;
  registeredHospitals?: number;
  verifiedHospitals: number;
  pendingVerification: number;
  pendingHospitals?: number;
  totalBloodBanks?: number;
  bloodBanks?: number;
  verifiedBloodBanks?: number;
  totalDonations?: number;
  activeRequests: number;
  urgentRequests?: number;
  totalUnitsAvailable?: number;
  unitsAvailable?: number;
  unitsDonated?: number;
  activeHotspots?: number;
  criticalShortages?: number;
  criticalShortageAreas?: number;
  nationalCoverage?: number;
}

export interface BloodHotspot {
  id: string;
  city: string;
  state: string;
  bloodGroup: string;
  riskLevel: 'Critical' | 'High' | 'Moderate' | 'Stable' | string;
  riskScore: number;
  shortageUnits: number;
  demandUnits: number;
  availableUnits: number;
  affectedHospitals: string[];
  lastUpdated: string;
}

export interface RegionalBloodSupply {
  id: string;
  region: string;
  state: string;
  totalUnits: number;
  requiredUnits?: number;
  availableUnits?: number;
  shortage?: number;
  surplus?: number;
  supplyCoverage?: number;
  status: 'critical' | 'low' | 'healthy' | string;
  criticalGroups: string[];
  surplusGroups: string[];
  lastUpdated: string;
  hospitalCount: number;
  bloodBankCount: number;
}

export interface CitizenProfile {
  id: string;
  userId: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  occupation?: string;
  totalDonations: number;
  lastDonationDate?: string;
  donorAvailable: boolean;
  emergencyAvailable: boolean;
  donationEligible: boolean;
  healthNotes?: string;
  user?: User;
}

export interface BloodDonation {
  id: string;
  donorId: string;
  hospitalId?: string;
  bloodBankId?: string;
  bloodGroup: string;
  component?: string;
  units: number;
  donationDate: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rejected' | string;
  certificateUrl?: string;
  notes?: string;
  donor?: User;
  hospital?: Hospital;
  bloodBank?: BloodBank;
}

export interface BloodRequest {
  id: string;
  requestCode: string;
  requesterId: string;
  hospitalId?: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  bloodGroup: string;
  component?: string;
  unitsRequired: number;
  unitsFulfilled: number;
  hospitalName?: string;
  hospitalAddress?: string;
  city?: string;
  state?: string;
  regionId?: string;
  latitude?: number;
  longitude?: number;
  urgency: 'normal' | 'urgent' | 'critical' | string;
  status: 'active' | 'partially_fulfilled' | 'fulfilled' | 'cancelled' | 'expired' | string;
  requiredBy?: string;
  contactPhone?: string;
  notes?: string;
  createdAt: string;
}
