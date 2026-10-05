import { useState } from 'react';
import { 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  User, 
  Phone,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface EmergencyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyRequestModal = ({ isOpen, onClose }: EmergencyRequestModalProps) => {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O-',
    units: '2',
    hospitalName: 'AIIMS New Delhi - Trauma Center',
    urgency: 'immediate',
    contactNumber: '+91 98765 43210',
    notes: 'Urgent surgery emergency. Patient in OT 3.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0B1220] border border-red-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-white relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER */}
        <div className="p-6 border-b border-red-500/20 bg-gradient-to-r from-red-950/80 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-white">
              <AlertCircle className="w-6 h-6 text-brand-bright animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Emergency Blood Request Flow</h3>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                  Priority 1
                </span>
              </div>
              <p className="text-xs text-red-200/80">
                Directly triggers nearest blood bank inventory match & verified donor alert queue.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 flex-1">
          {submitted ? (
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500 text-red-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-brand-bright" />
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black text-white">Emergency Request Broadcasted!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Request ID <strong className="text-white font-mono">#EMG-2026-9941</strong> has been verified and dispatched to 3 nearby blood banks and 28 verified {formData.bloodGroup} donors within 8 km.
                </p>
              </div>

              {/* SIMULATED LIVE TRACKER STATUS */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-3 max-w-md mx-auto">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Match Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Matching Active
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-black/40 rounded-lg">
                    <span className="text-slate-300">1. AIIMS Central Reserve</span>
                    <span className="text-emerald-400 font-bold">2 Units Reserved</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-black/40 rounded-lg">
                    <span className="text-slate-300">2. Voluntary Donors</span>
                    <span className="text-blue-400 font-bold">3 Donors Responded</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Coordinator Hotline: +91 1800-BLOOD-911</span>
                  <span className="text-white font-bold">ETA: ~18 Mins</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Patient / Case ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Patient Name / Case ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g. Ramesh Kumar (OT-3)"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Blood Group */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Required Blood Group *</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-red-500"
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(g => (
                      <option key={g} value={g}>{g} Blood</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Units */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Number of Units (Units) *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Urgency */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Urgency Level *</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="immediate">Immediate (&lt; 1 Hour / OT Emergency)</option>
                    <option value="2hours">Within 2–4 Hours</option>
                    <option value="today">Scheduled Today</option>
                  </select>
                </div>
              </div>

              {/* Hospital Location */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Hospital / Transfusion Facility Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  placeholder="e.g. AIIMS New Delhi / Max Super Speciality"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact Phone Number for Verification *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-xl flex items-center gap-2.5 text-[11px] text-red-200">
                <ShieldCheck className="w-4 h-4 text-brand-bright shrink-0" />
                <span>Zero fake-alert policy: All emergency requests are authenticated against hospital logs.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-bright to-brand-deep hover:from-red-500 hover:to-red-700 text-white font-black text-sm shadow-xl shadow-red-950/50 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-white" />
                <span>Submit Verified Emergency Request</span>
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
