import { useState } from 'react';
import { X, Droplet, CheckCircle2 } from 'lucide-react';
import type { BloodDonation } from '../../types';

interface RecordDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecord: (donation: BloodDonation) => void;
}

export const RecordDonationModal = ({
  isOpen,
  onClose,
  onRecord,
}: RecordDonationModalProps) => {
  const [donorName, setDonorName] = useState('');
  const [donorId, setDonorId] = useState(`DNR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [units, setUnits] = useState('1');
  const [hemoglobin, setHemoglobin] = useState('14.2 g/dL');
  const [screeningStatus, setScreeningStatus] = useState('Screening passed (HIV, Hep-B, Hep-C Negative)');
  const [status, setStatus] = useState<BloodDonation['status']>('Approved');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDonation: BloodDonation = {
      id: `DON-${Math.floor(5000 + Math.random() * 4000)}`,
      donorName: donorName || 'Anonymous Volunteer Donor',
      donorId,
      bloodGroup,
      units: parseInt(units, 10) || 1,
      donationDate: 'Today, Just now',
      status,
      screeningStatus,
      hemoglobin,
      notes: notes || 'Standard whole-blood volunteer collection',
    };

    onRecord(newDonation);
    onClose();
  };

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative space-y-5">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <Droplet className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">+ Record New Blood Donation</h3>
            <p className="text-xs text-slate-400">Register volunteer donor collection and add to testing ledger</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Donor Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Donor Full Name *</label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Alok Mishra"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white focus:border-brand-red focus:outline-none"
              />
            </div>

            {/* Donor ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Donor ID</label>
              <input
                type="text"
                value={donorId}
                onChange={(e) => setDonorId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono font-bold text-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Blood Group */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Blood Group *</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs font-bold text-white"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* Units */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Units (Bag) *</label>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs font-bold text-white text-center"
              />
            </div>

            {/* Hemoglobin */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Hb Level *</label>
              <input
                type="text"
                required
                value={hemoglobin}
                onChange={(e) => setHemoglobin(e.target.value)}
                placeholder="14.2 g/dL"
                className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Initial Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Initial Pipeline Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
              >
                <option value="Approved">Approved (Ready for cold-chain storage)</option>
                <option value="Tested">Tested (Serology passed, lab QA in progress)</option>
                <option value="Collected">Collected (Sample taken for ELISA)</option>
                <option value="Stored">Stored (Directly added to reserve)</option>
              </select>
            </div>

            {/* Screening Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Screening Details</label>
              <input
                type="text"
                value={screeningStatus}
                onChange={(e) => setScreeningStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Collection Notes / Camp Info</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Regular volunteer donor, 350ml CPDA-1 triple bag"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-500"
            />
          </div>

          {/* ACTIONS */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record & Store Unit</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
