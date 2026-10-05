import { Search, X, ArrowUpDown, ShieldCheck, Activity, AlertTriangle, Building2, HeartHandshake } from 'lucide-react';

interface BloodBankSearchProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedFilter: 'all' | 'verified' | 'operational' | 'low_stock' | 'ngo';
  onFilterChange: (filter: 'all' | 'verified' | 'operational' | 'low_stock' | 'ngo') => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  availableCities: string[];
  availableStates: string[];
  stats: {
    total: number;
    verified: number;
    operational: number;
    lowStock: number;
    ngoCount: number;
  };
}

export const BloodBankSearch = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  selectedCity,
  onCityChange,
  selectedState,
  onStateChange,
  sortBy,
  onSortChange,
  availableCities,
  availableStates,
  stats,
}: BloodBankSearchProps) => {
  return (
    <div className="space-y-6">
      
      {/* 1. TOP DYNAMIC SUMMARY CARDS (5 METRICS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Blood Banks */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Centers</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">{stats.total}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">HemoVite Grid</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* NGO & Non-Profit */}
        <div 
          onClick={() => onFilterChange(selectedFilter === 'ngo' ? 'all' : 'ngo')}
          className={`cursor-pointer rounded-2xl border p-4 shadow-card-soft flex items-center justify-between transition-all duration-200 ${
            selectedFilter === 'ngo' 
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400' 
              : 'bg-white border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/30'
          }`}
        >
          <div>
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">NGO & Non-Profit</span>
            <div className="text-2xl font-black text-rose-700 mt-0.5 font-mono">{stats.ngoCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Charitable Hubs</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
        </div>

        {/* Verified */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Verified Hubs</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">{stats.verified}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">NABH & CDSCO</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Operational */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">24/7 Active</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">{stats.operational}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Live Dispatches</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Low Reserves</span>
            <div className="text-2xl font-black text-brand-bright mt-0.5 font-mono">{stats.lowStock}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Target Alert Sent</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CONTROLS TOOLBAR */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card-soft space-y-4">
        
        {/* ROW 1: SEARCH BAR & SORT */}
        <div className="flex flex-col lg:flex-row items-center gap-3">
          
          {/* Main search input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search blood bank by name, NGO trust, city, state, or ID (e.g. Red Cross, Rotary, Sankalp, BB-002)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-red" />
              <span className="font-semibold">Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full lg:w-56 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-red transition-all"
            >
              <option value="name_asc">Name A–Z</option>
              <option value="name_desc">Name Z–A</option>
              <option value="highest_stock">Highest Blood Availability</option>
              <option value="lowest_stock">Lowest Blood Availability</option>
              <option value="recently_updated">Recently Updated</option>
              <option value="nearest">Nearest / Location</option>
            </select>
          </div>

        </div>

        {/* ROW 2: QUICK PILLS + LOCATION DROPDOWNS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-slate-100 flex-wrap">
          
          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Filter Status:
            </span>
            {[
              { id: 'all', label: 'All Blood Banks' },
              { id: 'ngo', label: '🤝 NGO & Charitable' },
              { id: 'verified', label: '✓ Verified' },
              { id: 'operational', label: '🟢 Operational' },
              { id: 'low_stock', label: '⚠️ Low Stock' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === f.id
                    ? f.id === 'ngo'
                      ? 'bg-rose-700 text-white shadow-sm ring-1 ring-rose-700'
                      : 'bg-brand-red text-white shadow-sm ring-1 ring-brand-red'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Location Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* City */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold">City:</span>
              <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                <option value="All">All Cities</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold">State:</span>
              <select
                value={selectedState}
                onChange={(e) => onStateChange(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                <option value="All">All States</option>
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {(searchQuery || selectedFilter !== 'all' || selectedCity !== 'All' || selectedState !== 'All') && (
              <button
                onClick={() => {
                  onSearchChange('');
                  onFilterChange('all');
                  onCityChange('All');
                  onStateChange('All');
                }}
                className="text-xs font-bold text-brand-red hover:underline ml-1"
              >
                Reset
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
