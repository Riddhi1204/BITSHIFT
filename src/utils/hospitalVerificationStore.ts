import { MOCK_HOSPITAL_APPLICATIONS, REGISTERED_HOSPITALS } from '../data/mockData';
import type { Hospital, HospitalApplication } from '../types';

const APPLICATIONS_KEY = 'hemovite_hospital_applications';
const HOSPITALS_KEY = 'hemovite_registered_hospitals';

/**
 * Get all hospital verification applications from localStorage (or initial mock data)
 */
export function getHospitalApplications(): HospitalApplication[] {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading hospital applications from localStorage:', err);
  }
  // Initialize with mock applications
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(MOCK_HOSPITAL_APPLICATIONS));
  } catch {}
  return MOCK_HOSPITAL_APPLICATIONS;
}

/**
 * Save hospital verification applications to localStorage and notify listeners
 */
export function saveHospitalApplications(applications: HospitalApplication[]): void {
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    window.dispatchEvent(new CustomEvent('hemovite_applications_updated', { detail: applications }));
  } catch (err) {
    console.error('Error saving hospital applications:', err);
  }
}

/**
 * Get all registered hospitals from localStorage (or initial mock data)
 */
export function getRegisteredHospitals(): Hospital[] {
  try {
    const raw = localStorage.getItem(HOSPITALS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading registered hospitals from localStorage:', err);
  }
  // Initialize with mock hospitals
  try {
    localStorage.setItem(HOSPITALS_KEY, JSON.stringify(REGISTERED_HOSPITALS));
  } catch {}
  return REGISTERED_HOSPITALS;
}

/**
 * Save registered hospitals to localStorage and notify listeners
 */
export function saveRegisteredHospitals(hospitals: Hospital[]): void {
  try {
    localStorage.setItem(HOSPITALS_KEY, JSON.stringify(hospitals));
    window.dispatchEvent(new CustomEvent('hemovite_hospitals_updated', { detail: hospitals }));
  } catch (err) {
    console.error('Error saving registered hospitals:', err);
  }
}

export interface SubmitApplicationPayload {
  name: string;
  licenseNumber?: string;
  city: string;
  state: string;
  address: string;
  contactPerson?: string;
  email: string;
  contact: string;
  bedCapacity: number;
  icuCapacity?: string;
  bloodBankLinked?: string;
  documentName?: string;
  documentType?: string;
}

/**
 * Submit a new hospital verification request
 */
export function submitHospitalApplication(payload: SubmitApplicationPayload): HospitalApplication {
  const currentApps = getHospitalApplications();
  
  // Generate distinct ID, e.g., HOS-384
  const generatedNum = Math.floor(100 + Math.random() * 900);
  const id = `HOS-${generatedNum}`;
  const now = new Date().toISOString().split('T')[0];

  const newApp: HospitalApplication = {
    id,
    name: payload.name.trim(),
    licenseNumber: payload.licenseNumber?.trim() || `NABH-REG-${generatedNum}`,
    city: payload.city.trim(),
    state: payload.state.trim(),
    address: payload.address.trim(),
    contactPerson: payload.contactPerson?.trim() || 'Medical Superintendent',
    email: payload.email.trim(),
    contact: payload.contact.trim(),
    bedCapacity: Number(payload.bedCapacity) || 100,
    icuCapacity: payload.icuCapacity?.trim() || `${Math.round((Number(payload.bedCapacity) || 100) * 0.15)} ICU Beds`,
    bloodBankLinked: payload.bloodBankLinked?.trim() || 'Central Regional Blood Centre',
    applicationDate: now,
    status: 'Pending',
    documents: [
      {
        name: payload.documentName || 'Accreditation & State Establishment License',
        type: payload.documentType || 'Clinical Establishment Permit (Form 28-C)',
        status: 'Uploaded',
      },
    ],
    auditLog: [
      {
        action: 'Application Submitted',
        by: payload.contactPerson || 'Hospital Representative',
        date: now,
        note: `Registration requested for ${payload.name}. Pending government audit.`,
      },
    ],
  };

  const updatedApps = [newApp, ...currentApps];
  saveHospitalApplications(updatedApps);
  return newApp;
}

/**
 * Approve hospital verification request:
 * 1. Updates application status to 'Verified'
 * 2. Automatically appends hospital to active Registered Hospitals list
 */
export function approveHospitalApplication(
  applicationId: string,
  officerName = 'Dr. R. Sharma (State Health Director)'
): { application: HospitalApplication | null; hospital: Hospital | null } {
  const apps = getHospitalApplications();
  const targetApp = apps.find((a) => a.id === applicationId);

  if (!targetApp) return { application: null, hospital: null };

  const now = new Date().toISOString().split('T')[0];

  const updatedApp: HospitalApplication = {
    ...targetApp,
    status: 'Verified',
    auditLog: [
      {
        action: 'Official Verification Granted',
        by: officerName,
        date: now,
        note: 'Hospital credentials audited against State Health Registry. Facility approved as verified node.',
      },
      ...targetApp.auditLog,
    ],
  };

  const updatedApps = apps.map((a) => (a.id === applicationId ? updatedApp : a));
  saveHospitalApplications(updatedApps);

  // Append to registered hospitals if not already present
  const currentHospitals = getRegisteredHospitals();
  let createdHospital: Hospital | null = null;

  const exists = currentHospitals.some((h) => h.id === targetApp.id || h.name.toLowerCase() === targetApp.name.toLowerCase());
  if (!exists) {
    createdHospital = {
      id: targetApp.id,
      name: targetApp.name,
      city: targetApp.city,
      state: targetApp.state,
      address: targetApp.address,
      phone: targetApp.contact,
      email: targetApp.email,
      emergencyContact: targetApp.contact,
      status: 'verified',
      beds: targetApp.bedCapacity || 150,
      bedDetails: {
        total: targetApp.bedCapacity || 150,
        occupied: Math.round((targetApp.bedCapacity || 150) * 0.75),
        available: Math.round((targetApp.bedCapacity || 150) * 0.25),
      },
      bloodBankLinked: targetApp.bloodBankLinked || 'Sadar Model Blood Centre',
      icuCapacity: targetApp.icuCapacity || '24 ICU Beds',
      stock: {
        'A+': 14,
        'A-': 5,
        'B+': 18,
        'B-': 6,
        'O+': 28,
        'O-': 9,
        'AB+': 8,
        'AB-': 4,
      },
      verifiedAt: now,
      bloodRequests: {
        total: 12,
        pending: 3,
        emergency: 4,
        urgent: 3,
        fulfilled: 8,
        partiallyFulfilled: 1,
        cancelled: 0,
      },
    };

    saveRegisteredHospitals([createdHospital, ...currentHospitals]);
  }

  return { application: updatedApp, hospital: createdHospital };
}

/**
 * Reject hospital verification request
 */
export function rejectHospitalApplication(
  applicationId: string,
  reason: string,
  officerName = 'Regulatory Verification Board'
): HospitalApplication | null {
  const apps = getHospitalApplications();
  const targetApp = apps.find((a) => a.id === applicationId);

  if (!targetApp) return null;

  const now = new Date().toISOString().split('T')[0];

  const updatedApp: HospitalApplication = {
    ...targetApp,
    status: 'Rejected',
    rejectionReason: reason,
    auditLog: [
      {
        action: 'Application Rejected',
        by: officerName,
        date: now,
        note: reason,
      },
      ...targetApp.auditLog,
    ],
  };

  const updatedApps = apps.map((a) => (a.id === applicationId ? updatedApp : a));
  saveHospitalApplications(updatedApps);
  return updatedApp;
}
