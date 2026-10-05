import type { HospitalDonorPledge } from '../types';

const PLEDGES_STORAGE_KEY = 'hemovite_hospital_donor_pledges';

export const MOCK_INITIAL_PLEDGES: HospitalDonorPledge[] = [
  {
    id: 'PLG-9102',
    hospitalId: 'HOS-001',
    hospitalName: 'Apollo Super Speciality Hospital',
    donorName: 'Rahul Verma',
    phone: '+91 98123 45678',
    age: 28,
    gender: 'Male',
    bloodGroup: 'O-',
    preferredSlot: 'Immediately / Within 2 hours',
    eligibilityConfirmed: true,
    status: 'Pending Contact',
    timestamp: '12 mins ago',
    notes: 'Responded to ICU critical emergency requirement.'
  },
  {
    id: 'PLG-9103',
    hospitalId: 'HOS-001',
    hospitalName: 'Apollo Super Speciality Hospital',
    donorName: 'Priya Mukherjee',
    phone: '+91 98765 12340',
    age: 26,
    gender: 'Female',
    bloodGroup: 'A-',
    preferredSlot: 'Today afternoon',
    eligibilityConfirmed: true,
    status: 'Contacted',
    timestamp: '45 mins ago',
    notes: 'Coordinator contacted. Awaiting hospital walk-in.'
  },
  {
    id: 'PLG-9104',
    hospitalId: 'HOS-001',
    hospitalName: 'Apollo Super Speciality Hospital',
    donorName: 'Aditya Chauhan',
    phone: '+91 94311 88990',
    age: 34,
    gender: 'Male',
    bloodGroup: 'B-',
    preferredSlot: 'Tomorrow morning',
    eligibilityConfirmed: true,
    status: 'Scheduled',
    timestamp: '2 hours ago',
    notes: 'Slot booked for Blood Bank Ward Donor Station 2.'
  },
  {
    id: 'PLG-9105',
    hospitalId: 'HOS-002',
    hospitalName: 'Raj Medical Institute & Research Centre',
    donorName: 'Sanjay Gupta',
    phone: '+91 91234 56789',
    age: 31,
    gender: 'Male',
    bloodGroup: 'O-',
    preferredSlot: 'Immediately / Within 2 hours',
    eligibilityConfirmed: true,
    status: 'Pending Contact',
    timestamp: '18 mins ago',
    notes: 'Verified voluntary donor.'
  },
  {
    id: 'PLG-9106',
    hospitalId: 'HOS-003',
    hospitalName: 'AIIMS Trauma & Multi-Specialty Centre',
    donorName: 'Vikramaditya Rao',
    phone: '+91 98101 23450',
    age: 29,
    gender: 'Male',
    bloodGroup: 'AB-',
    preferredSlot: 'Today',
    eligibilityConfirmed: true,
    status: 'Pending Contact',
    timestamp: '30 mins ago'
  },
  {
    id: 'PLG-9107',
    hospitalId: 'HOS-009',
    hospitalName: 'Fortis Escorts Hospital',
    donorName: 'Sunita Nair',
    phone: '+91 97654 32109',
    age: 27,
    gender: 'Female',
    bloodGroup: 'O-',
    preferredSlot: 'Immediately / Within 2 hours',
    eligibilityConfirmed: true,
    status: 'Pending Contact',
    timestamp: '8 mins ago'
  }
];

/**
 * Get all pledges from localStorage or fallback to initial mock data.
 * If hospitalId is provided, filter pledges for that specific hospital.
 */
export function getHospitalDonorPledges(hospitalId?: string): HospitalDonorPledge[] {
  let allPledges: HospitalDonorPledge[] = [];
  try {
    const raw = localStorage.getItem(PLEDGES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        allPledges = parsed;
      }
    }
  } catch (err) {
    console.error('Error loading donor pledges from storage:', err);
  }

  if (allPledges.length === 0) {
    allPledges = MOCK_INITIAL_PLEDGES;
    try {
      localStorage.setItem(PLEDGES_STORAGE_KEY, JSON.stringify(allPledges));
    } catch {}
  }

  if (hospitalId) {
    return allPledges.filter((p) => p.hospitalId === hospitalId);
  }
  return allPledges;
}

/**
 * Submit a new donor pledge and notify listeners
 */
export function submitDonorPledge(
  payload: Omit<HospitalDonorPledge, 'id' | 'status' | 'timestamp'>
): HospitalDonorPledge {
  const currentPledges = getHospitalDonorPledges();
  
  const generatedId = `PLG-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} (Just now)`;

  const newPledge: HospitalDonorPledge = {
    id: generatedId,
    hospitalId: payload.hospitalId,
    hospitalName: payload.hospitalName,
    donorName: payload.donorName.trim(),
    phone: payload.phone.trim(),
    age: Number(payload.age) || 25,
    gender: payload.gender || 'Male',
    bloodGroup: payload.bloodGroup,
    preferredSlot: payload.preferredSlot || 'Immediately / Within 2 hours',
    eligibilityConfirmed: payload.eligibilityConfirmed ?? true,
    status: 'Pending Contact',
    timestamp: timeStr,
    notes: payload.notes || 'Submitted via Hospital Details emergency response portal.'
  };

  const updated = [newPledge, ...currentPledges];
  try {
    localStorage.setItem(PLEDGES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hemovite_donor_pledges_updated', { detail: updated }));
  } catch (err) {
    console.error('Error saving donor pledge:', err);
  }

  return newPledge;
}

/**
 * Update the status of a donor pledge
 */
export function updatePledgeStatus(
  pledgeId: string,
  newStatus: HospitalDonorPledge['status'],
  noteUpdate?: string
): HospitalDonorPledge[] {
  const currentPledges = getHospitalDonorPledges();
  const updated = currentPledges.map((p) => {
    if (p.id === pledgeId) {
      return {
        ...p,
        status: newStatus,
        notes: noteUpdate || p.notes
      };
    }
    return p;
  });

  try {
    localStorage.setItem(PLEDGES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hemovite_donor_pledges_updated', { detail: updated }));
  } catch (err) {
    console.error('Error updating pledge status:', err);
  }

  return updated;
}
