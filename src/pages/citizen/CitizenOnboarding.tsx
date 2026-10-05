import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplet,
  User,
  Phone,
  Calendar,
  MapPin,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Activity,
  PhoneCall,
  Loader2,
} from 'lucide-react';
import { citizenApi } from '../../services/citizenApi';
import { useAuth } from '../../contexts/AuthContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const COMMON_ALLERGIES = [
  'None / No Known Allergies',
  'Penicillin / Antibiotics',
  'Aspirin / NSAIDs',
  'Latex',
  'Sulfa Drugs',
  'Pollen / Dust',
  'Food Allergies',
];

const INDIAN_STATES = [
  'Jharkhand', 'Bihar', 'West Bengal', 'Odisha', 'Delhi (NCT)',
  'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh',
  'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Punjab', 'Haryana',
  'Kerala', 'Telangana', 'Andhra Pradesh', 'Assam', 'Other'
];

export const CitizenOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { loginCitizen } = useAuth();

  // Load current Google user session
  const storedUserRaw = localStorage.getItem('hemovite_user');
  const initialUser = storedUserRaw ? JSON.parse(storedUserRaw) : {};

  // Form State
  const [fullName, setFullName] = useState(initialUser.name || '');
  const [email] = useState(initialUser.email || '');
  const [phone, setPhone] = useState(initialUser.phone || '');
  const [age, setAge] = useState<number | string>(initialUser.age || 24);
  const [gender, setGender] = useState(initialUser.gender || 'Male');
  const [bloodGroup, setBloodGroup] = useState<string>(initialUser.bloodGroup || 'O+');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['None / No Known Allergies']);
  const [customAllergies, setCustomAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [city, setCity] = useState(initialUser.city || 'Ranchi');
  const [state, setState] = useState(initialUser.state || 'Jharkhand');
  const [address, setAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [donorAvailable, setDonorAvailable] = useState(true);
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);

  // UI State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // If not logged in at all, redirect to auth
    const token = localStorage.getItem('hemovite_token');
    if (!token && !initialUser.email) {
      navigate('/citizen/auth');
    }
  }, [navigate, initialUser]);

  const toggleAllergy = (allergy: string) => {
    if (allergy === 'None / No Known Allergies') {
      setSelectedAllergies(['None / No Known Allergies']);
      return;
    }

    let updated = selectedAllergies.filter(a => a !== 'None / No Known Allergies');
    if (updated.includes(allergy)) {
      updated = updated.filter(a => a !== allergy);
      if (updated.length === 0) updated = ['None / No Known Allergies'];
    } else {
      updated.push(allergy);
    }
    setSelectedAllergies(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for emergency notifications.');
      return;
    }

    if (!bloodGroup) {
      setErrorMsg('Please select your blood group.');
      return;
    }

    const numAge = Number(age);
    if (!numAge || numAge < 16 || numAge > 85) {
      setErrorMsg('Please enter a valid age between 16 and 85 years.');
      return;
    }

    setLoading(true);

    try {
      // Build allergies summary
      const allergiesList = selectedAllergies.filter(a => a !== 'None / No Known Allergies');
      if (customAllergies.trim()) {
        allergiesList.push(customAllergies.trim());
      }
      const healthNotesStr = [
        allergiesList.length > 0 ? `Allergies: ${allergiesList.join(', ')}` : 'Allergies: None',
        medicalConditions.trim() ? `Conditions: ${medicalConditions.trim()}` : null,
      ].filter(Boolean).join(' | ');

      const userId = initialUser.id || initialUser.email || 'c-001';

      // 1. Send update to PostgreSQL Backend
      try {
        await citizenApi.updateProfile(userId, {
          fullName: fullName.trim(),
          phone: phone.trim(),
          bloodGroup,
          gender,
          dateOfBirth: new Date(new Date().getFullYear() - numAge, 0, 1).toISOString(),
          city: city.trim(),
          state: state.trim(),
          emergencyContactName: emergencyContactName.trim(),
          emergencyContactPhone: emergencyContactPhone.trim(),
          donorAvailable,
          emergencyAvailable,
          healthNotes: healthNotesStr,
          address: address.trim(),
        });
      } catch (apiErr) {
        console.warn('Backend update profile notice (using stored profile session):', apiErr);
      }

      // 2. Update local state and AuthContext
      const updatedUserObj = {
        ...initialUser,
        name: fullName.trim(),
        phone: phone.trim(),
        bloodGroup,
        gender,
        age: numAge,
        city: city.trim(),
        state: state.trim(),
        allergies: allergiesList,
        healthNotes: healthNotesStr,
        donorAvailable,
        emergencyAvailable,
      };

      localStorage.setItem('hemovite_user', JSON.stringify(updatedUserObj));
      loginCitizen({
        name: fullName.trim(),
        email: email || initialUser.email,
      });

      window.dispatchEvent(new Event('hemovite_auth_changed'));

      setIsSuccess(true);

      // 3. Smooth transition to personalized dashboard
      setTimeout(() => {
        navigate('/citizen/dashboard', { replace: true });
      }, 1400);

    } catch (err: any) {
      console.error('Failed to complete onboarding:', err);
      setErrorMsg(err.message || 'Failed to save your details. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white font-sans py-8 px-4 sm:px-6 lg:px-8">
      
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl w-full mx-auto relative z-10 space-y-6">
        
        {/* BRAND HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/30 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to HemoVite</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Complete Your <span className="text-brand-bright">Health &amp; Donor Profile</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Help us personalize your emergency blood alerts, hospital finder, and donation compatibility.
          </p>
        </div>

        {/* MAIN ONBOARDING CARD */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 backdrop-blur-xl relative overflow-hidden">
          
          {/* USER VERIFICATION BADGE */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              {initialUser.avatarUrl ? (
                <img
                  src={initialUser.avatarUrl}
                  alt={fullName}
                  className="w-12 h-12 rounded-2xl border-2 border-brand-red object-cover shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-red to-brand-deep flex items-center justify-center font-black text-lg text-white shadow-md">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div>
                <div className="font-bold text-white text-base flex items-center gap-2">
                  <span>{fullName || 'Google Verified User'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div className="text-xs text-slate-400 font-mono">{email}</div>
              </div>
            </div>

            <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Google Account Connected</span>
            </div>
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SUCCESS MODAL / BANNER */}
          {isSuccess && (
            <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white">Registration Complete!</h3>
              <p className="text-sm text-emerald-200">
                Welcome to HemoVite, <strong>{fullName}</strong>. Launching your personalized health command grid...
              </p>
            </div>
          )}

          {!isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION 1: BLOOD GROUP (HERO SELECTION) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-brand-red" />
                    <span>Your Blood Group <span className="text-brand-red">*</span></span>
                  </label>
                  <span className="text-xs text-slate-500 font-medium">Critical for emergency matching</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
                  {BLOOD_GROUPS.map((bg) => {
                    const isSelected = bloodGroup === bg;
                    return (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setBloodGroup(bg)}
                        className={`py-3.5 px-2 rounded-2xl font-black text-base transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                          isSelected
                            ? 'bg-gradient-to-b from-brand-red to-brand-deep text-white border-red-500 shadow-lg shadow-brand-red/30 scale-105'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <span>{bg}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-red-100' : 'text-slate-500'}`}>
                          {bg.includes('-') ? 'Rare' : 'Common'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: PERSONAL ESSENTIALS */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Personal Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Name <span className="text-brand-red">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm text-white font-medium placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Mobile Number <span className="text-brand-red">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm text-white font-medium placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Age (Years) <span className="text-brand-red">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="16"
                        max="85"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="24"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm text-white font-medium placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Gender <span className="text-brand-red">*</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-brand-red text-sm text-white font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: ALLERGIES & MEDICAL CONDITIONS */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>Allergies &amp; Medical Conditions</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Known Allergies / Sensitivities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_ALLERGIES.map((allergy) => {
                      const isChecked = selectedAllergies.includes(allergy);
                      return (
                        <button
                          key={allergy}
                          type="button"
                          onClick={() => toggleAllergy(allergy)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                              : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
                          }`}
                        >
                          {isChecked ? '✓ ' : '+ '}{allergy}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    value={customAllergies}
                    onChange={(e) => setCustomAllergies(e.target.value)}
                    placeholder="Other allergy (e.g. Iodine, specific medicines)"
                    className="mt-2 w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-red text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Pre-Existing Medical Conditions / Health Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    placeholder="e.g. Hypertension, regular medications, recent travel (leave blank if none)"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-red text-xs text-white placeholder-slate-500 resize-none"
                  />
                </div>
              </div>

              {/* SECTION 4: LOCATION & EMERGENCY CONTACT */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Location &amp; Emergency Guardian</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      City <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Ranchi"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm text-white font-medium placeholder-slate-500"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      State <span className="text-brand-red">*</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-brand-red text-sm text-white font-medium"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Emergency Contact Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Emergency Contact Person
                    </label>
                    <div className="relative">
                      <PhoneCall className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        placeholder="e.g. Ramesh Doe (Father/Spouse)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-red text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Emergency Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        placeholder="+91 98351 00000"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-red text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Residential Address / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. House No. 42, Circular Road, Lalpur"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-red text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* SECTION 5: DONOR PREFERENCES */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-400" />
                  <span>Donation Grid Preferences</span>
                </h3>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={donorAvailable}
                    onChange={(e) => setDonorAvailable(e.target.checked)}
                    className="w-5 h-5 rounded mt-0.5 text-brand-red accent-brand-red cursor-pointer"
                  />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>I am willing to donate blood in critical emergencies</span>
                      <span className="px-1.5 py-0.5 rounded bg-brand-red/20 text-red-300 text-[10px]">Life Saver</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Hospitals and patients with verified matching requests in your area can notify you for blood donation pledges.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emergencyAvailable}
                    onChange={(e) => setEmergencyAvailable(e.target.checked)}
                    className="w-5 h-5 rounded mt-0.5 text-brand-red accent-brand-red cursor-pointer"
                  />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      Receive real-time regional shortage telemetry alerts
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Get informed when local blood banks run critically low on your blood group ({bloodGroup}).
                    </p>
                  </div>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-black text-base shadow-xl shadow-brand-red/30 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-75 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Your Personalized Health Grid...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration &amp; Open Dashboard</span>
                      <ArrowRight className="w-5 h-5" />
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

export default CitizenOnboarding;
