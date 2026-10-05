import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Droplet, ArrowRight, Loader2 } from 'lucide-react';
import { citizenApi } from '../../services/citizenApi';

export const CitizenFindBlood = () => {
  const [bloodGroup, setBloodGroup] = useState('O-');
  const [location, setLocation] = useState('Ranchi');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const performSearch = async (group: string, city: string) => {
    setIsSearching(true);
    try {
      const res = await citizenApi.searchNearby({ bloodGroup: group, city });
      if (Array.isArray(res)) {
        setResults(res);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Failed to search nearby blood inventory:', err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    performSearch(bloodGroup, location);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(bloodGroup, location);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* SEARCH BAR */}
      <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Droplet className="w-5 h-5 text-brand-red" />
            </div>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/10 focus:border-brand-red/50 rounded-xl text-white font-bold appearance-none outline-none cursor-pointer"
            >
              <option value="A+">A+ Blood</option>
              <option value="A-">A- Blood</option>
              <option value="B+">B+ Blood</option>
              <option value="B-">B- Blood</option>
              <option value="AB+">AB+ Blood</option>
              <option value="AB-">AB- Blood</option>
              <option value="O+">O+ Blood</option>
              <option value="O-">O- Blood</option>
            </select>
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Location / City"
              className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/10 focus:border-brand-red/50 rounded-xl text-white outline-none"
            />
          </div>

          <button
            type="submit"
            className="md:w-32 py-4 bg-brand-red hover:bg-red-600 text-white font-black rounded-xl shadow-lg shadow-brand-red/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* FILTERS */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Verified PostgreSQL Resources</h2>
        <span className="text-xs font-mono font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          Live Central Inventory Matrix
        </span>
      </div>

      {/* RESULTS LIST */}
      <div className="space-y-4">
        {isSearching ? (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 text-brand-red animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Searching PostgreSQL live inventory...</p>
          </div>
        ) : (
          results.map((result, idx) => (
            <div key={result.id || idx} className="bg-[#111827] border border-white/10 hover:border-white/20 transition-all rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              
              <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="w-16 h-16 shrink-0 bg-brand-red/10 rounded-2xl flex items-center justify-center border border-brand-red/20">
                  <div className="text-center">
                    <div className="text-xl font-black text-brand-red leading-none">{result.available || result.units || 0}</div>
                    <div className="text-[10px] font-bold text-red-300 uppercase mt-1">Units</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black text-white">{result.name}</h3>
                    {result.verified && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded uppercase border border-blue-500/30">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {result.distance || result.city || 'Nearby'}</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full hidden sm:block"></span>
                    <span>Updated {result.lastUpdated || 'Live'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                {result.contact && (
                  <a
                    href={`tel:${result.contact}`}
                    className="flex-1 sm:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>Contact</span>
                  </a>
                )}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(result.name || 'Hospital')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-6 py-3 bg-brand-red/10 hover:bg-brand-red hover:text-white text-brand-red font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-brand-red/20"
                >
                  <span>Directions & Info</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))
        )}
        
        {/* EMPTY STATE */}
        {!isSearching && results.length === 0 && (
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <Search className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No blood available in this area</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              We couldn't find verified {bloodGroup} blood within your current search area. Consider creating an emergency request to notify donors directly.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
