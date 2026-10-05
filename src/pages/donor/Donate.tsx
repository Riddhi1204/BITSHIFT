import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Droplet, 
  ArrowLeft, 
  Building2, 
  AlertTriangle, 
  AlertCircle,
  Clock, 
  CheckCircle2, 
  HeartHandshake, 
  Phone, 
  MapPin, 
  Calendar, 
  Send, 
  ArrowRight,
  Sparkles,
  Info,
  Lock
} from 'lucide-react';
import { REGISTERED_HOSPITALS } from '../../data/mockData';

export const Donate = () => {
  const [searchParams] = useSearchParams();

  // Selected hospital from query parameter, or fallback to first hospital
  const hospitalIdParam = searchParams.get('hospitalId');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(
    hospitalIdParam || 'HOS-001'
  );

  const hospital = useMemo(() => {
    return (
      REGISTERED_HOSPITALS.find((h) => h.id === selectedHospitalId) ||
      REGISTERED_HOSPITALS[0]
    );
  }, [selectedHospitalId]);

  // Form State
  const [fullName, setFullName] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('O-');
  const [age, setAge] = useState<string>('28');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(hospital.city);
  const [lastDonation, setLastDonation] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [availability, setAvailability] = useState<'now' | 'emergency' | 'not_available'>('now');
  const [contactMethod, setContactMethod] = useState<'phone' | 'whatsapp' | 'sms'>('phone');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [volunteerRefId, setVolunteerRefId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Hospital Emergency Requirements
  const emergencyReqs = useMemo(() => {
    if (!hospital.bloodRequirements) return [];
    return Object.entries(hospital.bloodRequirements).filter(([_, data]) => {
      const shortage = Math.max(0, data.required - data.available);
      return data.urgency === 'emergency' || data.urgency === 'critical' || shortage > 0;
    });
  }, [hospital]);

  // Matching check for selected blood group
  const groupRequirement = hospital.bloodRequirements?.[selectedBloodGroup];
  const groupShortage = groupRequirement
    ? Math.max(0, groupRequirement.required - groupRequirement.available)
    : 0;
  
  const isEmergencyMatch = 
    groupRequirement && 
    (groupRequirement.urgency === 'critical' || 
     groupRequirement.urgency === 'emergency' || 
     groupShortage > 0);

  // Other hospitals needing this blood group
  const otherHospitalsNeeding = useMemo(() => {
    if (!selectedBloodGroup) return [];
    return REGISTERED_HOSPITALS.filter((h) => {
      if (h.id === hospital.id) return false;
      const req = h.bloodRequirements?.[selectedBloodGroup];
      return req && (req.urgency === 'critical' || req.urgency === 'emergency' || req.required > req.available);
    }).slice(0, 3);
  }, [selectedBloodGroup, hospital.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please enter a valid phone number for emergency verification.');
      return;
    }
    if (!confirmed) {
      setErrorMessage('Please confirm that the information provided is correct.');
      return;
    }

    // Generate reference ID and switch to success view
    const refCode = `VOL-${selectedBloodGroup.replace('+', 'P').replace('-', 'N')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    setVolunteerRefId(refCode);
    setIsSubmitted(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-brand-red selection:text-white">
      
      {/* TOP HEADER */}
      <header className="bg-[#0B1220] text-white border-b border-white/10 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to={`/hospital/${hospital.id}`}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {hospital.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-sm">
              <Droplet className="w-4 h-4 fill-current" />
            </div>
            <span className="text-base font-black text-white">
              Hemo<span className="text-brand-bright">Vite</span>
            </span>
          </div>

          <Link
            to="/hospitals"
            className="text-xs text-slate-300 hover:text-white transition-colors hidden sm:block font-medium"
          >
            All Hospitals
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* PAGE TITLE & SUBTITLE */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100 text-brand-red text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Emergency Volunteer Registry</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Donate Blood & Help Save Lives
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Your donation can help fulfill an urgent blood requirement.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* SUCCESS CONFIRMATION STATE */}
        {/* ========================================================================= */}
        {isSubmitted ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-10 shadow-card-elevated text-center space-y-6 animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

            <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                Reference ID: {volunteerRefId}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                🩸 Thank You for Volunteering!
              </h2>

              <p className="text-sm text-slate-600">
                Your donation offer has been registered for clinical emergency dispatch.
              </p>
            </div>

            {/* CONFIRMATION SUMMARY CARD */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 max-w-md mx-auto text-left space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Target Hospital:</span>
                <span className="font-bold text-slate-900">{hospital.name}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-mono font-black text-brand-red bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {selectedBloodGroup}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Current Hospital Need:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {groupShortage > 0 ? `${groupShortage} Units Shortage` : 'Emergency Reserve'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span>🟡 Awaiting Hospital/Blood Bank Confirmation</span>
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">Donor Contact:</span>
                <span className="font-mono text-slate-700">{phone}</span>
              </div>
            </div>

            {/* PRIVACY & SECURITY STATEMENT */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 max-w-md mx-auto text-xs text-blue-900 flex items-start gap-3 text-left">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Your contact information may be shared with the authorized hospital/blood bank only for this blood request.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              <Link
                to={`/hospital/${hospital.id}`}
                className="w-full sm:w-1/2 py-3 px-4 bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Emergency Requests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFullName('');
                  setPhone('');
                  setConfirmed(false);
                }}
                className="w-full sm:w-1/2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Register Another Donor
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* DONOR REGISTRATION FORM & MATCHING VIEW */
          /* ========================================================================= */
          <div className="space-y-6">
            
            {/* 1. TARGET HOSPITAL CONTEXT CARD */}
            <div className="bg-[#0B1220] text-white rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-red flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Target Healthcare Institution
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {hospital.name}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                      <span className="font-mono text-red-300">ID: {hospital.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-red" />
                        <span>{hospital.city}, {hospital.state}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Change hospital dropdown */}
                <div className="shrink-0">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    Select Hospital:
                  </label>
                  <select
                    value={selectedHospitalId}
                    onChange={(e) => {
                      setSelectedHospitalId(e.target.value);
                      const target = REGISTERED_HOSPITALS.find((h) => h.id === e.target.value);
                      if (target) setCity(target.city);
                    }}
                    className="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red w-full sm:w-auto"
                  >
                    {REGISTERED_HOSPITALS.map((h) => (
                      <option key={h.id} value={h.id} className="bg-slate-900 text-white">
                        {h.name} ({h.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Emergency Blood Requirements Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-brand-bright" />
                  <span>Current Emergency Blood Requirements at {hospital.name}:</span>
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                  {emergencyReqs.map(([group, data]) => {
                    const shortage = Math.max(0, data.required - data.available);
                    return (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setSelectedBloodGroup(group)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                          selectedBloodGroup === group
                            ? 'bg-brand-red text-white border-brand-red ring-2 ring-red-400'
                            : 'bg-white/10 text-slate-200 border-white/15 hover:bg-white/20'
                        }`}
                      >
                        <span className="font-mono">{group}</span>
                        <span className="text-[11px] opacity-90">{shortage} Units Short</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. SMART BLOOD GROUP MATCHING AREA */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-card-soft space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-red" />
                  <span>1. Select Your Blood Group for Real-Time Matching</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  We check your blood group against live surgery and trauma requisitions at {hospital.name}.
                </p>
              </div>

              {/* 8 Blood Group Selector Buttons */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                {bloodGroups.map((grp) => {
                  const isMatch = emergencyReqs.some(([g]) => g === grp);
                  const isSelected = selectedBloodGroup === grp;

                  return (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setSelectedBloodGroup(grp)}
                      className={`p-3 rounded-2xl border text-center transition-all duration-200 relative ${
                        isSelected
                          ? 'bg-gradient-to-br from-brand-red to-brand-deep text-white border-brand-red shadow-md scale-105'
                          : 'bg-slate-50 hover:bg-red-50/50 text-slate-900 border-slate-200 hover:border-red-200'
                      }`}
                    >
                      {isMatch && (
                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                      )}
                      <span className="block font-mono font-black text-base sm:text-lg">{grp}</span>
                      <span className={`text-[10px] font-bold block mt-0.5 ${isSelected ? 'text-red-100' : isMatch ? 'text-red-600' : 'text-slate-400'}`}>
                        {isMatch ? 'Critical' : 'Normal'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* MATCHING FEEDBACK BOX */}
              {isEmergencyMatch ? (
                /* MATCH FOUND ALERT */
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3 text-xs animate-fadeIn">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                      <span className="text-base">🚨</span>
                      <span>Critical Need Match: {selectedBloodGroup} Blood is urgently needed!</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-red-600 text-white rounded-full font-black text-[10px] uppercase animate-pulse">
                      {groupRequirement?.urgency.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-red-800">
                    <strong className="text-slate-900">{hospital.name}</strong> currently has a deficit for <strong className="font-mono">{selectedBloodGroup}</strong> blood:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-red-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Required</span>
                      <span className="font-mono font-black text-slate-900 text-sm">{groupRequirement?.required} Units</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-red-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Available</span>
                      <span className="font-mono font-bold text-slate-700 text-sm">{groupRequirement?.available} Units</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-red-200 text-center">
                      <span className="text-[10px] font-bold text-red-600 uppercase block">Shortage</span>
                      <span className="font-mono font-black text-brand-bright text-sm">{groupShortage} Units</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-red-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Required In</span>
                      <span className="font-bold text-red-700 text-xs flex items-center justify-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{groupRequirement?.requiredWithin ?? '2 Hours'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-red-700 font-medium pt-1">
                    Patients waiting: <strong className="font-mono font-bold text-slate-900">{groupRequirement?.patients ?? 2}</strong>. Your donation can save lives today.
                  </div>
                </div>
              ) : (
                /* NO CURRENT EMERGENCY REQUIREMENT */
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3 text-xs animate-fadeIn">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>No Emergency Shortage for {selectedBloodGroup} at {hospital.name}</span>
                  </div>

                  <p className="text-amber-800 leading-relaxed">
                    Thank you for offering to donate. Your blood group is not currently required for this hospital's emergency requests.
                  </p>

                  {otherHospitalsNeeding.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-amber-200/60">
                      <span className="font-bold text-slate-800 block text-xs">
                        Other connected hospitals currently needing {selectedBloodGroup}:
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {otherHospitalsNeeding.map((h) => (
                          <button
                            key={h.id}
                            type="button"
                            onClick={() => {
                              setSelectedHospitalId(h.id);
                              setCity(h.city);
                            }}
                            className="bg-white hover:bg-red-50 text-slate-800 hover:text-brand-red border border-amber-200 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm"
                          >
                            <span>{h.name}</span>
                            <ArrowRight className="w-3 h-3 text-brand-red" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-600 pt-1">
                    You can still register below to be added to HemoVite's voluntary backup donor registry.
                  </p>
                </div>
              )}
            </div>

            {/* 3. DONOR INFORMATION FORM */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card-soft space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-brand-red fill-current" />
                  <span>2. Complete Your Donor Volunteer Registration</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  All personal data is encrypted and shared only with verified hospital blood coordinators.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Full Name <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ankit Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Phone Number (for verification) <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Age (Eligible: 18 - 65 yrs) <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="28"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-all font-mono"
                  />
                </div>

                {/* City / Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    City / Current Location <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Ranchi, Jharkhand"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-all"
                    />
                  </div>
                </div>

                {/* Last Blood Donation Date */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">
                      Last Blood Donation Date
                    </label>
                    <label className="text-xs text-slate-600 font-medium flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFirstTime}
                        onChange={(e) => setIsFirstTime(e.target.checked)}
                        className="rounded border-slate-300 text-brand-red focus:ring-brand-red"
                      />
                      <span>First-time donor (Never donated before)</span>
                    </label>
                  </div>

                  {!isFirstTime && (
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="date"
                        value={lastDonation}
                        onChange={(e) => setLastDonation(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Availability Status */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Your Donation Availability:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAvailability('now')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        availability === 'now'
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-400'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold text-xs block">🟢 Available Now</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Can visit hospital within 1-2 hours</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAvailability('emergency')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        availability === 'emergency'
                          ? 'bg-amber-50 border-amber-400 text-amber-900 ring-1 ring-amber-400'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold text-xs block">🟡 Available in Emergency</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Call on-demand when critical</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAvailability('not_available')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        availability === 'not_available'
                          ? 'bg-red-50 border-red-300 text-red-900 ring-1 ring-red-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold text-xs block">🔴 Not Available</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Record profile for later</span>
                    </button>
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Preferred Emergency Contact Method:
                  </label>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-700 flex-wrap">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        checked={contactMethod === 'phone'}
                        onChange={() => setContactMethod('phone')}
                        className="text-brand-red focus:ring-brand-red"
                      />
                      <span>📞 Direct Phone Call</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        checked={contactMethod === 'whatsapp'}
                        onChange={() => setContactMethod('whatsapp')}
                        className="text-brand-red focus:ring-brand-red"
                      />
                      <span>💬 WhatsApp Message</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        checked={contactMethod === 'sms'}
                        onChange={() => setContactMethod('sms')}
                        className="text-brand-red focus:ring-brand-red"
                      />
                      <span>📩 SMS Alert</span>
                    </label>
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 leading-relaxed">
                    <input
                      type="checkbox"
                      required
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-brand-red focus:ring-brand-red"
                    />
                    <span>
                      I confirm that the information provided is correct, and I am in good physical health to volunteer for blood donation at <strong>{hospital.name}</strong>.
                    </span>
                  </label>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-glow-red hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <Droplet className="w-5 h-5 fill-current text-white group-hover:scale-110 transition-transform" />
                  <span>
                    {isEmergencyMatch
                      ? `🩸 Respond to This Emergency at ${hospital.name}`
                      : '🩸 Register as Blood Donor'}
                  </span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </form>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © 2026 HemoVite. All Rights Reserved. • Verified Volunteer Transfusion Network
      </footer>

    </div>
  );
};
