import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplet, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  PlusCircle, 
  HeartHandshake, 
  Globe, 
  PhoneCall, 
  Award,
  ArrowRight
} from 'lucide-react';
import { REGISTERED_BLOOD_BANKS, MOCK_NGO_PARTNERS } from '../../data/mockData';
import { BloodBankCard } from '../../components/bloodbank/BloodBankCard';
import { BloodBankSearch } from '../../components/bloodbank/BloodBankSearch';

export const BloodBankList = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'operational' | 'low_stock' | 'ngo'>('all');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [sortBy, setSortBy] = useState('highest_stock');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  const availableCities = useMemo(() => {
    return Array.from(new Set(REGISTERED_BLOOD_BANKS.map((b) => b.city))).sort();
  }, []);

  const availableStates = useMemo(() => {
    return Array.from(new Set(REGISTERED_BLOOD_BANKS.map((b) => b.state))).sort();
  }, []);

  // Summary counts
  const stats = useMemo(() => {
    const total = REGISTERED_BLOOD_BANKS.length;
    const verified = REGISTERED_BLOOD_BANKS.filter((b) => b.verified).length;
    const operational = REGISTERED_BLOOD_BANKS.filter((b) => b.status === 'operational').length;
    const lowStock = REGISTERED_BLOOD_BANKS.filter((b) => {
      // Check if any critical group has <= 5 units
      return Object.values(b.inventory).some((u: number) => u <= 5);
    }).length;
    const ngoCount = REGISTERED_BLOOD_BANKS.filter((b) => b.ngoPartner).length;

    return { total, verified, operational, lowStock, ngoCount };
  }, []);

  // Filtered and sorted results
  const filteredBloodBanks = useMemo(() => {
    let result = REGISTERED_BLOOD_BANKS.filter((bank) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        bank.name.toLowerCase().includes(q) ||
        bank.id.toLowerCase().includes(q) ||
        bank.city.toLowerCase().includes(q) ||
        bank.state.toLowerCase().includes(q) ||
        bank.address.toLowerCase().includes(q) ||
        (bank.initiative && bank.initiative.toLowerCase().includes(q)) ||
        (bank.organizationType && bank.organizationType.toLowerCase().includes(q));

      const matchesFilter =
        selectedFilter === 'all'
          ? true
          : selectedFilter === 'ngo'
          ? bank.ngoPartner === true
          : selectedFilter === 'verified'
          ? bank.verified
          : selectedFilter === 'operational'
          ? bank.status === 'operational'
          : selectedFilter === 'low_stock'
          ? Object.values(bank.inventory).some((u: number) => u <= 5)
          : true;

      const matchesCity = selectedCity === 'All' || bank.city === selectedCity;
      const matchesState = selectedState === 'All' || bank.state === selectedState;

      return matchesSearch && matchesFilter && matchesCity && matchesState;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'highest_stock') return b.totalUnits - a.totalUnits;
      if (sortBy === 'lowest_stock') return a.totalUnits - b.totalUnits;
      if (sortBy === 'recently_updated') return a.lastUpdated.localeCompare(b.lastUpdated);
      return 0;
    });

    return result;
  }, [searchQuery, selectedFilter, selectedCity, selectedState, sortBy]);

  const handleNgoFilterSelect = (ngoName: string) => {
    // Extract a search term from NGO name (e.g., "Red Cross", "Rotary", "Sankalp", "Think Foundation", "Lions", "Khoon")
    const simplified = ngoName.includes('Red Cross')
      ? 'Red Cross'
      : ngoName.includes('Rotary')
      ? 'Rotary'
      : ngoName.includes('Sankalp')
      ? 'Sankalp'
      : ngoName.includes('Think')
      ? 'Think Foundation'
      : ngoName.includes('Lions')
      ? 'Lions'
      : ngoName.includes('Khoon')
      ? 'Khoon'
      : ngoName;

    setSearchQuery(simplified);
    setSelectedFilter('all');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-brand-red selection:text-white">
      
      {/* TOP DIRECTORY HEADER */}
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
              <div className="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-sm">
                <Droplet className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="text-base font-black text-white leading-none">
                  Hemo<span className="text-brand-bright">Vite</span>
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  National Blood Bank & NGO Directory
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>National Blood Supply Grid Connected</span>
            </span>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* PAGE TITLE & SUBTITLE */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100 text-brand-red text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Blood Bank & Voluntary NGO Central Registry</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Registered Blood Banks & NGO Partners
          </h1>

          <p className="text-base sm:text-lg text-slate-600">
            Find and access verified blood banks, charitable foundations, and humanitarian NGO networks connected to HemoVite.
          </p>
        </div>

        {/* SEARCH, SUMMARY METRICS & CONTROLS TOOLBAR */}
        <BloodBankSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          selectedState={selectedState}
          onStateChange={setSelectedState}
          sortBy={sortBy}
          onSortChange={setSortBy}
          availableCities={availableCities}
          availableStates={availableStates}
          stats={stats}
        />

        {/* SECTION 1: BLOOD BANK DIRECTORY LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>Blood Banks & Storage Centers</span>
                <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
                  {filteredBloodBanks.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Live blood inventory ledgers and facility administration access points.
              </p>
            </div>

            {selectedFilter === 'ngo' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Showing NGO & Charitable Centers Only</span>
              </span>
            )}
          </div>

          {/* LOADING SKELETON */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card-soft animate-pulse space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-20 bg-slate-100 rounded-xl" />
                  <div className="h-10 bg-slate-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredBloodBanks.length > 0 ? (
            /* BLOOD BANK CARDS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBloodBanks.map((bank) => (
                <BloodBankCard key={bank.id} bloodBank={bank} />
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
                  No blood banks found matching your search criteria
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Try adjusting your city/state filters, clearing the search query, or selecting "All Blood Banks".
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                    setSelectedCity('All');
                    setSelectedState('All');
                  }}
                  className="px-5 py-2.5 bg-brand-red text-white font-bold text-xs rounded-xl shadow hover:bg-red-700 transition-all"
                >
                  Reset Search Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: DEDICATED NGO & HUMANITARIAN BLOOD NETWORKS SHOWCASE */}
        <div className="space-y-6 pt-6 border-t border-slate-200/80">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-200">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Voluntary Donor Mobilization</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Partner NGO & Humanitarian Blood Networks
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Collaborating with recognized non-profits and volunteer organizations to organize mobile blood camps, manage rare blood registries, and provide zero-replacement transfusions for Thalassemia patients.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedFilter('ngo');
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2.5 rounded-xl transition-all self-start md:self-auto"
            >
              <span>View All NGO Blood Banks ({stats.ngoCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_NGO_PARTNERS.map((ngo) => (
              <div
                key={ngo.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card-soft hover:shadow-card-elevated hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-rose-700 transition-colors">
                          {ngo.name}
                        </h3>
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${ngo.badgeColor}`}>
                          {ngo.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Focus & Mission */}
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Core Initiative & Mission
                      </span>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {ngo.focus}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 pt-1 text-[11px]">
                      <span className="font-semibold text-slate-700">Footprint:</span>
                      <span className="font-medium text-slate-600">{ngo.reach}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 mt-5 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <a
                      href={`tel:${ngo.phone}`}
                      className="flex items-center gap-1.5 font-bold text-slate-800 hover:text-rose-700 transition-colors font-mono"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
                      <span>{ngo.phone}</span>
                    </a>

                    <a
                      href={`https://${ngo.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{ngo.website}</span>
                    </a>
                  </div>

                  <button
                    onClick={() => handleNgoFilterSelect(ngo.name)}
                    className="w-full py-2 px-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Search Connected {ngo.name.split(' ')[0]} Hubs</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* BOTTOM ONBOARDING BANNER */}
        <div className="bg-gradient-to-r from-[#0B1220] to-[#111827] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <span>Are you a registered Blood Bank, NGO or Charitable Trust?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Integrate your blood storage ledger or voluntary donor pool with HemoVite's AI-enabled shortage prediction and emergency grid.
            </p>
          </div>

          <Link
            to="/#contact"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs whitespace-nowrap transition-all"
          >
            Apply for Verification
          </Link>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © 2026 HemoVite. All Rights Reserved. • National Blood Availability & Shortage Prediction Network
      </footer>

    </div>
  );
};
