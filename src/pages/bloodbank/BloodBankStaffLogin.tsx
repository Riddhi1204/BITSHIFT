import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Droplet,
  ArrowLeft,
  Lock,
  Search,
  ChevronDown,
  ArrowRight,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { REGISTERED_BLOOD_BANKS } from '../../data/mockData';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import { bloodBankApi } from '../../services/bloodBankApi';
import type { BloodBank } from '../../types';

export const BloodBankStaffLogin = () => {
  const navigate = useNavigate();
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>(REGISTERED_BLOOD_BANKS);
  const [selectedId, setSelectedId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    bloodBankApi.getAll()
      .then((res: any) => {
        if (!isMounted) return;
        if (Array.isArray(res) && res.length > 0) {
          setBloodBanks(res);
        }
      })
      .catch((err) => {
        console.warn('Using fallback blood bank list:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBloodBanks = bloodBanks.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.city && b.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.id && b.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.state && b.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.registrationNumber && b.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedBloodBank = bloodBanks.find((b) => b.id === selectedId || b.registrationNumber === selectedId);

  const handleContinue = () => {
    if (!selectedId) {
      setError('Please select your blood bank before continuing.');
      return;
    }
    const finalId = selectedBloodBank?.id || selectedId;
    navigate(`/blood-bank/${finalId}/auth`);
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white relative overflow-x-hidden">

      {/* BACKGROUND AMBIENT ACCENTS */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <header className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between relative z-10">
        <Link
          to="/blood-banks"
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
          aria-label="Return to blood banks directory"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blood Banks</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-red flex items-center justify-center text-white shadow-md shadow-brand-red/30">
            <Droplet className="w-4 h-4 fill-current" />
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
              <h1 className="text-2xl font-black text-white">Blood Bank Staff Access</h1>
              <p className="text-sm text-slate-400 mt-1">
                Select your registered blood bank or NGO center to continue to the staff authentication portal.
              </p>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-white/10" />

          {/* BLOOD BANK SELECTOR */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-brand-red" />
              Select Your Facility
            </label>

            {/* DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setError('');
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#1E293B]/80 border transition-all text-left cursor-pointer ${
                  error
                    ? 'border-red-500 ring-2 ring-red-500/20'
                    : dropdownOpen
                    ? 'border-brand-red ring-2 ring-brand-red/20 bg-[#1E293B]'
                    : 'border-white/15 hover:border-white/30'
                }`}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
              >
                {selectedBloodBank ? (
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-brand-bright shrink-0">
                      <Droplet className="w-4 h-4 fill-current" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{selectedBloodBank.name}</p>
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        {selectedBloodBank.city}, {selectedBloodBank.state} • ID: {selectedBloodBank.registrationNumber || selectedBloodBank.id}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">Choose a blood bank from the directory...</span>
                )}
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    dropdownOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {/* DROPDOWN MENU */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1E293B] border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* SEARCH IN DROPDOWN */}
                  <div className="p-3 border-b border-white/10 bg-[#111827]">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search blood banks by name or city..."
                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-red"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* LIST */}
                  <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
                    {filteredBloodBanks.length > 0 ? (
                      filteredBloodBanks.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setSelectedId(b.id);
                            setDropdownOpen(false);
                            setError('');
                          }}
                          className={`w-full p-3 text-left hover:bg-white/5 transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                            selectedId === b.id ? 'bg-brand-red/20 text-white' : 'text-slate-300'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{b.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {b.city}, {b.state} • Total Units: {b.totalUnits || 0}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded shrink-0">
                            {b.registrationNumber || b.id?.slice(0, 8)}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="p-4 text-xs text-center text-slate-400">
                        No registered blood banks match "{searchQuery}".
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
          </div>

          {/* ACTION BUTTON */}
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl shadow-brand-red/30 flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.99] cursor-pointer"
          >
            <span>Continue to Staff Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* GOOGLE SSO */}
          <div className="space-y-3 pt-1">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-3 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                Or Instant Staff Login
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <GoogleSignInButton
              role="blood_bank_staff"
              facilityId={selectedId || undefined}
              returnUrl={selectedId ? `/blood-bank/${selectedId}/dashboard` : '/blood-banks'}
              label={selectedBloodBank ? `Sign in with Google (${selectedBloodBank.name})` : 'Sign in with Google (Blood Bank Staff)'}
              variant="light"
            />
          </div>

          {/* HELP NOTE */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Institutional Access Guard</span>
            </div>
            <p>
              Only accredited blood bank managers, laboratory technicians, and transfusion coordinators with authorized HemoVite credentials may access the facility console.
            </p>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="p-4 text-center text-xs text-slate-500 border-t border-white/5">
        © 2026 HemoVite. All Rights Reserved. • Authorized Healthcare Staff Portal
      </footer>

    </div>
  );
};
