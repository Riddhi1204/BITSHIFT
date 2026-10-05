import { useState } from 'react';
import {
  X,
  Building2,
  FileCheck,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  User,
  Bed,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { submitHospitalApplication } from '../../utils/hospitalVerificationStore';

interface HospitalVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (hospitalName: string) => void;
}

export const HospitalVerificationModal = ({
  isOpen,
  onClose,
  onSuccess
}: HospitalVerificationModalProps) => {
  const [hospitalName, setHospitalName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Jharkhand');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bedCount, setBedCount] = useState('150');
  const [icuCapacity, setIcuCapacity] = useState('24 ICU Beds');
  const [bloodBankLinked, setBloodBankLinked] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>('NABH_Accreditation_Permit_2026.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setHospitalName('');
    setLicenseNumber('');
    setCity('');
    setAddress('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setBedCount('150');
    setIcuCapacity('24 ICU Beds');
    setBloodBankLinked('');
    setAttachedFileName('NABH_Accreditation_Permit_2026.pdf');
    setErrorMessage('');
    setIsSuccess(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!hospitalName.trim()) {
      setErrorMessage('Please enter the Hospital / Institution Name.');
      return;
    }
    if (!licenseNumber.trim()) {
      setErrorMessage('Please enter the License / Registration Number.');
      return;
    }
    if (!city.trim() || !address.trim()) {
      setErrorMessage('Please provide complete city and address details.');
      return;
    }
    if (!contactPerson.trim()) {
      setErrorMessage('Please enter the primary contact person name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid official email address.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit emergency telephone number.');
      return;
    }
    if (!bedCount || Number(bedCount) <= 0) {
      setErrorMessage('Please enter a valid bed count.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        submitHospitalApplication({
          name: hospitalName,
          licenseNumber,
          city,
          state,
          address,
          contactPerson,
          email,
          contact: phone,
          bedCapacity: Number(bedCount),
          icuCapacity,
          bloodBankLinked: bloodBankLinked.trim() || 'Central Regional Blood Reserve',
          documentName: attachedFileName || 'Accreditation & State License Copy',
          documentType: 'NABH / State Drug Controller Permit (Form 28-C)',
        });

        setIsSubmitting(false);
        setIsSuccess(true);
        if (onSuccess) {
          onSuccess(hospitalName);
        }
      } catch {
        setIsSubmitting(false);
        setErrorMessage('Failed to submit application. Please try again.');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#0B1220] border border-white/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-white relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 sticky top-0 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-md shadow-brand-red/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white leading-none">Apply for Hospital Verification</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Official Network Onboarding
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Connect your healthcare facility to the HemoVite National Blood Supply & Telemetry Grid.
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

        {/* BODY */}
        <div className="p-6">
          {isSuccess ? (
            /* SUCCESS STATE */
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-xl font-black text-white">
                  Verification Application Submitted!
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your application for <strong className="text-white">{hospitalName}</strong> has been received by the Government Transfusion Authority and is marked as <span className="text-amber-400 font-bold">Pending Verification</span>.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-slate-400 text-left space-y-1 mt-4">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Application Status:</span>
                    <span className="text-amber-400 font-bold">Pending Government Review</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Jurisdiction:</span>
                    <span className="text-slate-200">{city}, {state}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Authority Queue:</span>
                    <span className="text-emerald-400 font-semibold">Government Blood Network Dashboard</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
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
            /* REGISTRATION FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. INSTITUTION DETAILS */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-red" />
                  <span>1. Hospital & Accreditation Information</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Hospital / Institution Name *</label>
                    <input
                      type="text"
                      required
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      placeholder="e.g. Apex Multi-Specialty Hospital"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">License / Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. NABH-HOSP-2026-JH09"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>
              </div>

              {/* 2. LOCATION */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-red" />
                  <span>2. Facility Address & State Jurisdiction</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-300 mb-1 block">Full Facility Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, Landmark, Ward & Pincode"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">City / District *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Ranchi"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">State / UT *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red"
                    >
                      {[
                        'Jharkhand',
                        'Delhi',
                        'West Bengal',
                        'Karnataka',
                        'Maharashtra',
                        'Bihar',
                        'Rajasthan',
                        'Uttar Pradesh',
                        'Telangana',
                        'Tamil Nadu',
                        'Gujarat',
                        'Other State'
                      ].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Linked Blood Bank Hub (Optional)</label>
                    <input
                      type="text"
                      value={bloodBankLinked}
                      onChange={(e) => setBloodBankLinked(e.target.value)}
                      placeholder="e.g. Sadar Model Blood Centre"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>
              </div>

              {/* 3. CAPACITY & CONTACT */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-red" />
                  <span>3. Capacity & Authorized Contact Person</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Total Bed Count *</label>
                    <div className="relative">
                      <Bed className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="number"
                        required
                        min="10"
                        max="5000"
                        value={bedCount}
                        onChange={(e) => setBedCount(e.target.value)}
                        placeholder="150"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-300 mb-1 block">Contact Person (Medical Superintendent / Officer) *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="Dr. Anand Verma (Medical Director)"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Official Healthcare Email *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@hospital.org"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Emergency Phone Number *</label>
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
              </div>

              {/* 4. DOCUMENT ATTACHMENT */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-brand-red" />
                  <span>4. Accreditation Certificate / Establishment Permit</span>
                </label>

                <div className="border-2 border-dashed border-white/20 hover:border-brand-red/60 rounded-2xl p-4 text-center space-y-2 bg-white/5 transition-all">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs text-slate-300">
                    <label className="text-brand-bright font-bold cursor-pointer hover:underline">
                      Click to browse or upload certificate
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-slate-400 block text-[11px] mt-0.5">
                      Supports PDF, PNG, JPG (Form 28-C / NABH Accreditation, max 10MB)
                    </span>
                  </div>

                  {attachedFileName && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono font-medium">
                      <FileText className="w-4 h-4 text-brand-bright" />
                      <span>{attachedFileName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-4">
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
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-glow-red flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Application for Government Review</span>
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
