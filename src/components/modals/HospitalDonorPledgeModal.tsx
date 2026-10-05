import { useState } from 'react';
import {
  X,
  Droplet,
  HeartHandshake,
  User,
  Phone,
  CheckCircle2,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { submitDonorPledge } from '../../utils/hospitalDonorPledgeStore';

interface HospitalDonorPledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
  hospitalName: string;
  defaultGroup?: string;
  emergencyGroups?: string[];
  onSuccess?: (donorName: string, bloodGroup: string) => void;
}

export const HospitalDonorPledgeModal = ({
  isOpen,
  onClose,
  hospitalId,
  hospitalName,
  defaultGroup = 'O-',
  emergencyGroups = ['O-', 'A-', 'B-', 'AB-'],
  onSuccess
}: HospitalDonorPledgeModalProps) => {
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('26');
  const [gender, setGender] = useState('Male');
  const [selectedGroup, setSelectedGroup] = useState(defaultGroup || 'O-');
  const [preferredSlot, setPreferredSlot] = useState('Immediately / Within 2 hours');
  const [eligibilityConfirmed, setEligibilityConfirmed] = useState(true);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const resetForm = () => {
    setDonorName('');
    setPhone('');
    setAge('26');
    setGender('Male');
    setSelectedGroup(defaultGroup || 'O-');
    setPreferredSlot('Immediately / Within 2 hours');
    setEligibilityConfirmed(true);
    setNotes('');
    setErrorMessage('');
    setIsSubmitting(false);
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!donorName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!age || Number(age) < 18 || Number(age) > 65) {
      setErrorMessage('Voluntary blood donors must be between 18 and 65 years old.');
      return;
    }
    if (!eligibilityConfirmed) {
      setErrorMessage('Please confirm your eligibility criteria.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        submitDonorPledge({
          hospitalId,
          hospitalName,
          donorName,
          phone,
          age: Number(age),
          gender,
          bloodGroup: selectedGroup,
          preferredSlot,
          eligibilityConfirmed,
          notes: notes.trim() || 'Voluntary donor pledge received from Hospital Details emergency page.'
        });

        setIsSubmitting(false);
        setIsSuccess(true);
        if (onSuccess) {
          onSuccess(donorName, selectedGroup);
        }
      } catch {
        setIsSubmitting(false);
        setErrorMessage('Failed to submit donation pledge. Please try again.');
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#0B1220] border border-white/20 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl text-white relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 sticky top-0 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-deep flex items-center justify-center text-white shadow-md shadow-brand-red/30">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white leading-none">
                  Pledge Blood Donation
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">
                  {hospitalId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 truncate max-w-sm">
                Direct Emergency Donor Dispatch • {hospitalName}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-6">
          {isSuccess ? (
            /* SUCCESS MESSAGE */
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-xl font-black text-white">
                  Donation Pledge Received!
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you, <strong className="text-white">{donorName}</strong>! Your offer to donate <span className="font-bold text-brand-bright font-mono">{selectedGroup}</span> blood for <strong className="text-white">{hospitalName}</strong> has been routed to the hospital's clinical coordination dashboard.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-slate-400 text-left space-y-1.5 mt-4">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Target Facility:</span>
                    <span className="text-white font-semibold">{hospitalName}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Pledged Group:</span>
                    <span className="text-brand-bright font-bold font-mono">{selectedGroup}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Availability Slot:</span>
                    <span className="text-slate-200 font-medium">{preferredSlot}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Next Action:</span>
                    <span className="text-emerald-400 font-bold">Hospital coordinator will call {phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-center">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* PLEDGE FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. BLOOD GROUP SELECTOR (HIGHLIGHTING EMERGENCY GROUPS) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-brand-red" />
                    <span>Select Your Blood Group *</span>
                  </span>
                  <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Red badges = Priority Shortages</span>
                  </span>
                </label>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {bloodGroups.map((grp) => {
                    const isEmergency = emergencyGroups.includes(grp);
                    const isSelected = selectedGroup === grp;

                    return (
                      <button
                        key={grp}
                        type="button"
                        onClick={() => setSelectedGroup(grp)}
                        className={`p-2.5 rounded-xl border text-center transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-br from-brand-red to-brand-deep border-white/60 text-white shadow-lg ring-2 ring-brand-red/40 scale-105'
                            : isEmergency
                            ? 'bg-red-950/40 border-red-500/50 text-red-300 hover:border-red-400 hover:bg-red-900/30'
                            : 'bg-slate-900/80 border-white/15 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <span className="font-mono font-black text-sm">{grp}</span>
                        {isEmergency && !isSelected && (
                          <span className="text-[8px] font-bold text-red-400 uppercase tracking-tighter mt-0.5">
                            Critical
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. DONOR IDENTITY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Phone / WhatsApp Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>
              </div>

              {/* 3. AGE, GENDER & PREFERRED SLOT */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Age * (18-65)</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Availability Slot *</label>
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red"
                  >
                    <option value="Immediately / Within 2 hours">Within 2 Hours (Urgent)</option>
                    <option value="Today afternoon">Today Afternoon</option>
                    <option value="Tomorrow morning">Tomorrow Morning</option>
                    <option value="This Weekend">This Weekend</option>
                  </select>
                </div>
              </div>

              {/* OPTIONAL NOTES */}
              <div>
                <label className="text-xs text-slate-300 mb-1 block">Additional Note for Blood Bank (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Can reach hospital trauma center within 45 minutes"
                  className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* 4. ELIGIBILITY CONFIRMATION */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eligibilityConfirmed}
                    onChange={(e) => setEligibilityConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-brand-red focus:ring-brand-red w-4 h-4 bg-slate-900 border-white/30"
                  />
                  <div className="text-xs text-slate-300 leading-snug">
                    <span className="font-semibold text-white">Donor Health Declaration: </span>
                    I confirm that I am feeling healthy, weigh &gt; 45 kg, and have not donated whole blood in the last 90 days.
                  </div>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-glow-red flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Pledge...</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-4 h-4" />
                      <span>Confirm & Pledge Blood to {hospitalName}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
