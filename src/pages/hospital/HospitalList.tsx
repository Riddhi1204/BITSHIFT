import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowLeft, ShieldCheck, Search, Sparkles, PlusCircle, Lock } from 'lucide-react';
import { REGISTERED_HOSPITALS } from '../../data/mockData';
import { HospitalCard } from '../../components/hospital/HospitalCard';
import { HospitalSearch } from '../../components/hospital/HospitalSearch';

export const HospitalList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    // Smooth initial loading skeleton simulation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  const availableCities = useMemo(() => {
    const cities = Array.from(new Set(REGISTERED_HOSPITALS.map((h) => h.city)));
    return cities.sort();
  }, []);

  const filteredHospitals = useMemo(() => {
    return REGISTERED_HOSPITALS.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity = selectedCity === 'All' || h.city === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [searchQuery, selectedCity]);

  const handleSelectHospital = (hospitalId: string) => {
    navigate(`/hospital/${hospitalId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-brand-red selection:text-white">
      
      {/* TOP DIRECTORY HEADER BAR */}
      <header className="bg-[#0B1220] text-white border-b border-white/10 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <div className="h-5 w-px bg-white/15 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-white shadow-sm">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-black text-white leading-none">
                  Hemo<span className="text-brand-bright">Vite</span>
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  Hospital Network Directory
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* STAFF ACCESS BUTTON */}
            <Link
              to="/hospital/staff-login"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 hover:border-white/25 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-brand-red/50"
              aria-label="Hospital staff access portal"
              title="Authorized hospital staff login"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Staff Access</span>
              <span className="sm:hidden">Staff</span>
            </Link>

            <span className="text-xs text-slate-300 hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>National Health Grid Verified</span>
            </span>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* PAGE TITLE & SUBTITLE */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100 text-brand-red text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hospital Network Registry</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Registered Hospitals
          </h1>

          <p className="text-base sm:text-lg text-slate-600">
            Find and view clinical blood requirements, emergency shortages, and hospital details across the network.
          </p>
        </div>

        {/* SEARCH & FILTERS TOOLBAR */}
        <HospitalSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          availableCities={availableCities}
          totalCount={filteredHospitals.length}
        />

        {/* LOADING SKELETON STATE */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-soft animate-pulse space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredHospitals.length > 0 ? (
          /* HOSPITAL CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <HospitalCard
                key={hospital.id}
                hospital={hospital}
                onSelect={handleSelectHospital}
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-card-soft">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                No hospitals registered yet matching your criteria
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Once hospitals join the HemoVite platform or match your search filters, they will appear here.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('All');
                }}
                className="px-5 py-2.5 bg-brand-red text-white font-bold text-xs rounded-xl shadow hover:bg-red-700 transition-all"
              >
                Clear Search Filters
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM ONBOARDING NOTE */}
        <div className="bg-gradient-to-r from-[#0B1220] to-[#111827] text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Is your healthcare institution not listed yet?</span>
            </h4>
            <p className="text-xs text-slate-400">
              Submit your hospital registration request to connect your clinical blood bank node.
            </p>
          </div>

          <Link
            to="/#contact"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs whitespace-nowrap transition-all"
          >
            Apply for Verification
          </Link>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © 2026 HemoVite. All Rights Reserved. • National Blood Availability & Shortage Prediction Grid
      </footer>

    </div>
  );
};
