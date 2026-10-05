import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  Lock,
  Search,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { REGISTERED_HOSPITALS } from '../../data/mockData';

export const HospitalStaffLogin = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');

  const filteredHospitals = REGISTERED_HOSPITALS.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedHospital = REGISTERED_HOSPITALS.find((h) => h.id === selectedId);

  const handleContinue = () => {
    if (!selectedId) {
      setError('Please select your hospital before continuing.');
      return;
    }
    navigate(`/hospital/${selectedId}/auth`);
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white relative overflow-x-hidden">

      {/* BACKGROUND AMBIENT ACCENTS */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <header className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between relative z-10">
        <Link
          to="/hospitals"
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
          aria-label="Return to hospitals directory"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hospitals</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-red flex items-center justify-center text-white shadow-md shadow-brand-red/30">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">
            Hemo<span className="text-brand-bright">Vite</span>
          </span>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-4">
        <div className="w-full max-w-lg bg-[#111827]/95 border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl space-y-7">

          {/* IDENTITY BADGE */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
              <Lock className="w-7 h-7 text-slate-300" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Staff Access Portal</h1>
              <p className="text-sm text-slate-400 mt-1">
                Select your registered hospital to continue to the administrator login.
              </p>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-white/10" />

          {/* HOSPITAL SELECTOR */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              Select Your Hospital
            </label>

            {/* DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setError('');
                }}
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-900 border transition-all text-sm font-semibold text-left flex items-center justify-between gap-3 ${
                  selectedHospital
                    ? 'border-brand-red/50 text-white'
                    : error
                    ? 'border-red-500 text-slate-400'
                    : 'border-white/15 text-slate-400 hover:border-white/25'
                }`}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                aria-label="Select hospital"
              >
                <span className="truncate flex items-center gap-2">
                  {selectedHospital ? (
                    <>
                      <span className="text-xs font-mono font-bold text-brand-red bg-red-950/50 border border-red-500/30 px-2 py-0.5 rounded-md shrink-0">
                        {selectedHospital.id}
                      </span>
                      <span className="text-white">{selectedHospital.name}</span>
                    </>
                  ) : (
                    '-- Select a registered hospital --'
                  )}
                </span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN PANEL */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2235] border border-white/10 rounded-2xl shadow-2xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* SEARCH INSIDE DROPDOWN */}
                  <div className="p-3 border-b border-white/10">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search hospital name or city..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* HOSPITAL LIST */}
                  <div className="max-h-64 overflow-y-auto overscroll-contain">
                    {filteredHospitals.length === 0 ? (
                      <div className="text-center py-6 text-sm text-slate-500">No hospitals match your search.</div>
                    ) : (
                      filteredHospitals.map((hospital) => (
                        <button
                          key={hospital.id}
                          type="button"
                          role="option"
                          aria-selected={selectedId === hospital.id}
                          onClick={() => {
                            setSelectedId(hospital.id);
                            setDropdownOpen(false);
                            setSearchQuery('');
                            setError('');
                          }}
                          className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors hover:bg-white/5 border-b border-white/5 last:border-0 ${
                            selectedId === hospital.id ? 'bg-brand-red/10' : ''
                          }`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Building2 className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-white truncate">{hospital.name}</div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                {hospital.city}, {hospital.state}
                              </span>
                              <span className="text-[10px] font-mono text-brand-red/70 bg-red-950/40 px-1.5 py-0.5 rounded-md border border-red-900/50">
                                {hospital.id}
                              </span>
                            </div>
                          </div>
                          {selectedId === hospital.id && (
                            <ShieldCheck className="w-4 h-4 text-brand-red ml-auto shrink-0 mt-1" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-xs text-red-400 font-medium ml-1">{error}</p>
            )}

            {/* SELECTED PREVIEW */}
            {selectedHospital && (
              <div className="p-4 bg-brand-red/5 border border-brand-red/20 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
                <div className="w-10 h-10 rounded-xl bg-brand-red/20 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-brand-red" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{selectedHospital.name}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    {selectedHospital.city}, {selectedHospital.state}
                  </div>
                </div>
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 ml-auto shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Verified</span>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedId}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group"
            aria-label="Continue to hospital staff login"
          >
            <span>Continue to Staff Login</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform group-disabled:translate-x-0" />
          </button>

          {/* FOOTNOTE */}
          <p className="text-center text-[11px] text-slate-500 leading-relaxed">
            🔒 This portal is restricted to authorized hospital administrators only.
            <br />Unauthorized access is strictly prohibited and monitored.
          </p>

        </div>
      </main>
    </div>
  );
};
