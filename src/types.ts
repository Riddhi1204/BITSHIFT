export type UserRole = 'hospital' | 'blood_bank' | 'government' | 'citizen';

export interface BloodStock {
  group: string;
  currentUnits: number;
  predictedDemand: number;
  shortageRisk: number; // 0 - 100
  status: 'Normal' | 'Moderate' | 'Critical';
  expectedDays: number;
  recommendation: string;
}

export interface FactorContribution {
  name: string;
  impact: string;
  direction: 'up' | 'down';
  description: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'Hospital' | 'Blood Bank';
  location: string;
  city: string;
  distance: string;
  verified: boolean;
  phone: string;
  stock: Record<string, number>;
}

export interface HospitalBloodGroupRequirement {
  required: number;
  available: number;
  urgency: 'critical' | 'emergency' | 'urgent' | 'normal';
  patients?: number;
  requiredWithin?: string;
}

export interface HospitalBedStats {
  total: number;
  occupied: number;
  available: number;
}

export interface HospitalBloodRequestStats {
  total: number;
  pending: number;
  emergency: number;
  urgent: number;
  fulfilled: number;
  partiallyFulfilled: number;
  cancelled: number;
}

export interface HospitalPublicRequest {
  id: string; // e.g. "REQ-1024"
  bloodGroup: string; // e.g. "O-"
  unitsRequired: number;
  urgency: 'critical' | 'emergency' | 'urgent' | 'normal';
  requiredBy: string; // e.g. "Within 2 Hours"
  status: 'Searching' | 'Partially Fulfilled' | 'Pending' | 'Dispatched' | 'Fulfilled';
}

export interface HospitalPatientStats {
  totalRequiringBlood: number;
  emergency: number;
  urgent: number;
  normal: number;
}

export interface Hospital {
  id: string; // e.g. "HOS-001"
  name: string; // e.g. "Raj Hospital"
  city: string; // e.g. "Ranchi"
  state: string; // e.g. "Jharkhand"
  address: string;
  phone: string;
  email: string;
  emergencyContact: string;
  status: 'verified' | 'active' | 'pending';
  beds: number;
  bedDetails?: HospitalBedStats;
  bloodBankLinked: string;
  linkedBloodBankId?: string;
  icuCapacity: string;
  stock: Record<string, number>;
  logo?: string;
  verifiedAt: string;
  bloodRequirements?: Record<string, HospitalBloodGroupRequirement>;
  bloodRequests?: HospitalBloodRequestStats;
  recentPublicRequests?: HospitalPublicRequest[];
  patientStats?: HospitalPatientStats;
}

export interface BloodBank {
  id: string; // e.g. "BB-001"
  name: string; // e.g. "RIMS Blood Bank"
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  status: 'operational' | 'maintenance' | 'temporarily_closed';
  verified: boolean;
  inventory: Record<string, number>; // "A+": 42, "A-": 12, etc.
  reservedStock?: Record<string, number>;
  expiredStock?: Record<string, number>;
  totalUnits: number;
  lastUpdated: string;
  operatingHours: string;
  emergencyContact: string;
  distance?: string;
  adminEmail?: string;
  licenseNo?: string;
  organizationType?: 'Government' | 'Charitable NGO' | 'Red Cross / Rotary' | 'Hospital Hub';
  ngoPartner?: boolean;
  initiative?: string;
}

export interface BloodDonation {
  id: string;
  donorName: string;
  donorId: string;
  bloodGroup: string;
  units: number;
  donationDate: string;
  status: 'Collected' | 'Tested' | 'Approved' | 'Rejected' | 'Stored';
  screeningStatus?: string;
  notes?: string;
  hemoglobin?: string;
}

export interface HospitalBloodRequest {
  id: string;
  hospitalName: string;
  hospitalId: string;
  bloodGroup: string;
  unitsRequired: number;
  urgency: 'emergency' | 'urgent' | 'normal';
  requestedTime: string;
  requiredBy: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Dispatched' | 'Fulfilled';
  targetWard?: string;
  patientDetails?: string;
  contactPhone?: string;
}

export interface DonorProfile {
  id: string;
  name: string;
  bloodGroup: string;
  phone: string;
  email: string;
  city: string;
  lastDonation: string;
  totalDonations: number;
  eligibility: 'eligible' | 'due_soon' | 'not_eligible';
  nextEligibleDate: string;
  gender: string;
  age: number;
}

export interface ExpiryAlertItem {
  id: string;
  batchId: string;
  bloodGroup: string;
  units: number;
  collectionDate: string;
  expiryDate: string;
  daysRemaining: number;
  storageUnit: string;
}

export interface BloodBankNotification {
  id: string;
  type: 'critical_stock' | 'emergency_request' | 'donation' | 'expiry' | 'hospital_request' | 'fulfilled';
  title: string;
  message: string;
  time: string;
  read: boolean;
  urgency?: 'high' | 'medium' | 'low';
}

export interface GovernmentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  state: string;
  district: string;
  designation: string;
  authorityId?: string;
  role: 'state_admin' | 'national_admin' | 'nodal_officer';
  verificationStatus: 'Pending Verification' | 'Verified' | 'Pending Government Verification';
  verifiedAt?: string;
}

export interface HospitalApplication {
  id: string;
  name: string;
  city: string;
  state: string;
  contact: string;
  email: string;
  address: string;
  bedCapacity: number;
  icuCapacity: string;
  bloodBankLinked: string;
  linkedBloodBankId?: string;
  applicationDate: string;
  status: 'Pending' | 'Verified' | 'Rejected' | 'Under Review';
  rejectionReason?: string;
  requestedInfoNote?: string;
  documents: { name: string; type: string; status: 'Verified' | 'Pending' | 'Uploaded'; url?: string }[];
  auditLog: { action: string; by: string; date: string; note?: string }[];
  stock?: Record<string, number>;
  requirements?: Record<string, { required: number; available: number; urgency: string }>;
}

export interface BloodHotspot {
  id: string;
  city: string;
  state: string;
  bloodGroup: string;
  unitsRequired: number;
  unitsAvailable: number;
  totalShortage: number;
  emergencyRequests: number;
  hospitalsAffected: number;
  patientsAffected: number;
  severity: 'Critical' | 'High' | 'Moderate' | 'Stable';
  aiShortageRisk: string; // e.g. "Critical — 92% (Demo Prediction)"
  mostRequiredGroup: string;
  bloodGroupShortages: Record<string, { required: number; available: number; urgency: 'Critical' | 'High' | 'Moderate' }>;
  urgencyWindow: string;
  lastUpdated: string;
  actionPlan?: string;
  latitude?: number;
  longitude?: number;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  bloodGroup: string;
  units: number;
  city: string;
  state: string;
  centerName: string;
  date: string;
  donationType: 'Emergency Dispatch' | 'Voluntary Camp' | 'Walk-In Regular' | 'Plateletpheresis';
  status: 'Stored' | 'Dispatched' | 'Tested';
}

export interface RegionalBloodSupply {
  id: string;
  region: string;
  state: string;
  requiredUnits: number;
  availableUnits: number;
  shortage: number;
  surplus: number;
  criticalGroups: string[];
  hospitalCount: number;
  bloodBankCount: number;
  status: 'critical' | 'low' | 'healthy';
  supplyCoverage: number;
}

export interface GovernmentAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  priority?: 'Critical' | 'High' | 'Medium' | 'Information';
  region: string;
  time: string;
  hotspotId?: string;
  hospitalId?: string;
  resolved: boolean;
}


