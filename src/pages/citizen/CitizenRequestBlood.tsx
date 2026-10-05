import { useState } from 'react';
import { AlertCircle, Clock, MapPin, Search, Send, User, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bloodRequestApi } from '../../services/bloodRequestApi';

export const CitizenRequestBlood = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bloodGroup: '',
    units: '1',
    hospital: '',
    location: '',
    requiredDate: '',
    emergencyLevel: 'urgent',
    patientDetails: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await bloodRequestApi.create({
        requesterId: 'c-001',
        bloodGroup: formData.bloodGroup,
        unitsRequired: parseInt(formData.units) || 1,
        hospitalName: formData.hospital,
        city: formData.location,
        requiredBy: formData.requiredDate ? new Date(formData.requiredDate).toISOString() : undefined,
        urgency: formData.emergencyLevel,
        patientName: formData.patientDetails
      });

      if (res) {
        setCreatedRequest(res);
        setIsSubmitted(true);
      } else {
        setErrorMessage('Unable to submit request');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit blood request to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-2xl max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Request Submitted</h2>
        {createdRequest?.requestCode && (
          <p className="text-xs font-mono text-emerald-400 font-bold mb-4">
            Request Code: {createdRequest.requestCode}
          </p>
        )}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left mb-8 space-y-4">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">1</span>
            <span>Your request has been stored in PostgreSQL database.</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">2</span>
            <span>Connected hospitals and blood banks are monitoring real-time requirements.</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs">3</span>
            <span>Suitable donors and blood banks will be notified once matched.</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/citizen/dashboard" className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl transition-all">
            Return to Dashboard
          </Link>
          <button onClick={() => setIsSubmitted(false)} className="px-6 py-3 bg-brand-red hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-brand-red/20 transition-all cursor-pointer">
            Create Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
      
      <div className="bg-brand-red/10 border border-brand-red/20 rounded-2xl p-4 mb-8 flex gap-4 items-start">
        <AlertCircle className="w-6 h-6 text-brand-red shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-red-200">Important Notice</h3>
          <p className="text-xs text-red-300/80 mt-1">
            Your request connects directly to PostgreSQL live clinical supply database. Please provide accurate details. Misuse of the emergency system may lead to account suspension.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 mb-6 rounded-2xl bg-red-950/60 border border-red-500 text-red-200 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-2xl font-black text-white mb-6">Emergency Request Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Blood Group Needed *</label>
              <select
                required
                value={formData.bloodGroup}
                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900 border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none appearance-none font-bold cursor-pointer"
              >
                <option value="" disabled>Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Units Required *</label>
              <input
                type="number"
                min="1"
                max="10"
                required
                value={formData.units}
                onChange={(e) => setFormData({...formData, units: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900 border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Hospital / Clinic *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="E.g. City Hospital"
                  value={formData.hospital}
                  onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">City / Location *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Area, City"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Required By (Date & Time) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Clock className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="datetime-local"
                  required
                  value={formData.requiredDate}
                  onChange={(e) => setFormData({...formData, requiredDate: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Emergency Level *</label>
              <div className="flex rounded-xl overflow-hidden border border-white/10">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, emergencyLevel: 'critical'})}
                  className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${formData.emergencyLevel === 'critical' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                >
                  🔴 Critical
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, emergencyLevel: 'urgent'})}
                  className={`flex-1 py-3 text-xs font-bold transition-colors border-x border-white/10 cursor-pointer ${formData.emergencyLevel === 'urgent' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                >
                  🟠 Urgent
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, emergencyLevel: 'normal'})}
                  className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${formData.emergencyLevel === 'normal' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                >
                  🟡 Normal
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 ml-1">Patient Name / Details (Optional)</label>
            <div className="relative">
              <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <textarea
                rows={3}
                placeholder="Any additional context for donors..."
                value={formData.patientDetails}
                onChange={(e) => setFormData({...formData, patientDetails: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-red hover:bg-red-600 disabled:opacity-50 text-white font-black text-lg rounded-xl shadow-lg shadow-brand-red/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Transmitting Request...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
