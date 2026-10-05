import { Search, X, Filter, Building2 } from 'lucide-react';

interface HospitalSearchProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  availableCities: string[];
  totalCount: number;
}

export const HospitalSearch = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  availableCities,
  totalCount,
}: HospitalSearchProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card-soft space-y-4">
      
      {/* SEARCH INPUT ROW */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by hospital name (e.g. Raj Hospital), ID (e.g. HOS-001), or location..."
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

        {/* CITY FILTER DROPDOWN */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5 text-brand-red" />
            <span className="font-semibold">City:</span>
          </div>

          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full md:w-44 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-red transition-all"
          >
            <option value="All">All Cities ({totalCount})</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* QUICK CITY PILLS */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Quick Filter:
          </span>
          <button
            onClick={() => onCityChange('All')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedCity === 'All'
                ? 'bg-brand-red text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {availableCities.slice(0, 5).map((city) => (
            <button
              key={city}
              onClick={() => onCityChange(city)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCity === city
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>{totalCount} Verified Facilities</span>
        </div>
      </div>

    </div>
  );
};
