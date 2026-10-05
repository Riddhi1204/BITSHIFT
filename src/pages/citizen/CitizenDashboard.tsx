import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Building2, AlertTriangle, AlertCircle, ArrowRight, MapPin } from 'lucide-react';
import { citizenApi } from '../../services/citizenApi';

export const CitizenDashboard = () => {
  const [stats, setStats] = useState({
    donated: 6,
    received: 2,
    hospitalsNearby: 12,
    activeRequests: 3
  });

  const [donationProgress, setDonationProgress] = useState({
    total: 6,
    lastDonated: '12 Aug 2026',
    nextEligible: '12 Nov 2026',
    streak: 3
  });

  const [nearbyHospitals, setNearbyHospitals] = useState<any[]>([
    { id: 1, name: 'City Hospital', distance: '2.4 km', availableGroups: ['A+', 'B+', 'O+', 'O-'], status: 'Available', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { id: 2, name: 'RIMS Hospital', distance: '4.8 km', availableGroups: ['O-', 'B-'], status: 'Limited', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ]);

  const [, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    citizenApi.getDashboard()
      .then((res: any) => {
        if (!isMounted) return;
        if (res) {
          if (res.stats) {
            setStats(res.stats);
          } else if (res.totalDonations !== undefined) {
            setStats((prev) => ({
              ...prev,
              donated: res.totalDonations,
              activeRequests: res.bloodRequests?.length || prev.activeRequests,
            }));
          }
          if (res.donationProgress) {
            setDonationProgress(res.donationProgress);
          } else if (res.eligibility) {
            setDonationProgress((prev) => ({
              ...prev,
              total: res.totalDonations || prev.total,
              lastDonated: res.eligibility.lastDonationDate || prev.lastDonated,
              nextEligible: res.eligibility.nextEligibleDate || prev.nextEligible,
            }));
          }
          if (res.nearbyHospitals && res.nearbyHospitals.length > 0) {
            setNearbyHospitals(res.nearbyHospitals);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load citizen dashboard telemetry:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. I NEED BLOOD URGENTLY - PROMINENT EMERGENCY CARD */}
      <div className="bg-gradient-to-r from-brand-red to-red-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-brand-red/20 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-8 h-8 text-white animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">I Need Blood Urgently</h2>
          </div>
          <p className="text-red-100 text-sm sm:text-base font-medium max-w-xl">
            Create an emergency blood request and find verified nearby resources. Notifications will be sent to matched donors and hospitals immediately via PostgreSQL network grid.
          </p>
        </div>
        <Link 
          to="/citizen/request-blood"
          className="relative z-10 whitespace-nowrap px-8 py-4 bg-white text-brand-red hover:bg-slate-50 font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center gap-2 text-base sm:text-lg"
        >
          <span>Request Blood Now</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/5 rounded-full blur-xl -mr-10 -mt-10 group-hover:bg-brand-red/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center border border-brand-red/20">
              <Droplet className="w-5 h-5 text-brand-red" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{stats.donated} <span className="text-sm font-bold text-slate-400">Donations</span></div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Thank you for saving lives.</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <Heart className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{stats.received} <span className="text-sm font-bold text-slate-400">Units</span></div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Help received through HemoVite</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{stats.hospitalsNearby} <span className="text-sm font-bold text-slate-400">Available</span></div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Verified hospitals near you</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl -mr-10 -mt-10 group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{stats.activeRequests} <span className="text-sm font-bold text-slate-400">Emergency</span></div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Active requests in your area</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. YOUR DONATION JOURNEY */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl lg:col-span-1 flex flex-col">
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-brand-red" />
            Your Donation Journey
          </h3>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-brand-red/30 relative">
                <div className="absolute inset-0 rounded-full border-4 border-brand-red border-t-transparent -rotate-45"></div>
                <div className="text-3xl font-black text-white">{donationProgress.total}</div>
              </div>
              <div className="text-sm font-bold text-slate-300 mt-3 uppercase tracking-wider">Total Donations</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Last Donated</div>
                <div className="text-sm font-bold text-white">{donationProgress.lastDonated}</div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Next Eligible</div>
                <div className="text-sm font-bold text-white">{donationProgress.nextEligible}</div>
              </div>
            </div>

            <div className="bg-brand-red/10 border border-brand-red/20 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs font-bold text-red-300 uppercase">Current Streak</span>
              <span className="text-lg font-black text-brand-red">{donationProgress.streak} 🔥</span>
            </div>
            
            <p className="text-[10px] text-slate-500 text-center italic mt-auto pt-4">
              * Eligibility dates are based on standard 90-day intervals and do not substitute professional medical advice.
            </p>
          </div>
        </div>

        {/* 4. NEARBY HOSPITALS & BLOOD AVAILABILITY */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Nearby Hospitals &amp; Blood Availability
            </h3>
            <Link to="/citizen/hospitals" className="text-xs font-bold text-brand-red hover:text-red-400 transition-colors">
              View All
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {nearbyHospitals.map((hospital, idx) => (
              <div key={hospital.id || idx} className="bg-white/5 border border-white/10 hover:border-white/20 transition-all rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-white">{hospital.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${hospital.bg || 'bg-emerald-500/10'} ${hospital.color || 'text-emerald-400'} ${hospital.border || 'border-emerald-500/20'}`}>
                      {hospital.status || 'Available'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {hospital.distance || 'Near you'}</span>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-slate-500 uppercase font-bold mr-1 self-center">Available:</span>
                    {(hospital.availableGroups || ['A+', 'B+', 'O+', 'O-']).map((bg: string) => (
                      <span key={bg} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded border border-slate-700">
                        {bg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-col shrink-0">
                  <Link
                    to={`/hospital/${hospital.id || 'HOS-001'}`}
                    className="flex-1 sm:flex-none px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition-colors text-center"
                  >
                    View Details
                  </Link>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(hospital.name || 'Hospital')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
